const stageComplete = (): string => {
    return `function validateSelect(input, error, dropdownButton) {
        let inputSelect = input.trim();
        if (inputSelect.toUpperCase().includes('SELECCIONE')) {
        error.textContent = 'Por favor, selecciona una opción.';
        dropdownButton.style.borderColor = 'red';
        error.classList.add('error-border');
        return false;
        } else { 
        error.textContent = ''; 
        dropdownButton.style.borderColor = '';
        error.classList.remove('error-border');
        return true; 
        }}
        function loadDataUsers() {
            const name = 'undefined';
            const email = 'undefined';
            const nameField = document.getElementById('contactName') ?? '';
            const emailField = document.getElementById('contactEmail') ?? '';
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
        const totalSlides = carousel.querySelectorAll('.carousel-item').length -1;
        let progressBarWidth = ((currentSlideIndex) / totalSlides) * 100;
          if (progressBarWidth < 100 && currentSlideIndex <= totalSlides) {
             progressBarWidth += 20;
            progressBarComplete.style.width = progressBarWidth + '%';
            progressBarCounter.textContent = currentSlideIndex + 1 +' de '+ totalSlides;
        }}
        function getCurrentSlideIndex(carousel) {
        const activeSlide = carousel.querySelector('.carousel-item.active');
        const slides = Array.from(carousel.querySelectorAll('.carousel-item'));
        const index = slides.indexOf(activeSlide);
        console.log('activeSlide ',index);
        return index === 1 ? 1 : index;
        }
        function checkValidation(input) {
        const activeSlide = input.closest('.carousel-item.active');
        const itemForms = activeSlide.querySelectorAll('.itemForm');
        const checkGroups = activeSlide.querySelectorAll('.itemForm.checkGroup');
        const inputOthers = activeSlide.querySelector('.itemForm.text-Other input[type="text"]');
        const radioButtons = input.closest('.itemForm').querySelectorAll('input[type="radio"]');
        let anyRadio = false;
        let requiresValidation = false;
        let requiresValidationRadio = false;
        for (const checkGroup of checkGroups) {
            const checkboxes = checkGroup.querySelectorAll('input[type="checkbox"]');
            let anyChecked = false;
            for (const checkbox of checkboxes) {
                if (checkbox.getAttribute('data-validation') == 'true') {
                requiresValidation = true;}
                if (checkbox.checked) {
                  if (checkbox.value.toUpperCase().includes('OTRO') && inputOthers.value.trim() == '') {
                      inputOthers.removeAttribute('disabled');}
                      anyChecked = true;
                      break;} }
            if (!anyChecked) {
                if (inputOthers) {
                        if (inputOthers.textContent.trim() == '') {
                            inputOthers.setAttribute('disabled', 'disabled');
                            inputOthers.value = ''; } } }
            if (!anyChecked && requiresValidation) { return false; } }
        if (radioButtons.length > 0) {
        for (const radio of radioButtons) {
            if (radio.getAttribute('data-validation') == 'true') { requiresValidationRadio = true; }
            if (radio.checked) { anyRadio = true; break; }
        }
        if (!anyRadio && requiresValidationRadio) { return false; }} 
        for (const itemForm of itemForms) {
            const textInputs = itemForm.querySelectorAll('input[type="text"]:not(#related_idea_shortText)');
            const emailInputs = itemForm.querySelectorAll('input[type="email"]');
            const telephoneInputs = itemForm.querySelectorAll('input[type="tel"]');
            const urlInputs = itemForm.querySelectorAll('input[type="url"]');
            const textareas = itemForm.querySelectorAll('textarea');
            for (const textInput of textInputs) {
                if (textInput.getAttribute('data-validation') == 'true') {
                if (!textInput.value.trim()) { return false; } } }
            for (const emailInput of emailInputs) {
                console.log(emailInput.getAttribute('id'));
                if (emailInput.getAttribute('data-validation') == 'true') {
                if (!emailInput.value.trim() || !validateEmail(emailInput.getAttribute('id'))) { return false; } } }
            for (const telf of telephoneInputs) {
                if (telf.getAttribute('data-validation') == 'true') {
                if (!telf.value.trim() || !validateTelePhone(telf.getAttribute('id'))) { return false; } } }
            for (const urlValue of urlInputs) {
                if (urlValue.getAttribute('data-validation') == 'true') { if (!urlValue.value.trim() || !validateUrl(urlValue.getAttribute('id'))) { return false; } } }
            for (const dataTextare of textareas) { if (dataTextare.getAttribute('data-validation') == 'true') { if (!dataTextare.value.trim()) { return false; } } } } return true;
}`
};
export default stageComplete;