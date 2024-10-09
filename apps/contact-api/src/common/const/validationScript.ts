import stageComplete from "./stageComplete";
import stageNext from "./stageNext";
import validationLoadGeneral from "./validGeneral";
import validationLoadScript from "./validationLoad";
import validationTextSlect from "./validationTextSelect";
const validationScript = (dataClient: any): string => {
  return `let stage = 0;
  let contentSelect = 0;
      let fields = { "fieldsContainer": [] };
      let registeredStatements = new Set();
      let flagErrorsSend = false;
      let maxRetryAttempts = 3;
      let retryAttempts = 0; 
  function moveStep(direction) {
  const progressBarComplete = document.querySelector('.progressBar_complete');
  const progressBarCounter = document.querySelector('.progressBar-counter');
  const carousel = document.querySelector('.carousel-inner');
  const stageForm = document.querySelectorAll('.carousel-item');
  const backButton = document.querySelector('.carousel-control-prev');
  const maxStages = stageForm.length - 1;
    const totalSlides = carousel.querySelectorAll('.carousel-item').length;
  let currentSlideIndex = getCurrentSlideIndex(carousel);
   if (stage == 0 && currentSlideIndex == 2) {  currentSlideIndex=1;backButton.style.visibility = 'hidden';}
  if (stage == 0 && currentSlideIndex == 1) {  currentSlideIndex=1;backButton.style.visibility = 'hidden';}
    if (stage == 1 && currentSlideIndex == 3) {  currentSlideIndex=2; backButton.style.visibility = 'visible';}
    if (stage == 0 && currentSlideIndex == 3) {  currentSlideIndex=3; backButton.style.visibility = 'visible';}
    if (direction === 'next') {
        nextCarrousel();
  if (stage === maxStages) { return; }
  backButton.style.visibility = 'visible';
  stage++;
  } else if (direction === 'prev' && stage <= maxStages) {
    let currentProgress = parseFloat(progressBarComplete.style.width);
    let progressBarWidth = ((currentSlideIndex) / totalSlides) * 100;
      if (stage == 0) {  progressBarWidth = 0; return;}
   if ((progressBarWidth >= 25 && progressBarWidth <= 100) && (currentSlideIndex <= totalSlides)) {
    currentProgress -= 25;
    progressBarComplete.style.width = currentProgress + '%';
    progressBarCounter.textContent = currentSlideIndex - 1 + ' de ' + totalSlides;
    }
  if (stage === 1) { backButton.style.visibility = 'hidden'; stage = 0; return; }
  stage--;
  }
  }
  function contarCaracteres(idelement) {
  const input = document.getElementById(idelement);
  const label = input.parentElement;
  const maxCaracteres = input.maxLength;
  const caracteresRestantes = maxCaracteres - input.value.length;
  const caracteresRestantesSpan = label.querySelector(".maxcharacters");
  caracteresRestantesSpan.textContent = (maxCaracteres - caracteresRestantes) + " de " + maxCaracteres + " caracteres";
  }
  function sendResponseForm(dataSendClient) {
  grecaptcha.enterprise.ready(function () {
          grecaptcha.enterprise.execute('${dataClient?.captcha}', { action: 'submit' }).then(function (token) {
             let recaptcha = document.getElementById('recp');
            recaptcha.value = token;
            validationSendForm(dataSendClient);
          }, function (error) {console.log('Error al ejecutar el recaptcha', error);});
        });
      }
function validationError() {
        if (retryAttempts < maxRetryAttempts) { retryAttempts++; notificationsErrors();
                  const retryForm = document.querySelector('.endButtons.error .nextButton.nextButton-enviar');
                  retryForm.removeAttribute('disabled');
                  } else {
                      const errorCard = document.querySelector('.cardEnd.card-error .card-text');
                      if (errorCard) { errorCard.textContent = '¡Lo sentimos!, Tu idea no ha podido ser enviada. Has excedido el número máximo de intentos. Por favor, inténtalo más tarde.';
                      }
                      const retryForm = document.querySelector('.endButtons.error .nextButton.nextButton-enviar');
                      if (retryForm) {
                          retryForm.removeAttribute('disabled');
                          retryForm.textContent = 'Volver';
                          retryForm.addEventListener('click', function(event) { location.reload(); });
                      }
                  }
    }
  function validationSendForm(dataSendClient) {
   let nombreContact = document.getElementById('contactName').value; 
    let contactEmail = document.getElementById('contactEmail').value;
    const endpointApi = '${dataClient.endpointApi}';
  const { fieldsContainer } = dataSendClient;
  const dataBody = {
     "contactName": nombreContact,  "contactEmail": contactEmail, "projectSlug": '${dataClient?.projectForm}',
      "fields": { fieldsContainer }, captcha: document.getElementById('recp').value };
      fetch(endpointApi, { method: 'POST', headers: {'Content-Type': 'application/json', 'x-api-key': true },
      withCredentials: true, body: JSON.stringify(dataBody) }).then(response => {
        const formulario = document.getElementById('formularioIdeas');
      if (response.status == 200) { formulario.reset(); notificationsSucces(); } else { validationError(); }
          }).catch(error => { validationError(); });
      }
  ${stageNext()}
  ${stageComplete(dataClient)}
  ${validationLoadGeneral()}
  ${validationTextSlect()}
  ${validationLoadScript()}`;
}
export default validationScript;