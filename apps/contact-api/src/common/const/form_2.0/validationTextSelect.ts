const validationTextSlect = (): string => {
    return `function notificationsSucces() {
        const carrousel = document.querySelector('.carouselFormTopControls');
        const activeSlides = document.querySelector('.carousel-item.active');
        const prev = document.querySelector('.carousel-control-prev');
        prev.style.visibility = 'hidden';
            if (activeSlides) { activeSlides.style.display = 'none'; }
            if (carrousel) { carrousel.style.display = 'none'; }
        let formEndDiv = document.querySelector('.formEnd.hide');
        if (formEndDiv) { formEndDiv.classList.remove('hide');}
        let formEnd = document.querySelector('.formEnd');
        if (formEnd) { formEnd.style.visibility = 'visible'; }
        let successDiv = document.querySelector('.formEnd .cardEnd.card-success');
        let successButtonsDiv = document.querySelector('.formEnd .endButtons.success');
        let successButtonsDivErro = document.querySelector('.formEnd .endButtons.error');
        let successImag = document.querySelector('.formEnd .imageForm');
        let successImagCes = document.querySelector('.formEnd .imageForm.cesImage');
        let cesSurvey = document.querySelector('.formEnd #ces-survey');
        let successImagError = document.querySelector('.formEnd #error-image');
        let successImagErrorGroup = document.querySelector('.formEnd .errorContainer');
        if (successImagError) { successImagError.style.display = 'none'; successImagErrorGroup.style.display = 'none'; }
        let errorRepit = document.querySelector('.cardEnd.card-error');
        if (errorRepit) { errorRepit.style.visibility = 'hidden';}
        if (successDiv) { successDiv.style.visibility = 'visible';}
        if (successButtonsDiv) { successButtonsDiv.style.visibility = 'visible'; }
        if (successImag) { successButtonsDivErro.style.visibility = 'hidden';  successImag.style.display = 'block';
             successImagCes.style.display = 'none';
         if (cesSurvey) { cesSurvey.style.display = 'block'; }
        }
    }
        function notificationsSuccesCES() {
        const carrousel = document.querySelector('.carouselFormTopControls');
        const activeSlides = document.querySelector('.carousel-item.active');
        const prev = document.querySelector('.carousel-control-prev');
        prev.style.visibility = 'hidden';
            if (activeSlides) { activeSlides.style.display = 'none'; }
            if (carrousel) { carrousel.style.display = 'none'; }
        let formEndDiv = document.querySelector('.formEnd.hide');
        if (formEndDiv) { formEndDiv.classList.remove('hide');}
        let formEnd = document.querySelector('.formEnd');
        if (formEnd) { formEnd.style.visibility = 'visible'; }
        let successDiv = document.querySelector('.formEnd .cardEnd.card-success');
        let successButtonsDiv = document.querySelector('.formEnd .endButtons.success');
        let successButtonsDivErro = document.querySelector('.formEnd .endButtons.error');
        let successImag = document.querySelector('.formEnd #success-image');
        let successImagCes = document.querySelector('.formEnd .imageForm.cesImage');
        let successImContai = document.querySelector('.formEnd .cesContainer');
        let successImContaiImg = document.querySelector('.formEnd .cesContainer .cesImage');
        let cesSurvey = document.querySelector('.formEnd #ces-survey');
        let successImagError = document.querySelector('.formEnd #error-image');
        let successImagErrorGroup = document.querySelector('.formEnd .errorContainer');
        if (successImagError) { successImagError.style.display = 'none'; successImagErrorGroup.style.display = 'none'; }
        let errorRepit = document.querySelector('.cardEnd .card-error');
        if (errorRepit) { errorRepit.style.visibility = 'hidden';}
        if (successDiv) { successDiv.style.visibility = 'hidden';}
        if (successButtonsDiv) { successButtonsDiv.style.visibility = 'visible'; }
        successImContaiImg.style.display = 'none';
        successImContai.style.display = 'block';
        if (successImag) {
             successButtonsDivErro.style.visibility = 'hidden'; 
             successImag.style.display = 'none';
             successImagCes.style.display = 'block';
         if (cesSurvey) { cesSurvey.style.display = 'none'; }
        }
    }
        function notificationsErrors() {
        const carrousel = document.querySelector('.carouselFormTopControls');
        const activeSlides = document.querySelector('.carousel-item.active');
        const prev = document.querySelector('.carousel-control-prev');
        prev.style.visibility = 'hidden';
        if (activeSlides) { activeSlides.style.display = 'none'; }
        if (carrousel) { carrousel.style.display = 'none'; }
        const formEndDivs = document.querySelector('.formEnd.hide');
        if (formEndDivs) { formEndDivs.classList.remove('hide');}
        const formEndDiv = document.querySelector('.formEnd .cardEnd.card-error');
        const errorRepit = document.querySelector('.formEnd .endButtons.error');
        let successImag = document.querySelector('.formEnd .imageForm#success-image');
        let successImagCes = document.querySelector('.formEnd .imageForm.cesImage');
        let successError = document.querySelector('.formEnd #error-image');
        let successImagError = document.querySelector('.formEnd .errorContainer');
        successError.style.visibility = 'visible';
        if (successImagError) { successImagError.style.visibility = 'visible'; }
        successImag.style.display = 'none';
        successImagCes.style.display = 'none';
        if (formEndDiv) { formEndDiv.style.visibility = 'visible'; }
        if (errorRepit) { errorRepit.style.visibility = 'visible'; } }
        function validateAndSendCES() {
            const flag = 'CES';
            document.querySelectorAll('.formEnd input[name="cesoptions"]').forEach(option => {
                option.addEventListener('click', function() {
                const selectedOption = document.querySelector('.formEnd input[name="cesoptions"]:checked');
            if (selectedOption) { const optionSele = selectedOption.value;
        document.querySelectorAll('.formEnd input[name="cesoptions"]').forEach(radio => { radio.setAttribute('disabled', 'disabled'); });
                    sendResponseForm(optionSele,flag);
                    }
                }); }); }
    function resetDataForm() { registeredStatements.clear(); location.reload(); }`;
}
export default validationTextSlect;