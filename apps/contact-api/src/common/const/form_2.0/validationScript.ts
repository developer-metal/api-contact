import sendCes from "./formCes";
import stageComplete from "./stageComplete";
import stageNext from "./stageNext";
import validationLoadGeneral from "./validGeneral";
import validationLoadScript from "./validationLoad";
import validationTextSlect from "./validationTextSelect";
const validationScriptTwo = (dataClient: any): string => {
  return `let stage = 0;
  let contentSelect = 0;
      let fields = { "fieldsContainer": [] };
      let registeredStatements = new Set();
      let flagErrorsSend = false;
      let maxRetryAttempts = 3;
      let retryAttempts = 0;
    function initialStage() {
        const activeSlides = document.querySelectorAll('.carousel-item');
        activeSlides.forEach((slide,index) => { 
            if (index > 0) {  const introduc = slide.querySelector('.headerForm'); const pageForm = slide.querySelector('.pageForm');
                const corousel = document.querySelector('.carouselFormTopControls');
                const backButton = document.querySelector('.carousel-control-prev');
                introduc.style.display = 'none';
                corousel.style.visibility = 'visible';
                pageForm.style.display = 'block';
                backButton.style.visibility = 'visible'; } }); }    
  function HiddeninitialStage() {
        const activeSlides = document.querySelectorAll('.carousel-item');
        activeSlides.forEach((slide,index) => { 
            console.log('index ',index);
            if (index == 0) { const corousel = document.querySelector('.carouselFormTopControls');
                const backButton = document.querySelector('.carousel-control-prev');
                corousel.style.visibility = 'hidden';
                backButton.style.visibility = 'hidden'; } }); }
  function moveStep(direction) {
  const progressBarComplete = document.querySelector('.progressBar_complete');
  const progressBarCounter = document.querySelector('.progressBar-counter');
  const carousel = document.querySelector('.carousel-inner');
  const stageForm = document.querySelectorAll('.carousel-item');
  const backButton = document.querySelector('.carousel-control-prev');
  const maxStages = stageForm.length;
    const totalSlides = carousel.querySelectorAll('.carousel-item').length -1;
  let currentSlideIndex = getCurrentSlideIndex(carousel);
   if (direction === 'next') { nextCarrousel();
  if (stage === maxStages) { return; }
  backButton.style.visibility = 'visible';
  stage++;
  } else if (direction === 'prev' && stage <= maxStages) {
    let currentProgress = parseFloat(progressBarComplete.style.width);
    let progressBarWidth = ((currentSlideIndex) / totalSlides) * 100;
      if (stage == 0) {  HiddeninitialStage(); progressBarWidth = 0; return;}
   if ((progressBarWidth >= 15 && progressBarWidth <= 100) && (currentSlideIndex <= totalSlides)) {
    currentProgress -= 15;
    progressBarComplete.style.width = currentProgress + '%';
    progressBarCounter.textContent = currentSlideIndex -1 + ' de ' + totalSlides;
    }
  stage--; } }
  function contarCaracteres(idelement) {
  const input = document.getElementById(idelement);
  const label = input.parentElement;
  const maxCaracteres = input.maxLength;
  const caracteresRestantes = maxCaracteres - input.value.length;
  const caracteresRestantesSpan = label.querySelector(".maxcharacters");
  caracteresRestantesSpan.textContent = (maxCaracteres - caracteresRestantes) + " de " + maxCaracteres + " caracteres";
  }
function redirectExternal() { const url = '${dataClient?.urlExternal}'; window.location.replace(url); history.replaceState(null, '', window.location.href); }
function sendResponseForm(dataSendClient, flag) {
  grecaptcha.enterprise.ready(function () {
          grecaptcha.enterprise.execute('${dataClient?.captcha}', { action: 'submit' }).then(function (token) {
             let recaptcha = document.getElementById('recp');
            recaptcha.value = token;
            if (flag == 'CES') { sendCES(dataSendClient); } else { validationSendForm(dataSendClient); }
          }, function (error) {console.log('Error al ejecutar el recaptcha', error);}); }); }
function validationError() {
  if (retryAttempts < maxRetryAttempts) { retryAttempts++; notificationsErrors();
  const retryForm = document.querySelector('.endButtons.error .nextButton.nextButton-enviar');
  retryForm.removeAttribute('disabled');
    } else { const errorCard = document.querySelector('.cardEnd.card-error .card-text');
    if (errorCard) { errorCard.style.visibility = 'visible'; }
      const retryForm = document.querySelector('.endButtons.error .nextButton.nextButton-enviar');
    if (retryForm) { retryForm.removeAttribute('disabled'); retryForm.textContent = 'Salir';
      retryForm.addEventListener('click', function(event) { redirectExternal() }); } } }
function validationSendForm(dataSendClient) {
    let contactElement = document.getElementById('contactName');
    let nombreContact = contactElement ? contactElement.value : 'N/A';
    let contactEmail = document.getElementById('contactEmail').value;
    const endpointApi = '${dataClient?.endpointApi}';
  const { fieldsContainer } = dataSendClient;
  const dataBody = { "contactName": nombreContact,  "contactEmail": contactEmail, "projectSlug": '${dataClient?.projectForm}',
      "fields": { fieldsContainer }, captcha: document.getElementById('recp').value };
      fetch(endpointApi, { method: 'POST', headers: {'Content-Type': 'application/json', 'x-api-key': true },
withCredentials: true, body: JSON.stringify(dataBody) }).then(response => { const formulario = document.getElementById('formularioIdeas');
      if (response.status == 200) { notificationsSucces(); } else { validationError(); }
          }).catch(error => { validationError(); }); }
  ${sendCes(dataClient)}
  ${stageNext()}
  ${stageComplete()}
  ${validationLoadGeneral()}
  ${validationTextSlect()}
  ${validationLoadScript()}`;
}
export default validationScriptTwo;