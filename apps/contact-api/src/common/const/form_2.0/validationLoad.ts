const validationLoadScript = (): string => {
return `document.addEventListener('DOMContentLoaded', (event) => {
    validateAndSendCES();
    loadDataUsers();
    loadNotifications('hidden');
        const activeSlides = document.querySelectorAll('.carousel-item');
        let enviarButtonListenerAdded = false;
        let requiredTextArea = false;
        activeSlides.forEach((slide,index) => { 
const title_position = [ { name: 'Información de tu startup', position: 1 }, { name: 'Información de contacto', position: 6 }];
        slide.addEventListener('transitionend', (event) => {
            if (index > 0 && slide.classList.contains('active')) { 
            const dropdownSelec = slide.querySelectorAll('.content-select'); 
             const elementCheck = slide.querySelectorAll('.checkGroup');
             const radioButtons = slide.querySelectorAll('.itemForm input[type="radio"]');
             const textareas = slide.querySelectorAll('.itemForm textarea');
            elementCheck.forEach(checkElement => {
                checkElement.addEventListener('change', function(event) {
                    const focusedElement = event.target;
                if (event.target.type === 'checkbox') {
                        const errorChexbox = focusedElement.closest('.checkGroup').querySelector('.error-message');
                        const checkboxes = focusedElement.closest('.checkGroup').querySelectorAll('input[type="checkbox"]');
                        const elementChck = focusedElement.closest('.form-check');
                        validateCheckboxes(checkboxes, errorChexbox, elementChck);
                   }
                 });
            });
                radioButtons.forEach(radioButton => { radioButton.addEventListener('blur', function(event) {
                        event.preventDefault();
                        const selectedRadioButton = event.target;
                    if (event.target.type === 'radio') {const errorRadio = selectedRadioButton.closest('.itemForm').querySelector('.error-message');
                        const radioGroup = selectedRadioButton.closest('.itemForm').querySelectorAll('input[type="radio"]');
                        const elementRadio = selectedRadioButton.closest('.form-check');
                            validateRadio(radioGroup, errorRadio, elementRadio);
                    }
                });
            });
            dropdownSelec.forEach(dropdownSelec => { const dropdown = dropdownSelec.querySelector('.dropdown-toggle');
                const button = dropdownSelec.querySelector('.nextButton');
                const errorElement = dropdownSelec.querySelector('.error-message');
                dropdown.addEventListener('focus',  async function(event) {
                const selectedOption = event.target.textContent.trim();
                const dropdownId = dropdown.getAttribute('id');
                const errorId = errorElement.getAttribute('id');
                        validateSelect(selectedOption, errorElement, dropdown);
                        const selectdata = await getSelection(dropdownId, errorId);
                });
                });
                textareas.forEach(textarea => {
                    if (event.target.getAttribute('data-validation') == 'true') { requiredTextArea = true; }
                textarea.addEventListener('input', function(event) {
                    const contenido = event.target.value.trim();
                    if (event.target.tagName === 'TEXTAREA' && requiredTextArea) {                        
                        const elementTextareaMessa = event.target.closest('.itemForm');
                        const elementTextarea = event.target.closest('.itemForm textarea');
                        const errorElement = elementTextareaMessa.querySelector('.error-message');
                        validateTextarea(contenido, errorElement, elementTextarea);
                    }
                });
            });
                const continueButton = slide.querySelector('.nextButton:not(.nextButton-enviar)');
                const enviarButton = slide.querySelector('.nextButton.nextButton-enviar');
                if (enviarButton && enviarButton.textContent.trim() === 'Enviar') {
                    if (!enviarButtonListenerAdded) {
                    enviarButtonListenerAdded = true;
                    enviarButton.removeAttribute('onclick');
                    enviarButton.removeAttribute('data-bs-target');
                    enviarButton.removeAttribute('data-bs-slide');
                    enviarButton.addEventListener('click', function(event) {
                            enviarButton.setAttribute('disabled', 'disabled');
                            updateStageSend();
                            sendResponseForm(fields);
                    });}
                } else if (continueButton && continueButton.textContent.trim() === 'Continuar') {
                    continueButton.addEventListener('click', function(event) { updateStageSend(); });
                }
                const inputs = slide.querySelectorAll('.dropdown-toggle, input[type="email"], input[type="checkbox"], input[type="radio"], textarea, input[type="file"], input[type="tel"], input[type="url"], input[type="text"]:not(#related_idea_shortText)');
                inputs.forEach(input => {
                    input.addEventListener('input', async  function(event) {
                      const allInputsValid = [...inputs].every(input => { return checkValidation(input); });
                        let continueButtons = slide.querySelectorAll('.nextButton');
                        if (allInputsValid){ continueButtons.forEach(button => { button.disabled = false; });
                        } else { const continueButtons = slide.querySelectorAll('.nextButton'); continueButtons.forEach(button => { button.disabled = true; });
                        }
                    });
                });
            }
        });});
           const newIdea = document.querySelector('.nextButton.nextButton-otherIdea');
           newIdea.addEventListener('click', function(event) { resetDataForm(); });
        const retryForm = document.querySelector('.endButtons.error .nextButton.nextButton-enviar');
        if (retryForm && retryForm.textContent.trim() === 'Reintentar') {
                retryForm.addEventListener('click', function(event) {
                        retryForm.setAttribute('disabled', 'disabled');
                        validationSendForm(fields);
                    }); }
});`
};
export default validationLoadScript;