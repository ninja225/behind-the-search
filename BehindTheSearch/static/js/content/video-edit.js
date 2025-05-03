document.addEventListener("DOMContentLoaded", function () {
  // Initialize Quill rich text editor with same config as video-create.js
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
  
  // Store current video's data for validation exceptions
  const currentVideoId = window.location.pathname.split('/').filter(Boolean).pop();
  const initialLessonNumber = lessonNumberInput.value;

  // Set initial content if there's existing description
  if (descriptionInput.value) {
    try {
      // Try parsing as JSON first (Delta format)
      const content = JSON.parse(descriptionInput.value);
      quill.setContents(content);
    } catch (e) {
      // If not JSON, check if it's HTML content
      if (descriptionInput.value.includes('<')) {
        // It's HTML content
        quill.root.innerHTML = descriptionInput.value;
      } else {
        // Plain text
        quill.setText(descriptionInput.value);
      }
    }
  }

  // Handle form submission to update description
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

  // Check if lesson number already exists (excluding the current video)
  lessonNumberInput.addEventListener("blur", function (e) {
    const lessonNumber = this.value.trim();
    if (lessonNumber === "" || lessonNumber === initialLessonNumber) return;

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

  // Setup file upload handling
  const fileInput = document.querySelector('input[type="file"]');
  const fileNameDisplay = document.getElementById("file-name");
  const uploadProgress = document.getElementById("upload-progress");
  const progressBar = uploadProgress?.querySelector(".progress-bar");

  // Save the original filename for reference if user cancels the file selection
  if (fileNameDisplay) {
    fileNameDisplay.setAttribute('data-original', fileNameDisplay.textContent);
  }

  // Add file input change handler
  if (fileInput && fileNameDisplay && uploadProgress && progressBar) {
    fileInput.addEventListener("change", function (e) {
      if (this.files && this.files[0]) {
        const file = this.files[0];
        fileNameDisplay.textContent = file.name;

        // Reset progress bar
        uploadProgress.classList.add("active");
        progressBar.style.width = "0%";

        // Simulate upload progress
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
      } else {
        // If no new file is selected, revert to showing current file name or "No file selected"
        const originalText = fileNameDisplay.getAttribute('data-original') || "No file selected";
        fileNameDisplay.textContent = originalText;
        uploadProgress.classList.remove("active");
      }
    });
  }

  // Delete confirmation modal functionality
  const deleteButton = document.getElementById('deleteButton');
  const deleteModal = document.getElementById('deleteModal');
  const cancelDelete = document.getElementById('cancelDelete');
  
  if (deleteButton && deleteModal && cancelDelete) {
    // Show the modal when delete button is clicked
    deleteButton.addEventListener('click', function() {
      deleteModal.classList.add('active');
    });
    
    // Hide the modal when cancel is clicked
    cancelDelete.addEventListener('click', function() {
      deleteModal.classList.remove('active');
    });
    
    // Close modal when clicking outside
    deleteModal.addEventListener('click', function(e) {
      if (e.target === deleteModal) {
        deleteModal.classList.remove('active');
      }
    });
  }
});