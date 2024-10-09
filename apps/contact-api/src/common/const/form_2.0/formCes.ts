const sendCes = (dataClient: any): string => {
    return `function sendCES(optionsData) {
    let contactElement = document.getElementById('contactName');
    let nombreContact = contactElement ? contactElement.value : 'N/A';
    let contactEmail = document.getElementById('contactEmail').value;
    const endpointCES = '${dataClient?.endpointCES}';
  const dataCES = { "name": nombreContact,  "email": contactEmail, project: '${dataClient?.projectForm}',
      level: Number(optionsData), captcha: document.getElementById('recp').value };
      fetch(endpointCES, { method: 'POST', headers: {'Content-Type': 'application/json' },
       body: JSON.stringify(dataCES) }).then(response => {
        const formulario = document.getElementById('formularioIdeas');
      if (response.status == 200) { notificationsSuccesCES();
    } else { validationError(); }
          }).catch(error => { validationError(); }); }`;
}   
export default sendCes;