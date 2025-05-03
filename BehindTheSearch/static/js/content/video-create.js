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
    }
  });

  // File upload handling
  const fileInput = document.querySelector('input[type="file"]');
  const fileNameDisplay = document.getElementById("file-name");
  const uploadProgress = document.getElementById("upload-progress");
  const progressBar = uploadProgress.querySelector(".progress-bar");

  fileInput.addEventListener("change", function (e) {
    if (this.files && this.files[0]) {
      const file = this.files[0];
      fileNameDisplay.textContent = file.name;

      // Reset progress bar
      uploadProgress.classList.add("active");
      progressBar.style.width = "0%";

      // Simulate upload progress (for UI demonstration)
      simulateProgress();
    } else {
      fileNameDisplay.textContent = "No file selected";
      uploadProgress.classList.remove("active");
    }
  });

  // Function to simulate file upload progress
  function simulateProgress() {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 100) {
        progress = 100;
        clearInterval(interval);

        // Hide progress after 1 second of completion
        setTimeout(() => {
          uploadProgress.classList.remove("active");
        }, 1000);
      }
      progressBar.style.width = progress + "%";
    }, 500);
  }
});
