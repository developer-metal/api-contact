const validationTextSlect = (): string => {
    return `function notificationsSucces() {
        const carrousel = document.querySelector('.carouselFormTopControls');
        const activeSlides = document.querySelector('.carousel-item.active');
        const backButton = document.querySelector('.carousel-indicatorsb');
            if (activeSlides) {
                if (window.innerWidth <= 991) {
                    activeSlides.style.display = 'block';
                } else {
                    activeSlides.style.display = 'none';
                }
            }
            if (carrousel) {
                if (window.innerWidth <= 991) {
                carrousel.style.display = 'block';
                backButton.style.display = 'none';
                } else {
                carrousel.style.display = 'none';
                }
            }
        const formEndDiv = document.querySelector('.formEnd.hide');
        if (formEndDiv) { formEndDiv.classList.remove('hide');}
        let successDiv = document.querySelector('.formEnd .cardEnd.card-success');
        let successButtonsDiv = document.querySelector('.formEnd .endButtons.success');
        let successButtonsDivErro = document.querySelector('.formEnd .endButtons.error');
        let successImag = document.querySelector('.formEnd .imageForm');
        let successImagError = document.getElementById('error-image');
        const enviarButton = document.querySelector('.nextButton.nextButton-enviar');
        if (successImagError) { successImagError.style.display = 'none';}
        formEndDiv.style.visibility = 'visible';
        let errorRepit = document.querySelector('.cardEnd.card-error');
        if (errorRepit) { errorRepit.style.visibility = 'hidden';}
        if (successDiv) { successDiv.style.visibility = 'visible';}
        if (successButtonsDiv) {
            if (window.innerWidth <= 991) { successButtonsDiv.style.visibility = 'hidden';
            } else { successButtonsDiv.style.visibility = 'visible';}
        }
        if (successImag) {
            if (window.innerWidth <= 991) {
                successButtonsDivErro.style.visibility = 'hidden';
                successImag.style.display = 'none';
                enviarButton.style.visibility = 'hidden';
            } else { successButtonsDivErro.style.visibility = 'hidden'; successImag.style.visibility = 'visible';}
        }
        }
        function notificationsErrors() {
        const carrousel = document.querySelector('.carouselFormTopControls');
        const activeSlides = document.querySelector('.carousel-item.active');
        const backButton = document.querySelector('.carousel-indicatorsb');
        if (activeSlides){
            if (window.innerWidth <= 991) { activeSlides.style.display = 'block';
            }else { activeSlides.style.display = 'none';}
        }
        if (carrousel) {
            if (window.innerWidth <= 991) {
            carrousel.style.display = 'block';
             backButton.style.display = 'none';
            } else { carrousel.style.display = 'none';}
        }
        const formEndDivs = document.querySelector('.formEnd.hide');
        if (formEndDivs) { formEndDivs.classList.remove('hide');}
        const formEndDiv = document.querySelector('.formEnd .cardEnd.card-error');
        const errorRepit = document.querySelector('.formEnd .endButtons.error');
        let successImag = document.querySelector('.formEnd .imageForm');
        let successImagError = document.getElementById('error-image');
        const enviarButton = document.querySelector('.nextButton.nextButton-enviar');
        successImag.style.display = 'none';
        if (successImagError) {
            if (window.innerWidth <= 991) {
            successImagError.style.display = 'none';
            enviarButton.style.display = 'none';
            } else { successImagError.style.visibility = 'visible'; }
        }
        if (formEndDiv) {
            if (window.innerWidth <= 991) { formEndDiv.style.visibility = 'visible';
                } else { formEndDiv.style.visibility = 'visible'; }
        }
        if (errorRepit) {
            if (window.innerWidth <= 991) { errorRepit.style.visibility = 'visible';
            } else { errorRepit.style.visibility = 'visible'; }
        }
        }
        function resetDataForm() { registeredStatements.clear(); location.reload(); }
        function mostrarMensajeSiEsResponsive() {
        const activeSlides = document.querySelectorAll('.carousel-item');
        activeSlides.forEach((element, index) => {
            if (window.innerWidth <= 991) {
                element.classList.add('active');
            } else {
                if (index != 0) {
                element.classList.remove('active');
                }
            }
        });
        }`;
}
export default validationTextSlect;
