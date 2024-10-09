const stageNext = (): string => {
    return `function validateText(inputId) {
        const inputElement = document.getElementById(inputId);
        const errorElement = document.getElementById(inputId + 'Error');
        if (inputElement) {
            const inputValue = inputElement.value.trim();
            if (inputValue === '') {
                errorElement.classList.add('error-border');
                inputElement.style.borderColor = 'red';
                errorElement.textContent = 'Se requiere una respuesta en texto.';
                return false;
            } else { errorElement.classList.remove('error-border'); inputElement.style.borderColor = ''; errorElement.textContent = '';
                return true;
            }
        }
      } 
      function validateEmail(emailId) {
      const emailInput = document.getElementById(emailId);
      const emailError = document.getElementById(emailId+ 'Error');
      const emailValue = emailInput.value.trim();
      if (emailValue === '') {
          emailInput.classList.add('error-border');
          emailInput.style.borderColor = 'red';
          emailError.textContent = 'Se requiere una respuesta en texto.';
          return false;
        } else if (!isValidEmail(emailValue)) {
          emailInput.classList.add('error-border');
          emailInput.style.borderColor = 'red';
          emailError.textContent = 'Introduzca un correo electrónico válido.';
          return false;
        } else {
          emailInput.classList.remove('error-border');
          emailInput.style.borderColor = '';
          emailError.textContent = '';
          return true;
        }
      }
      function isValidEmail(email) {
      const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$/i;
      return emailRegex.test(email);
      }
      function validateRange(rangeId) {
      const range = document.getElementById(rangeId);
        const rangeError = document.getElementById(rangeId+ 'Error');
      if (range.value < 1) {
        rangeError.textContent = 'Por favor, selecciona una respuesta.';
        range.classList.add('error-border');
        return false;
      } else {
        rangeError.textContent = '';
        range.classList.remove('error-border');
        return true;
      }
      }
      function validateRadio(radiokboxes, errorCheck, elementCheck) {
      const isChecked = Array.from(radiokboxes).some(radio => radio.checked);
      if (isChecked) {
              errorCheck.textContent = ''; 
              elementCheck.style.borderColor = '';
              errorCheck.classList.remove('error-border');
              return true;
          } else {
              errorCheck.textContent = 'Debes seleccionar una opción';
              elementCheck.style.borderColor = 'red';
              errorCheck.classList.add('error-border');
              return false;
          }
      }
      function validateCheckboxes(checkboxes, errorCheck, container) {
      const isChecked = Array.from(checkboxes).some(cb => cb.checked);
      if (isChecked) {
          errorCheck.textContent = ''; 
          container.style.borderColor = '';
          errorCheck.classList.remove('error-border');
          return true;
      } else {
          errorCheck.textContent = 'Debes seleccionar al menos una opción';
          container.style.borderColor = 'red';
          errorCheck.classList.add('error-border');
          return false;
      }
      }
      function validateTextarea(textarea, errorElement, elementTextarea) {
      if (textarea.length === 0) {
      errorElement.textContent = 'Se requiere una respuesta en texto.';
      elementTextarea.style.borderColor = 'red';
      errorElement.classList.add('error-border');
      return false;
      } else { 
      errorElement.textContent = '';
      elementTextarea.style.borderColor = '';
      errorElement.classList.remove('error-border');
      return true; 
      }
      }`
};
export default stageNext;