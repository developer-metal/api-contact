const stageComplete = (dataClient: any): string => {
    return `function validateSelect(input, error, dropdownButton) {
        if (input === 'Seleccione una opción') {
        error.textContent = 'Por favor, selecciona una opción.';
        dropdownButton.style.borderColor = 'red';
        error.classList.add('error-border');
        return false;
        } else { 
        error.textContent = ''; 
        dropdownButton.style.borderColor = '';
        error.classList.remove('error-border');
        return true; 
        }
        }
        function loadDataUsers() {
            const name = '${dataClient?.dataParams?.name}';
            const email = '${dataClient?.dataParams?.email}';
            const nameField = document.getElementById('contactName');
            const emailField = document.getElementById('contactEmail');
            const setFieldValue = (field, value) => {
                field.value = (value === 'undefined') ? '' : value;
                field.disabled = (value === 'undefined' || value == '') ? false : true;
            };
            setFieldValue(nameField, name);
            setFieldValue(emailField, email);
        }
        function nextCarrousel() {
        const carousel = document.querySelector('.carousel-inner');
        const progressBarComplete = document.querySelector('.progressBar_complete');
        const progressBarCounter = document.querySelector('.progressBar-counter');
        const currentSlideIndex = getCurrentSlideIndex(carousel);
        const totalSlides = carousel.querySelectorAll('.carousel-item').length;
        let progressBarWidth = ((currentSlideIndex) / totalSlides) * 100;
          if (progressBarWidth < 100 && currentSlideIndex <= totalSlides) {
             progressBarWidth += 25;
         progressBarComplete.style.width = progressBarWidth + '%';
         progressBarCounter.textContent = currentSlideIndex + 1 +' de '+ totalSlides;
        }
        }
        function getCurrentSlideIndex(carousel) {
        const activeSlide = carousel.querySelector('.carousel-item.active');
        const slides = Array.from(carousel.querySelectorAll('.carousel-item'));
        const index = slides.indexOf(activeSlide);
        return index === 0 ? 1 : index + 1;
        }
        function checkValidation(input) {    
        const activeSlide = input.closest('.carousel-item.active');
        const itemForms = activeSlide.querySelectorAll('.itemForm');
        const checkGroups = activeSlide.querySelectorAll('.itemForm.checkGroup');
        const inputOthers = activeSlide.querySelector('.itemForm.text-Other input[type="text"]');
        const radioButtons = input.closest('.itemForm').querySelectorAll('input[type="radio"]');
        let anyRadio = false;
        for (const checkGroup of checkGroups) {
            const checkboxes = checkGroup.querySelectorAll('input[type="checkbox"]');
            let anyChecked = false;
            for (const checkbox of checkboxes) {
                if (checkbox.checked) {
                  if (checkbox.value.includes('(texto corto)') && inputOthers.value.trim() == '') {
                      inputOthers.removeAttribute('disabled');
                  }
                      anyChecked = true;
                      break;
              } 
            }
            if (!anyChecked) {
              if (inputOthers) {
                  if (inputOthers.textContent.trim() == '') {
                      inputOthers.setAttribute('disabled', 'disabled');
                      inputOthers.value = '';
                  }
              }
                      return false;
            }
        }
        if (radioButtons.length > 0) {
        for (const radio of radioButtons) {
            if (radio.checked) {
                anyRadio = true;
                break;
            }
        }
        if (!anyRadio) { return false; }
        } 
        for (const itemForm of itemForms) {
            const textInputs = itemForm.querySelectorAll('input[type="text"]:not(#related_idea_shortText)');
            const emailInputs = itemForm.querySelectorAll('input[type="email"]');
            const textareas = itemForm.querySelectorAll('textarea');
            for (const textInput of textInputs) {
                if (!textInput.value.trim()) { return false; }
              }
            for (const emailInput of emailInputs) {
                if (!emailInput.value.trim()) { return false; }
            }
            for (const textarea of textareas) {
                if (!textarea.value.trim()) { return false; }
            }
        }
        return true;
}`
};
export default stageComplete;