const validationLoadGeneral = (): string => {
return `function validateTelePhone(id) {
    const phoneInput = document.getElementById(id);
    const errorMessage = document.getElementById(id+'Error');
if (phoneInput.getAttribute('data-validation') == 'true' && phoneInput.value.trim() == '') { errorMessage.textContent = 'Este campo es obligatorio.'; phoneInput.style.borderColor = 'red'; errorMessage.classList.add('error-border'); return false; 
        }  else if (phoneInput.validity.patternMismatch) { errorMessage.textContent = 'El número de teléfono debe ser un número de 9 dígitos.';
            phoneInput.style.borderColor = 'red'; errorMessage.classList.add('error-border');
            return false;  } else { errorMessage.textContent = ''; phoneInput.style.borderColor = '';
            errorMessage.classList.remove('error-border'); return true;  } }
function validateUrl(id) {
    const urlInput = document.getElementById(id); const errorMessage = document.getElementById(id+'Error');
    if (urlInput.getAttribute('data-validation') == 'true' && urlInput.value.trim() == '') {
        errorMessage.textContent = 'Este campo es obligatorio.';
        urlInput.style.borderColor = 'red';
        errorMessage.classList.add('error-border');
        return false; } else if (urlInput.validity.patternMismatch) { errorMessage.textContent = 'La URL debe comenzar con http://, https://, o www.';
            urlInput.style.borderColor = 'red'; errorMessage.classList.add('error-border'); return false;
} else { errorMessage.textContent = ''; urlInput.style.borderColor = ''; errorMessage.classList.remove('error-border'); return true; } }        
  function updateStageSend() {
let checkboxConten = [];
fields.fieldsContainer = [];
let labelChexbox = '';
const itemForms = document.querySelectorAll('.carousel-item.active .itemForm');
let dropdownOptionFound = false;
itemForms.forEach(itemForm => { const checkboxes = itemForm.querySelectorAll('input[type="checkbox"]:checked');
    const checkRadio = itemForm.querySelectorAll('input[type="radio"]:checked');
    const textInputs = itemForm.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="url"]');
    const hiddenInputs = itemForm.querySelectorAll('input[type="hidden"][id$="-base64"]');
    let fileContainer = document.querySelector('.fileContainer');
    const loadResponse = fileContainer.querySelector('.uploadFile-container');
    const nameFile = loadResponse.querySelector('.textUpload p:first-child');
    const labelFile = nameFile.querySelector('.noFile');
    const dropdowns = itemForm.querySelectorAll('.dropdown-toggle:not(input)');
    const textareas = itemForm.querySelectorAll('textarea');
    const inputOthers = itemForm.querySelector('.itemForm.text-Other input[type="text"]');
    let idOthers = '';
    if (inputOthers) { idOthers = inputOthers.getAttribute('id'); }
    if (textareas) { textareas.forEach(textarea => { const statement = textarea.previousElementSibling.textContent.trim();
            const response = textarea.value.trim();
            const statementResponse = statement + ' - ' + response;
            dataExists(registeredStatements, statement);
            registeredStatements.add(statementResponse);}); }
    textInputs.forEach(input => { if (input.id != idOthers) { const statement = input.previousElementSibling.textContent.trim(); const response = input.value.trim();
          const statementResponse = statement + ' - ' + response;
          dataExists(registeredStatements, statement);
          registeredStatements.add(statementResponse);} });
      hiddenInputs.forEach(hiddenInput => { const label = labelFile.textContent; const statement = label;
          const response = hiddenInput.value;
          const statementResponse = statement + ' - ' + response;
          dataExists(registeredStatements, statement);
          registeredStatements.add(statementResponse); });
    checkRadio.forEach(radioValue => {
    if (radioValue) { let chexboxContent = Array.from(checkRadio);
        const radioValueCont = chexboxContent.map(radio => radio.value).join(', ');   
        const labelRadiIniti = itemForm.querySelector('label');
        if (labelRadiIniti) { const labelRadio = labelRadiIniti.textContent.trim();
            const statementResponse = labelRadio + ' - ' + radioValueCont;
            dataExists(registeredStatements, labelRadio);
            registeredStatements.add(statementResponse); } } });
    if (checkboxes && itemForm.classList.contains('checkGroup')) { const chexboxContent = Array.from(checkboxes);
        const checkboxValue = chexboxContent.map(checkbox => {
              if (checkbox.value.toUpperCase().includes('OTRO')) { const textOther = inputOthers ? inputOthers.value : checkbox.value;
                  return 'Otro  '+ textOther; } else { return checkbox.value; }
      }).join(', ');
        const chexboiIniti = itemForm.querySelector('label').textContent.trim();
        const statementResponse = chexboiIniti + ' - ' + checkboxValue;
        dataExists(registeredStatements, chexboiIniti);
        registeredStatements.add(statementResponse);
    }
    if (dropdowns) { dropdowns.forEach(dropdown => { if (dropdown && dropdown.parentNode) { const selectedOption = dropdown.textContent.trim(); let selectOption = selectedOption.toUpperCase().includes('SELECCIONE');
            if (!selectOption) { const response = selectedOption;
                const statement = dropdown.previousElementSibling.textContent.trim();
                const statementResponse = statement + '-' + response;
                dataExists(registeredStatements, statement);
                registeredStatements.add(statementResponse); 
                dropdownOptionFound = true; } } }); } });
 formatData(); }
function formatQuestions(questions) { let characterRemove = questions.search(/[!?*]/); return characterRemove === -1 ? questions : questions.substring(0, characterRemove + 1).trim(); }
function formatData() { fields.fieldsContainer = Array.from(registeredStatements).map(statement => {
const [statementText, responseText] = statement.split('-').map(str => str.trim());
return { statement: formatQuestions(statementText), response: responseText };}).filter(item => item.response != ''); }
function dataExists(registeredStatements, statement) {
registeredStatements.forEach(existingStatement => { if (existingStatement.startsWith(statement)) { registeredStatements.delete(existingStatement); } }); }
async function getSelection(dropdownId, errorId) {
const dropdownButton = document.getElementById(dropdownId);
const dropdownMenu = document.querySelector('#' + dropdownId + ' + .dropdown-menu');
const errorElement = document.getElementById(errorId);
if (!dropdownMenu) { return; }
return new Promise((resolve, reject) => { dropdownMenu.addEventListener("click", function(event) { const option = event.target.closest(".dropdown-item"); if (!option) return;
        event.preventDefault();
        const selectedOptionText = option.textContent.trim();
        dropdownButton.innerText = selectedOptionText;
        dropdownButton.value = option.getAttribute("data-value");
        const dataSelect = option.getAttribute("data-value");
        validateSelect(selectedOptionText, errorElement, dropdownButton);
        resolve(dataSelect); }); }); }
function loadNotifications(visibi) { const formEndDiv = document.querySelector('.formEnd.hide');
formEndDiv.style.visibility = visibi;}`;}
export default validationLoadGeneral;