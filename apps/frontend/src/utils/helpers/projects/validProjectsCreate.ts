import { createProject } from "../../../services/projectService";
import { email } from "../../const/emailPattern";
import { Project, templateEmails } from "../../type/typeProject";
import validateHtml from "../../validators/validateHtml";
import { getBase64 } from "../formatHtml";
const validateProject = (fieldName: any, event: any, setInputClass: any , setErrorMessages: any, inputClass: any, errorMessages: any) => {
    const inputValue = event.target.value;
    let newClass = inputValue.trim() === '' ? 'form-control is-invalid' : 'form-control';
    let errorMessage = inputValue.trim() === '' ? `${fieldName} requerido` : '';
    setInputClass({ ...inputClass, [fieldName]: newClass});
    setErrorMessages({...errorMessages, [fieldName]: errorMessage });
  };
  const validateEmailFormat = (inputValue: string): { newClass: string; errorMessage: string } => {
    let newClass = 'form-control';
    let errorMessage = '';
    if (!inputValue.trim()) {
      newClass = 'form-control is-invalid';
      errorMessage = 'Campo requerido';
    } else if (!email.PATTERN_EMAIL.test(inputValue)) {
      newClass = 'form-control is-invalid';
      errorMessage = 'Formato de email incorrecto';
    }
    return { newClass, errorMessage };
  };
  const validateSender = (fieldName: any, event: any, setInputClass: any, setErrorMessages: any, inputClass: any, errorMessages: any) => {
    const inputValue = event.target.value;
    const { newClass, errorMessage } = validateEmailFormat(inputValue);
    setInputClass({ ...inputClass, [fieldName]: newClass });
    setErrorMessages({ ...errorMessages, [fieldName]: errorMessage });
  };

  const validEmpyTemplateClient = (fieldName: any, newTemplateClass: any, index: any,inputValue: any, newTemplateErrors: any) => {
    if (fieldName === "titleClient") {
      newTemplateClass[index] = {...newTemplateClass[index], [fieldName]: inputValue.trim() === '' ? 'form-control is-invalid' : 'form-control'};
      newTemplateErrors[index] = {...newTemplateErrors[index], [fieldName]: inputValue.trim() === '' ? 'Título requerido': '' };
  }
  if (fieldName === "messageTemplate") {
      newTemplateClass[index] = {...newTemplateClass[index], [fieldName]: inputValue.trim() === '' ? 'form-control is-invalid': 'form-control'};
      newTemplateErrors[index] = {...newTemplateErrors[index],[fieldName]: inputValue.trim() === '' ? 'Descripción requerida' : ''};
    if(!validateHtml(inputValue) && inputValue.trim() !== '') {
      newTemplateClass[index] = {...newTemplateClass[index], [fieldName]: 'form-control is-invalid'};
      newTemplateErrors[index] = {...newTemplateErrors[index],[fieldName]: 'Formato de html incorrecto'};
    }
  }
  }
  const validateTemplateClient = (fieldName: any, index: any, event: any, setInputClass: any,setErrorMessages: any, inputClass: any, errorMessages: any) => {
    const inputValue = event.target.value;
    const newTemplateClass = [...inputClass.templateClient];
    const newTemplateErrors = [...errorMessages.templateClient];
    validEmpyTemplateClient(fieldName, newTemplateClass, index, inputValue, newTemplateErrors);
    setInputClass({ ...inputClass, templateClient: newTemplateClass });
    setErrorMessages({ ...errorMessages, templateClient: newTemplateErrors });
  };

  const validEmptyTemplateExecute = (fieldName: any, newTemplateClass: any, index: any, newTemplateErrors: any, inputValue: any) => {
    if (fieldName === "titleExecutive") {
      newTemplateClass[index] = {...newTemplateClass[index], [fieldName]: inputValue.trim() === '' ? 'form-control is-invalid' : 'form-control'};
      newTemplateErrors[index] = {...newTemplateErrors[index], [fieldName]: inputValue.trim() === '' ? 'Título requerido': '' };
  }
  if (fieldName === "documentTemplate") {
      newTemplateClass[index] = {...newTemplateClass[index], [fieldName]: inputValue.trim() === '' ? 'form-control is-invalid': 'form-control'};
      newTemplateErrors[index] = {...newTemplateErrors[index],[fieldName]: inputValue.trim() === '' ? 'Descripción requerida' : ''};
    if(!validateHtml(inputValue) && inputValue.trim() !== '') {
      newTemplateClass[index] = {...newTemplateClass[index], [fieldName]: 'form-control is-invalid'};
      newTemplateErrors[index] = {...newTemplateErrors[index],[fieldName]: 'Formato de html incorrecto'};
    }
  }
  }
  const validateTemplateExecute = (fieldName: any, index: any, event: any, setInputClass: any, setErrorMessages: any, inputClass: any, errorMessages: any) => {
    const inputValue = event.target.value;
    const newTemplateClass = [...inputClass.templateExecute];
    const newTemplateErrors = [...errorMessages.templateExecute];
    validEmptyTemplateExecute(fieldName, newTemplateClass, index, newTemplateErrors, inputValue);
    setInputClass({ ...inputClass, templateExecute: newTemplateClass });
    setErrorMessages({ ...errorMessages, templateExecute: newTemplateErrors });
  };
  const isTemplateCliente = (templateClient: any, appendTemplateClient: any, setButtonClient: any, setFlagTempClient: any) => {
    if (templateClient.length == 0) {
      appendTemplateClient({ titleClient: "", messageTemplate: ''} );
      setButtonClient(true);
      setFlagTempClient(true);
      }
  }
  const addTemplateCliente = (templateClient: any, appendTemplateClient: any, setButtonClient: any, setFlagTempClient: any) => {
    isTemplateCliente(templateClient, appendTemplateClient, setButtonClient, setFlagTempClient);
  }
  
  const istTemplateExecute = (templateExecute: any, appendTemplateExecute: any, setButtonExecute: any, setFlagTemplateExecutive: any) => {
    if(templateExecute.length == 0 ) {
      appendTemplateExecute({ titleExecutive: "", documentTemplate: ''});
      setButtonExecute(true);
      setFlagTemplateExecutive(true);
      }
  }
  const addTemplateExecutive = (templateExecute: any, appendTemplateExecute: any, setButtonExecute:any, setFlagTemplateExecutive: any) => {
    istTemplateExecute(templateExecute, appendTemplateExecute, setButtonExecute, setFlagTemplateExecutive);
  }
  const removeTemplateClientCustom = (index: any= 0, removeTemplateClient: any, setValue: any, setFlagTempClient: any, setButtonClient: any) => {
    removeTemplateClient(index);
    setValue("sender", '');
    setFlagTempClient(false);
    setButtonClient(false);
  }
  const removeTemplateExecuteCustom = (index: any= 0, removeTemplateExecute: any, setValue: any, setFlagTemplateExecutive: any, setButtonExecute: any) => {
    removeTemplateExecute(index);
      const emailsFormat: Array<any> = [{name: ''}];
      setValue("email", emailsFormat);
      setValue("sender", '');
      setFlagTemplateExecutive(false);
      setButtonExecute(false);
  }
  const isValidFormatEmail = (inputValue: any, newEmailClass: any, index: any,newEmailErrors: any, inputClass: any, setInputClass: any, setErrorMessages: any, errorMessages: any) => {
    if (inputValue.trim() !== '' && !email.PATTERN_EMAIL.test(inputValue)) {
      newEmailClass[index] = 'form-control is-invalid';
      newEmailErrors[index] = 'Formato de email incorrecto';
      setInputClass({ ...inputClass, email: newEmailClass });
      setErrorMessages({ ...errorMessages, email: newEmailErrors });
  }
  }
  const validateEmail = (index: any, event: any, inputClass: any, errorMessages: any, setInputClass: any, setErrorMessages: any) => {
    const inputValue = event.target.value;
    const newEmailClass = [...inputClass.email];
    const newEmailErrors = [...errorMessages.email];
    newEmailClass[index] = inputValue.trim() === '' ? 'form-control is-invalid' : 'form-control';
    newEmailErrors[index] = inputValue.trim() === '' ? 'Email requerido' : '';
    setInputClass({ ...inputClass, email: newEmailClass });
    setErrorMessages({ ...errorMessages, email: newEmailErrors });
    isValidFormatEmail(inputValue, newEmailClass, index, newEmailErrors, inputClass, setInputClass, setErrorMessages, errorMessages);
  };
  const validTemplateExist = (requestProject: any ) => {
    if (requestProject.templateEmails?.hasOwnProperty('messageTemplate') && requestProject.templateEmails?.messageTemplate === '') {
      let { messageTemplate, titleClient, ...rest } = requestProject.templateEmails;
      requestProject.templateEmails = rest;
    }
    if (requestProject.templateEmails?.hasOwnProperty('documentTemplate') && requestProject.templateEmails?.documentTemplate === '') {
      let { documentTemplate, titleExecutive, mailsTo, ...rest } = requestProject.templateEmails;
      requestProject.templateEmails = rest;
    }
    if (!requestProject.templateEmails?.hasOwnProperty('messageTemplate') && !requestProject.templateEmails?.hasOwnProperty('documentTemplate')) {
      let { sender, mailsTo, ...rest } = requestProject; 
      requestProject = rest;
    }
  }
  const validRequestProject = async (setisLoading: any, data: any, setError: any, setRedireccionar:any) => {
    try {
      setisLoading(true);
      const templateCliente: string = await getBase64(data?.templateClient[0]?.messageTemplate) as string;
      const templateExecutive: string = await getBase64(data?.templateExecute[0]?.documentTemplate) as string;
      let titleClient: string = data?.templateClient[0]?.titleClient ? data?.templateClient[0]?.titleClient : '';
      let messageTemplate: string = data?.templateClient[0]?.messageTemplate ? templateCliente : '';
      let titleExecutive: string = data?.templateExecute[0]?.titleExecutive ? data?.templateExecute[0]?.titleExecutive : '';
      let documentTemplate: string = data?.templateExecute[0]?.documentTemplate ? templateExecutive : '';
      let formatEmails: any = data.email;
      let requestProject: Project = {
        slug: data.project, name: data.project, sender: data.sender,
        templateEmails: {
          titleClient: titleClient,
          messageTemplate: messageTemplate,
          titleExecutive: titleExecutive,
          documentTemplate: documentTemplate,
          mailsTo: formatEmails
        } as templateEmails
      };
      validTemplateExist(requestProject);
      const payload = await createProject(requestProject);
        if (payload) {
        setError(false);
        setisLoading(false);
        setRedireccionar(true);
        }
      } catch (error) {
      setError(true);
      setisLoading(false);
      }
  }
  const saveProject = async (data: any, setisLoading: any,setError: any, setRedireccionar: any) => {
    await validRequestProject(setisLoading, data, setError, setRedireccionar);
  };
  export {
    validateProject,
    validateSender,
    validateTemplateClient,
    validateTemplateExecute,
    addTemplateCliente,
    addTemplateExecutive,
    removeTemplateClientCustom,
    removeTemplateExecuteCustom,
    validateEmail,
    saveProject
};