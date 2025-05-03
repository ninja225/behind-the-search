/**
 * Video.js Security Implementation
 * This module enhances Video.js with security features to protect course video content.
 * Works in conjunction with the main security.js file for comprehensive protection.
 */

(function () {
  // Reference to security warning system from main security.js
  const showSecurityWarning = (message) => {
    if (window.showFullscreenWarning) {
      window.showFullscreenWarning(message);
    } else {
      console.warn("Security warning:", message);
    }
  };

  // Store initialized players to prevent duplicate initialization
  const initializedPlayers = new Set();

  /**
   * Initialize security features for a Video.js player
   * @param {object} player - VideoJS player instance
   * @param {HTMLElement} playerElement - DOM element of the player
   */
  const securePlayer = (player, playerElement) => {
    // Skip if already initialized
    if (initializedPlayers.has(playerElement.id)) return;
    initializedPlayers.add(playerElement.id);

    // Add token-based access mechanism
    player.on("ready", function () {
      // Store original source
      const originalSrc = player.src();

      // Ensure playback speed control is visible and working
      if (!player.controlBar.getChild("playbackRateMenuButton")) {
        try {
          const PlaybackRateMenuButton = videojs.getComponent(
            "PlaybackRateMenuButton"
          );
          player.controlBar.addChild(new PlaybackRateMenuButton(player), {}, 7);
        } catch (e) {
          console.error("Failed to add playback rate button:", e);
        }
      }

      // Track seek events to prevent skipping content (optional feature)
      let lastSeekTime = 0;
      player.on("seeking", function () {
        const currentTime = player.currentTime();
        const seekDifference = Math.abs(currentTime - lastSeekTime);

        // Log large seeks for future analytics (can be sent to server)
        if (seekDifference > 30) {
          console.info("Large seek detected:", seekDifference.toFixed(2) + "s");
        }

        lastSeekTime = currentTime;
      });

      // Disable hotkeys for download (common shortcuts)
      player.on("keydown", function (event) {
        const keyCode = event.which;
        // Prevent Ctrl+S, Ctrl+U, Ctrl+Shift+I and other download-related shortcuts
        if (
          (event.ctrlKey && (keyCode === 83 || keyCode === 85)) ||
          (event.ctrlKey && event.shiftKey && keyCode === 73) ||
          keyCode === 123 // F12
        ) {
          event.preventDefault();
          event.stopPropagation();
          return false;
        }
      });

      // Overlay video with a transparent div to prevent direct right-clicks on video
      const videoContainer =
        playerElement.closest(".video-container") ||
        playerElement.parentElement;
      if (videoContainer) {
        const protectionOverlay = document.createElement("div");
        protectionOverlay.className = "video-protection-overlay";
        Object.assign(protectionOverlay.style, {
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1, // Above video but below controls
          pointerEvents: "none", // Allow clicks to pass through
        });

        // Make overlay capture clicks only when controls are hidden
        player.on("useractive", function () {
          protectionOverlay.style.pointerEvents = "none";
        });

        player.on("userinactive", function () {
          protectionOverlay.style.pointerEvents = "auto";
        });

        videoContainer.style.position = "relative";
        videoContainer.appendChild(protectionOverlay);
      }

      // Update content protection when entering/exiting fullscreen
      let watermark = null;

      player.on("fullscreenchange", function () {
        if (player.isFullscreen()) {
          // Add dynamic watermark when in fullscreen mode
          if (!watermark && playerElement.dataset.premium === "true") {
            watermark = document.createElement("div");
            watermark.className = "video-watermark";

            // Get username from the page if available
            const username =
              document.querySelector(".username")?.textContent ||
              "Protected Content";
            const timestamp = new Date().toISOString().split("T")[0];

            watermark.textContent = `${username} • ${timestamp}`;
            Object.assign(watermark.style, {
              position: "absolute",
              bottom: "50px",
              right: "20px",
              color: "rgba(255, 255, 255, 0.7)",
              fontFamily: "Arial, sans-serif",
              fontSize: "16px",
              textShadow: "1px 1px 2px rgba(0, 0, 0, 0.7)",
              zIndex: 2,
              pointerEvents: "none",
              transition: "opacity 0.5s ease",
            });

            player.el().appendChild(watermark);

            // Move watermark position every 10 seconds to prevent easy editing out
            let position = 0;
            const positions = [
              { bottom: "50px", right: "20px" },
              { top: "50px", right: "20px" },
              { top: "50px", left: "20px" },
              { bottom: "50px", left: "20px" },
            ];

            setInterval(() => {
              if (watermark && player.isFullscreen()) {
                position = (position + 1) % positions.length;
                Object.assign(watermark.style, positions[position]);
              }
            }, 10000);
          }

          // Activate additional fullscreen protections
          console.info("Fullscreen mode entered - enhanced security active");
        } else {
          // Remove watermark when exiting fullscreen
          if (watermark) {
            watermark.remove();
            watermark = null;
          }
        }
      });
    });

    // Prevent right-click on video content
    player.on("contextmenu", function (e) {
      e.preventDefault();
      return false;
    });

    // Session-based playback tracking
    let playbackPosition = 0;
    let lastUpdateTime = Date.now();
    const POSITION_UPDATE_INTERVAL = 10000; // 10 seconds

    player.on("timeupdate", function () {
      playbackPosition = player.currentTime();
      const currentTime = Date.now();

      // Update playback position to localStorage/sessionStorage periodically
      if (currentTime - lastUpdateTime > POSITION_UPDATE_INTERVAL) {
        try {
          const videoId = playerElement.dataset.videoId || playerElement.id;
          localStorage.setItem(
            `videoPosition_${videoId}`,
            playbackPosition.toString()
          );
          lastUpdateTime = currentTime;
        } catch (e) {
          console.warn("Error saving playback position:", e);
        }
      }
    });

    // Restore playback position when video is loaded
    player.on("loadedmetadata", function () {
      try {
        const videoId = playerElement.dataset.videoId || playerElement.id;
        const savedPosition = localStorage.getItem(`videoPosition_${videoId}`);

        if (savedPosition && !isNaN(parseFloat(savedPosition))) {
          const position = parseFloat(savedPosition);
          // Only restore if within valid range
          if (position > 0 && position < player.duration() * 0.95) {
            player.currentTime(position);
          }
        }
      } catch (e) {
        console.warn("Error restoring playback position:", e);
      }
    });
  };

  /**
   * Detect and override screen recording attempts
   */
  const preventScreenRecording = () => {
    if (window.navigator && window.navigator.mediaDevices) {
      const originalGetDisplayMedia =
        window.navigator.mediaDevices.getDisplayMedia;

      window.navigator.mediaDevices.getDisplayMedia = function (constraints) {
        // Pause all video players
        document.querySelectorAll(".video-js").forEach((playerElement) => {
          const playerId = playerElement.id;
          if (playerId) {
            const player = videojs.players[playerId];
            if (player && !player.paused()) {
              player.pause();
            }
          }
        });

        // Show security warning
        showSecurityWarning(
          "Screen recording attempt detected. This action has been logged."
        );

        // For future implementation: Log screen recording attempts to server
        try {
          const events = JSON.parse(
            localStorage.getItem("securityEvents") || "[]"
          );
          events.push({
            type: "screen-recording-attempt",
            timestamp: new Date().toISOString(),
          });
          localStorage.setItem("securityEvents", JSON.stringify(events));
        } catch {}

        // Option 1: Block screen recording completely (uncomment to enable)
        /*
        return new Promise((resolve, reject) => {
          reject(new Error('Screen recording is not allowed for this content'));
        });
        */

        // Option 2: Allow but track (current implementation)
        return originalGetDisplayMedia.call(
          window.navigator.mediaDevices,
          constraints
        );
      };
    }
  };

  /**
   * Initialize Video.js players with security features
   */
  const initVideoSecurity = () => {
    // Detect and override screen recording
    preventScreenRecording();

    // Initialize all Video.js players with security
    const players = document.querySelectorAll(".video-js");

    players.forEach(function (playerElement) {
      // Get player ID
      const playerId = playerElement.id;
      if (!playerId) return;

      // Check if player is already initialized
      if (videojs.getPlayers()[playerId]) {
        // Player already exists, apply security
        securePlayer(videojs.getPlayers()[playerId], playerElement);
      } else {
        // Initialize player with options
        const player = videojs(playerId, {
          // Disable right-click menu on video
          userActions: {
            doubleClick: true,
            hotkeys: true,
          },
          // Set secure playback options
          html5: {
            nativeTextTracks: false,
            nativeAudioTracks: false,
            nativeVideoTracks: false,
            vhs: {
              overrideNative: true,
            },
          },
          // Limit caching to protect content
          liveui: false,
          inactivityTimeout: 2000, // Hide controls after 2 seconds of inactivity
          controlBar: {
            pictureInPictureToggle: false, // Disable PiP to prevent screen capture
            fullscreenToggle: true,
            playbackRateMenuButton: true, // Explicitly enable playback speed control
          },
          // Enable playback rate options
          playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
        });

        // Apply security to the newly created player
        securePlayer(player, playerElement);
      }
    });

    // Disable developer tools and add global protection
    addGlobalProtection();
  };

  /**
   * Add global video protection features
   */
  const addGlobalProtection = () => {
    // Prevent dragging video elements
    document.addEventListener("dragstart", function (e) {
      if (e.target.tagName === "VIDEO") {
        e.preventDefault();
        return false;
      }
    });

    // Prevent selecting video elements
    document.addEventListener("selectstart", function (e) {
      if (e.target.tagName === "VIDEO") {
        e.preventDefault();
        return false;
      }
    });

    // Disable video element context menu system-wide (backup protection)
    document.addEventListener(
      "contextmenu",
      function (e) {
        if (
          e.target.tagName === "VIDEO" ||
          e.target.classList.contains("vjs-tech")
        ) {
          e.preventDefault();
          return false;
        }
      },
      true
    );

    // Protect dynamically loaded videos using MutationObserver
    const videoObserver = new MutationObserver((mutations) => {
      let newVideosDetected = false;

      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            // Check if node is an element and contains video-js
            if (node.nodeType === 1) {
              if (node.classList && node.classList.contains("video-js")) {
                newVideosDetected = true;
              } else if (node.querySelectorAll) {
                // Check children for video-js players
                const videos = node.querySelectorAll(".video-js");
                if (videos.length > 0) {
                  newVideosDetected = true;
                }
              }
            }
          });
        }
      });

      // If new videos were added, initialize security
      if (newVideosDetected) {
        // Use setTimeout to ensure VideoJS has initialized
        setTimeout(initVideoSecurity, 100);
      }
    });

    // Start observing for new videos
    videoObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  };

  // Initialize security when DOM is loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initVideoSecurity);
  } else {
    // DOM already loaded, initialize immediately
    initVideoSecurity();
  }

  // Re-initialize when window is fully loaded (to catch late loading players)
  window.addEventListener("load", initVideoSecurity);
})();
