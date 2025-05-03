document.addEventListener("DOMContentLoaded", function () {
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
          console.log("Progress updated successfully", data);
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
        });
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

  // Toggle description expand/collapse
  const toggleButton = document.getElementById("toggleDescription");
  const descriptionContent = document.getElementById("descriptionContent");

  if (toggleButton && descriptionContent) {
    toggleButton.addEventListener("click", function () {
      const isCollapsed = descriptionContent.classList.contains("collapsed");

      // Toggle classes
      descriptionContent.classList.toggle("collapsed");
      descriptionContent.classList.toggle("expanded");

      // Update button text and icon
      if (isCollapsed) {
        toggleButton.innerHTML = '<i class="fas fa-chevron-up"></i> Show Less';
      } else {
        toggleButton.innerHTML =
          '<i class="fas fa-chevron-down"></i> Show More';
      }
    });

    // Check if description is long enough to need the toggle button
    function checkDescriptionLength() {
      // Get the content height
      const contentHeight = descriptionContent.scrollHeight;

      // If content is shorter than our max height, don't need the toggle
      if (contentHeight <= 300) {
        toggleButton.style.display = "none";
        descriptionContent.classList.remove("collapsed");
        descriptionContent.classList.add("expanded");
      } else {
        toggleButton.style.display = "inline-flex";
      }
    }

    // Run on page load and window resize
    checkDescriptionLength();
    window.addEventListener("resize", checkDescriptionLength);
  }
});
