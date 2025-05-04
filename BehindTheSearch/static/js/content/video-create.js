document.addEventListener("DOMContentLoaded", function () {
  // Initialize Quill rich text editor with limited text formatting tools only
  const quill = new Quill("#description-editor", {
    theme: "snow",
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        ["clean"],
      ],
    },
    placeholder: "Write a detailed description of your lesson...",
  });

  // Handle form submission
  const form = document.getElementById("video-form");
  const descriptionInput =
    form.querySelector('input[name="description"]') ||
    form.querySelector('textarea[name="description"]');
  const lessonNumberInput = form.querySelector('input[name="lesson_number"]');
  const bunnyVideoIdInput = document.querySelector(
    'input[name="bunny_video_id"]'
  );

  // Set initial content if there's existing description
  if (descriptionInput.value) {
    try {
      // Check if it's JSON (HTML format from Quill)
      const content = JSON.parse(descriptionInput.value);
      quill.setContents(content);
    } catch (e) {
      // If not JSON, it's probably plain text
      quill.setText(descriptionInput.value);
    }
  }

  // Bunny.net video preview functionality
  const previewButton = document.getElementById("preview-bunny-btn");
  const previewContainer = document.querySelector(".bunny-preview");
  const previewIframe = document.getElementById("bunny-preview-iframe");

  previewButton.addEventListener("click", function () {
    const videoId = bunnyVideoIdInput.value.trim();
    const libraryId = "420524"; // Default library ID

    if (videoId) {
      // Update the iframe src
      const embedUrl = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=false&loop=false&muted=false&preload=true&responsive=true`;
      previewIframe.src = embedUrl;

      // Show the preview container
      previewContainer.style.display = "block";

      // Change button text
      previewButton.innerHTML = '<i class="fas fa-sync"></i> Refresh Preview';
    } else {
      // Show error if no video ID
      showToast(
        "Error",
        "Please enter a Bunny.net video ID to preview",
        "error"
      );
    }
  });

  // Check if lesson number already exists
  lessonNumberInput.addEventListener("blur", function (e) {
    const lessonNumber = this.value.trim();
    if (lessonNumber === "") return;

    fetch(`/content/api/check-lesson-number/?number=${lessonNumber}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.exists) {
          // Show toast notification
          showToast(
            "Warning",
            `Lesson number ${lessonNumber} already exists. Please choose a different number.`,
            "warning"
          );
          this.classList.add("error");
        } else {
          this.classList.remove("error");
        }
      })
      .catch((error) => {
        console.error("Error checking lesson number:", error);
      });
  });

  form.addEventListener("submit", function (e) {
    // Get editor content and update hidden field
    const quillContent = quill.root.innerHTML;
    descriptionInput.value = quillContent;

    // Check if lesson number has error class
    if (lessonNumberInput.classList.contains("error")) {
      e.preventDefault();
      showToast(
        "Error",
        "Please resolve the duplicate lesson number issue before submitting.",
        "error"
      );
      lessonNumberInput.focus();
      return;
    }

    // Validate that video ID is provided
    if (!bunnyVideoIdInput.value.trim()) {
      e.preventDefault();
      showToast("Error", "Please enter a Bunny.net video ID", "error");
      bunnyVideoIdInput.focus();
    }
  });
});
