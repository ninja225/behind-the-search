// Register page functionality

document.addEventListener("DOMContentLoaded", function () {
  // Get form elements
  const registerForm = document.getElementById("register-form");
  const passwordInput = document.getElementById("id_password1");
  const confirmPasswordInput = document.getElementById("id_password2");
  const registerButton = document.querySelector(".register-button");
  const strengthProgress = document.querySelector(".strength-progress");
  const termsCheckbox = document.getElementById("terms");

  // Terms modal elements
  const termsModal = document.getElementById("termsModal");
  const openTermsModalBtn = document.getElementById("openTermsModal");
  const closeModalBtn = document.querySelector(".close-modal");
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");
  const modalAgreeCheckbox = document.getElementById("modalAgree");
  const confirmAgreementBtn = document.getElementById("confirmAgreement");

  // Track user interaction with tabs
  let tabsVisited = {
    terms: false,
    privacy: false,
  };
  let tabsScrolled = {
    terms: false,
    privacy: false,
  };

  // Terms modal functionality
  if (openTermsModalBtn && termsModal) {
    // Open modal when terms link is clicked
    openTermsModalBtn.addEventListener("click", function (e) {
      e.preventDefault();
      openTermsModal();
    });

    // Function to open terms modal
    function openTermsModal() {
      termsModal.classList.add("active");
      document.body.style.overflow = "hidden"; // Prevent scrolling behind modal

      // If the terms checkbox is already checked (somehow), uncheck it
      if (termsCheckbox && termsCheckbox.checked) {
        termsCheckbox.checked = false;
      }

      // Reset modal agree checkbox
      if (modalAgreeCheckbox) {
        modalAgreeCheckbox.checked = false;
        modalAgreeCheckbox.disabled = true; // Disable checkbox until requirements are met
      }

      // Disable confirm button
      if (confirmAgreementBtn) {
        confirmAgreementBtn.disabled = true;
      }

      // Set the first tab as visited
      const activeTab = document.querySelector(".tab-button.active");
      if (activeTab) {
        tabsVisited[activeTab.getAttribute("data-tab")] = true;
      }

      // Check scroll status for the active tab content
      checkScrollStatus();

      // Update checkbox status
      updateCheckboxStatus();
    }

    // Prevent direct checkbox interaction - must use the modal
    if (termsCheckbox) {
      termsCheckbox.addEventListener("click", function (e) {
        // If the user tries to check the box directly, prevent it and open the modal
        e.preventDefault();
        openTermsModal();
      });
    }

    // Close modal when close button is clicked
    closeModalBtn.addEventListener("click", function () {
      termsModal.classList.remove("active");
      document.body.style.overflow = "";
    });

    // Close modal when clicking outside of content
    termsModal.addEventListener("click", function (e) {
      if (e.target === termsModal) {
        termsModal.classList.remove("active");
        document.body.style.overflow = "";
      }
    });

    // Tab switching
    tabButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const tabId = this.getAttribute("data-tab");

        // Mark this tab as visited
        tabsVisited[tabId] = true;

        // Update active tab button
        tabButtons.forEach((btn) => btn.classList.remove("active"));
        this.classList.add("active");

        // Show selected tab content
        tabContents.forEach((content) => {
          content.classList.remove("active");
          if (content.id === `${tabId}Tab`) {
            content.classList.add("active");

            // Check scroll status for newly activated tab
            setTimeout(checkScrollStatus, 100);
          }
        });

        // Update checkbox status
        updateCheckboxStatus();
      });
    });

    // Track scrolling in tab content
    tabContents.forEach((content) => {
      content.addEventListener("scroll", function () {
        const tabId = this.id.replace("Tab", "");
        const scrollableHeight = this.scrollHeight - this.clientHeight;

        // Consider scrolled if user has scrolled to 80% of the content
        if (this.scrollTop >= scrollableHeight * 0.8) {
          tabsScrolled[tabId] = true;
          updateCheckboxStatus();
        }
      });
    });

    // Function to check scroll status of active tab
    function checkScrollStatus() {
      const activeTabContent = document.querySelector(".tab-content.active");
      if (activeTabContent) {
        const tabId = activeTabContent.id.replace("Tab", "");
        // For very short content, mark as scrolled automatically
        if (activeTabContent.scrollHeight <= activeTabContent.clientHeight) {
          tabsScrolled[tabId] = true;
        }
      }
    }

    // Function to update checkbox status based on tab interactions
    function updateCheckboxStatus() {
      if (modalAgreeCheckbox) {
        // Enable checkbox only if all tabs are visited and scrolled
        const allTabsVisited = Object.values(tabsVisited).every(
          (value) => value
        );
        const allTabsScrolled = Object.values(tabsScrolled).every(
          (value) => value
        );

        modalAgreeCheckbox.disabled = !(allTabsVisited && allTabsScrolled);

        // If the checkbox is checked but requirements aren't met, uncheck it
        if (modalAgreeCheckbox.checked && modalAgreeCheckbox.disabled) {
          modalAgreeCheckbox.checked = false;
        }
      }
    }

    // Enable/disable confirm button based on checkbox
    if (modalAgreeCheckbox && confirmAgreementBtn) {
      modalAgreeCheckbox.addEventListener("change", function () {
        confirmAgreementBtn.disabled = !this.checked;
      });

      // Confirm agreement and close modal
      confirmAgreementBtn.addEventListener("click", function () {
        if (modalAgreeCheckbox.checked) {
          termsCheckbox.checked = true;
          termsModal.classList.remove("active");
          document.body.style.overflow = "";
        }
      });
    }
  }

  // Password visibility toggle
  const toggleBtns = document.querySelectorAll(".password-toggle");
  toggleBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      const input = document.getElementById(`id_${targetId}`);

      if (input) {
        const type =
          input.getAttribute("type") === "password" ? "text" : "password";
        input.setAttribute("type", type);
        this.querySelector("i").classList.toggle("fa-eye");
        this.querySelector("i").classList.toggle("fa-eye-slash");
      }
    });
  });

  // Password strength meter
  if (passwordInput && strengthProgress) {
    passwordInput.addEventListener("input", function () {
      updatePasswordStrength(this.value);
    });
  }

  // Form validation
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Reset error states
      document.querySelectorAll(".input-container").forEach((container) => {
        container.classList.remove("error");
      });

      let isValid = true;
      const formData = new FormData(registerForm);
      // Collect all validation errors
      let errors = [];

      // Validate required fields
      for (const [name, value] of formData.entries()) {
        if (name === "terms") continue; // Skip checkbox validation here

        if (!value.trim()) {
          const field = registerForm.querySelector(`[name="${name}"]`);
          if (field) {
            const fieldName =
              name.charAt(0).toUpperCase() +
              name.slice(1).replace(/[_1-9]/g, "");
            highlightErrorField(field);
            errors.push(`${fieldName} is required`);
            isValid = false;
          }
        }
      }

      // Validate terms checkbox
      if (termsCheckbox && !termsCheckbox.checked) {
        const container = termsCheckbox.closest(".checkbox-field");
        container.classList.add("error");
        errors.push("You must accept the Terms of Service and Privacy Policy");
        isValid = false;
      }

      // Validate passwords match
      if (
        passwordInput &&
        confirmPasswordInput &&
        passwordInput.value &&
        confirmPasswordInput.value &&
        passwordInput.value !== confirmPasswordInput.value
      ) {
        highlightErrorField(confirmPasswordInput);
        errors.push("Passwords do not match");
        isValid = false;
      }

      // Validate password strength
      if (passwordInput && passwordInput.value) {
        const strength = calculatePasswordStrength(passwordInput.value);
        if (strength < 50) {
          highlightErrorField(passwordInput);
          errors.push("Password is too weak");
          isValid = false;
        }
      }

      // Show consolidated errors if any
      if (errors.length > 0) {
        showValidationErrors(errors);
      }

      // Submit form if valid
      if (isValid) {
        // Show loading state
        registerButton.innerHTML = "<span>Creating account...</span>";
        registerButton.disabled = true;

        // Submit the form
        this.submit();
      }
    });
  }

  // Check for Django messages and convert to toast notifications
  const messages = document.querySelectorAll(".messages .message");
  if (messages.length > 0) {
    messages.forEach((message) => {
      const messageText = message.textContent.trim();
      const messageType = message.classList.contains("message-error")
        ? "error"
        : message.classList.contains("message-success")
        ? "success"
        : message.classList.contains("message-warning")
        ? "warning"
        : "info";

      // Display toast notification
      showToast("Notification", messageText, messageType, 5000);

      // Remove the original message elements
      message.remove();
    });
  }

  // Handle Django form errors
  const formErrors = document.querySelectorAll(".errorlist li");
  if (formErrors.length > 0) {
    let backendErrors = [];
    formErrors.forEach((error) => {
      backendErrors.push(error.textContent.trim());
    });
    showValidationErrors(backendErrors);
  }

  // Handle input events to remove error state
  document.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", function () {
      const container =
        this.closest(".input-container") || this.closest(".checkbox-field");
      if (container) {
        container.classList.remove("error");
      }
    });
  });

  // Helper function to highlight error field
  function highlightErrorField(input) {
    const container =
      input.closest(".input-container") || input.closest(".checkbox-field");
    if (container) {
      container.classList.add("error");
    }
  }

  // Helper function to show validation errors as a single toast
  function showValidationErrors(errors) {
    if (errors.length === 0) return;

    // If just one error, show it directly
    if (errors.length === 1) {
      showToast("Validation Error", errors[0], "error", 5000);
      return;
    }

    // Format multiple errors as a list
    const errorsList = errors.map((error) => `• ${error}`).join("<br>");
    showToast("Please Fix These Errors", errorsList, "error", 7000);
  }

  // Helper function to calculate password strength
  function calculatePasswordStrength(password) {
    let strength = 0;

    // Length check
    if (password.length >= 8) strength += 25;

    // Character type checks
    if (/[A-Z]/.test(password)) strength += 25; // Uppercase
    if (/[0-9]/.test(password)) strength += 25; // Numbers
    if (/[^A-Za-z0-9]/.test(password)) strength += 25; // Special characters

    return strength;
  }

  // Helper function to update password strength meter
  function updatePasswordStrength(password) {
    const strength = calculatePasswordStrength(password);
    strengthProgress.style.width = `${strength}%`;

    // Update color based on strength
    if (strength <= 25) {
      strengthProgress.style.backgroundColor = "var(--Error)";
    } else if (strength <= 50) {
      strengthProgress.style.backgroundColor = "var(--Warning)";
    } else if (strength <= 75) {
      strengthProgress.style.backgroundColor = "var(--Primary)";
    } else {
      strengthProgress.style.backgroundColor = "var(--Success)";
    }
  }
});
