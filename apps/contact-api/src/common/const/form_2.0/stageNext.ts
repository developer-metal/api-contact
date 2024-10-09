const stageNext = (): string => {
    return `function validateText(inputId) {
        const inputElement = document.getElementById(inputId);
        const errorElement = document.getElementById(inputId + 'Error');
        if (inputElement) { const inputValue = inputElement.value.trim();
            if (inputValue === '') { errorElement.classList.add('error-border'); inputElement.style.borderColor = 'red';
                errorElement.textContent = 'Se requiere una respuesta en texto.'; return false;
            } else { errorElement.classList.remove('error-border'); inputElement.style.borderColor = ''; errorElement.textContent = '';
                return true; } } }
      function validateEmail(emailId) { const emailInput = document.getElementById(emailId); const emailError = document.getElementById(emailId+ 'Error'); const emailValue = emailInput.value.trim();
      if (emailValue === '') { emailInput.classList.add('error-border'); emailInput.style.borderColor = 'red'; emailError.textContent = 'Se requiere una respuesta en texto.';
          return false;
        } else if (!isValidEmail(emailValue)) { emailInput.classList.add('error-border'); emailInput.style.borderColor = 'red';
          emailError.textContent = 'Introduzca un correo electrónico válido.';
          return false; } else { emailInput.classList.remove('error-border'); emailInput.style.borderColor = '';
          emailError.textContent = '';
          return true; } }
    function validateFile(inputId, allowedTypes, maxSize) {
    const input = document.getElementById(inputId);
    const errorSpan = document.getElementById(inputId + 'Error');
    const hiddenInput = document.getElementById(inputId + '-base64');
    const fileContainer = document.querySelector('.fileContainer');
    const uploadContainer = fileContainer.querySelector('.uploadFile-container');
    const nameError = uploadContainer.querySelector('.textUpload .fileError');
    const fileContainerNofi = document.querySelector('.fileContainerNoFile[data-name="' + inputId + '"]');
    const iconUpload = document.querySelector('.iconUpload[data-name="' + inputId + '"]');
    const uploadingElement = fileContainer.querySelector('.uploading');
    const loadResponse = fileContainer.querySelector('.fileContainerFileOk');
    const nameFile = loadResponse.querySelector('.textUpload p:first-child');
    const nameTypeFile = uploadContainer.querySelector('.textUpload #typeFile');
    const files = input.files;
    function resetUploadState() { uploadingElement.style.display = 'none'; fileContainerNofi.classList.remove('subiendoArchivo');
        iconUpload.classList.remove('iconLoading');
    }
    uploadingElement.style.display = 'block';
    fileContainerNofi.classList.add('subiendoArchivo');
    iconUpload.classList.add('iconLoading');
    if (files.length === 0) { nameError.style.display = 'block'; nameError.textContent = 'Seleccione un archivo.';
        nameTypeFile.style.display = 'none';
        resetUploadState();
        return false;
    }
    const file = files[0];
    const fileName = file.name;
    const fileType = (file.type.split('/')[1] || '').toUpperCase();
    const fileSize = file.size;
    const maxSizeInBytes = maxSize * 1024 * 1024;
    if (!allowedTypes.includes(fileType)) { nameError.style.display = 'block';
        nameError.textContent = 'Tipo de archivo invalido. Los tipos permitidos son: ' + allowedTypes.join(', ') + '.';
        nameTypeFile.style.display = 'none';
        resetUploadState();
        input.value = '';
        return false;
    }
    if (fileSize === 0) { nameError.style.display = 'block'; nameError.textContent = 'El archivo seleccionado está vacío. Seleccione un archivo que no esté vacío.'; nameTypeFile.style.display = 'none'; resetUploadState(); input.value = ''; return false; }
    if (fileSize > maxSizeInBytes) { nameError.style.display = 'block'; nameError.textContent = 'Tamaño del archivo excede el limite "'+maxSize+'" MB.'; nameTypeFile.style.display = 'none'; resetUploadState(); input.value = ''; return false; }
    encodeFileToBase64(file, function(base64String) {
        if (base64String) { fileContainerNofi.style.display = 'none'; nameTypeFile.style.display = 'none';
            loadResponse.style.display = 'block';
            nameFile.textContent = maxCharacterStringFile(fileName);
            hiddenInput.value = base64String;
            resetUploadState();
        }
    }, function(errorMessage) {  errorSpan.textContent = errorMessage; resetUploadState(); loadResponse.style.display = 'none'; });
    const trashButton = document.getElementById('trashbutton');
    if (trashButton) { trashButton.addEventListener('click', () => { resetUploadState(); hiddenInput.value = ''; fileContainerNofi.style.display = 'block'; nameTypeFile.style.display = 'block'; loadResponse.style.display = 'none'; }); }
    nameError.textContent = '';
}
function maxCharacterStringFile(fileName) { let maxLength = 20; if (fileName.length > maxLength) { fileName = fileName.substring(0, maxLength - 3) + '...'; } return fileName; }
function encodeFileToBase64(file, successCallback, errorCallback) { const reader = new FileReader();
    reader.onload = function(e) { const base64String = e.target.result.split(',')[1]; successCallback(base64String); };
    reader.onerror = function() { errorCallback('ha ocurrido un error mientras se subia un archivo.'); };
    reader.readAsDataURL(file); }
      function isValidEmail(email) { const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$/i;
      return emailRegex.test(email); }
     function validateRadio(radiokboxes, errorCheck, elementCheck) {
      const isChecked = Array.from(radiokboxes).some(radio => radio.checked);
      if (isChecked) { errorCheck.textContent = '';  elementCheck.style.borderColor = ''; errorCheck.classList.remove('error-border');
              return true; } else { errorCheck.textContent = 'Debes seleccionar una opción'; elementCheck.style.borderColor = 'red';
              errorCheck.classList.add('error-border');
              return false; } }
      function validateCheckboxes(checkboxes, errorCheck, container) {
      const isChecked = Array.from(checkboxes).some(cb => cb.checked);
      if (isChecked) { errorCheck.textContent = '';  container.style.borderColor = '';
          errorCheck.classList.remove('error-border');
          return true; } else { errorCheck.textContent = 'Debes seleccionar al menos una opción'; container.style.borderColor = 'red';
          errorCheck.classList.add('error-border');
          return false; } }
      function validateTextarea(textarea, errorElement, elementTextarea) {
      if (textarea.length === 0) { errorElement.textContent = 'Se requiere una respuesta en texto.';
      elementTextarea.style.borderColor = 'red';
      errorElement.classList.add('error-border');
      return false; } else { errorElement.textContent = ''; elementTextarea.style.borderColor = '';
      errorElement.classList.remove('error-border');
      return true; } }`
};
export default stageNext;