document.addEventListener("DOMContentLoaded", function () {
  // Initialize Video.js player only if not already initialized
  const videoElement = document.getElementById("course-video");
  if (videoElement && !videoElement.player) {
    const player = videojs("course-video", {
      playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
    });

    // Get video ID from the data attribute
    const videoId = videoElement.dataset.videoId;

    // Auto-save video progress
    player.on("timeupdate", function () {
      if (player.currentTime() > 0) {
        localStorage.setItem(`video_progress_${videoId}`, player.currentTime());
      }
    });

    // Resume from last position if available
    const savedTime = localStorage.getItem(`video_progress_${videoId}`);
    if (savedTime && savedTime > 0) {
      player.currentTime(parseFloat(savedTime));
    }

    // Mark as completed automatically when reaching near the end
    player.on("timeupdate", function () {
      const currentTime = player.currentTime();
      const duration = player.duration();

      // Mark as watched when user has seen 90% of the video
      if (duration > 0 && currentTime / duration > 0.9) {
        const markAsWatchedBtn = document.getElementById("markAsWatched");
        if (
          markAsWatchedBtn &&
          !markAsWatchedBtn.classList.contains("watched")
        ) {
          markAsWatchedBtn.click();
        }
      }
    });
  }

  // Calculate and update course progress
  function updateCourseProgress() {
    const lessonItems = document.querySelectorAll('.video-lesson-item');
    const totalLessons = lessonItems.length;
    let completedLessons = 0;
    
    lessonItems.forEach(item => {
      if (item.getAttribute('data-completed') === 'true') {
        completedLessons++;
      }
    });
    
    const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    
    // Update DOM elements
    const progressFill = document.getElementById('courseProgressFill');
    const progressText = document.getElementById('courseProgressText');
    const progressPercentageEl = document.getElementById('courseProgressPercentage');
    
    if (progressFill) {
      progressFill.style.width = `${progressPercentage}%`;
    }
    
    if (progressText) {
      progressText.textContent = `${completedLessons}/${totalLessons} completed`;
    }
    
    if (progressPercentageEl) {
      progressPercentageEl.textContent = `${progressPercentage}%`;
    }
  }
  
  // Initialize progress bar on page load
  updateCourseProgress();

  // Handle mark as watched button
  const markAsWatchedBtn = document.getElementById("markAsWatched");
  if (markAsWatchedBtn) {
    markAsWatchedBtn.addEventListener("click", function () {
      const videoId = this.dataset.videoId;

      // Toggle button state immediately for better UX
      this.classList.toggle("watched");

      if (this.classList.contains("watched")) {
        this.innerHTML =
          '<i class="fas fa-check-circle"></i> Marked as Watched';
      } else {
        this.innerHTML = '<i class="far fa-circle"></i> Mark as Watched';
      }

      // Send AJAX request to update watched status
      fetch(`/content/api/videos/${videoId}/mark-watched/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCsrfToken(),
        },
        body: JSON.stringify({
          watched: this.classList.contains("watched"),
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to update watched status");
          }
          return response.json();
        })
        .then((data) => {
          // Show success toast
          showToast(
            "Progress Updated",
            this.classList.contains("watched")
              ? "Lesson marked as completed!"
              : "Lesson marked as not completed.",
            this.classList.contains("watched") ? "success" : "info"
          );

          // Update the sidebar item status
          const sidebarItem = document.querySelector(
            `.video-lesson-item[data-video-id="${videoId}"]`
          );
          if (sidebarItem) {
            // Update the data-completed attribute
            sidebarItem.setAttribute('data-completed', this.classList.contains("watched") ? 'true' : 'false');
            
            // Update the status element
            const statusEl = sidebarItem.querySelector(".video-lesson-status");
            if (statusEl) {
              if (this.classList.contains("watched")) {
                statusEl.className = "video-lesson-status completed";
                statusEl.innerHTML = '<i class="fas fa-check-circle"></i> Completed';
              } else {
                statusEl.className = "video-lesson-status pending";
                statusEl.innerHTML = '<i class="fas fa-circle"></i> Not started';
              }
            }
          }
          
          // Update progress bar after changing video status
          updateCourseProgress();
        })
        .catch((error) => {
          console.error("Error:", error);
          // Revert UI change on error
          this.classList.toggle("watched");

          if (this.classList.contains("watched")) {
            this.innerHTML =
              '<i class="fas fa-check-circle"></i> Marked as Watched';
          } else {
            this.innerHTML = '<i class="far fa-circle"></i> Mark as Watched';
          }

          showToast(
            "Error",
            "Failed to update progress. Please try again.",
            "error"
          );
        });
    });
  }

  // Toggle sidebar on mobile
  const sidebarToggleBtn = document.getElementById("sidebarToggle");
  const courseSidebar = document.querySelector(".course-sidebar");

  if (sidebarToggleBtn && courseSidebar) {
    sidebarToggleBtn.addEventListener("click", function () {
      courseSidebar.classList.toggle("collapsed");
      this.classList.toggle("active");
    });
  }

  // Helper function to get CSRF token
  function getCsrfToken() {
    const csrfInput = document.querySelector("[name=csrfmiddlewaretoken]");
    if (csrfInput) {
      return csrfInput.value;
    } else {
      // Try to get from cookie
      return document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken="))
        ?.split("=")[1];
    }
  }
});
