import { allProject } from "../../../services/projectService";
import { email } from "../../const/emailPattern";
import { Project, templateEmails } from "../../type/typeProject";
import { decodeBase64, getBase64 } from "../formatHtml";

const validDataAndSetProject  = async (id: any, setButtonClient: any, setButtonExecute: any, setValue: any) => {
  const params = `_id=${id}`;
  const payload = await allProject(params);
  if (payload) {
    const dataProject = payload.map((val: any) => ({...val, nameProject: val.name, senderEmail: val.sender,
      templateEmails: { titleClient: val.templateEmails.titleClient, messageTemplate: decodeBase64(val.templateEmails.messageTemplate), titleExecutive: val.templateEmails.titleExecutive, documentTemplate: decodeBase64(val.templateEmails.documentTemplate), mailsTo: val.templateEmails.mailsTo
      } as templateEmails
}));
    if (dataProject.length > 0) {
   if(dataProject[0]?.templateEmails?.messageTemplate != '') { setButtonClient(true) };
   if(dataProject[0]?.templateEmails?.documentTemplate !=  '') { setButtonExecute(true) };
    setValue("project" as any, dataProject[0]?.nameProject);
    setValue("sender" as any, dataProject[0]?.senderEmail);
    setValue("templateClient" as any, [dataProject[0]?.templateEmails]);
    setValue("templateExecute" as any, [dataProject[0]?.templateEmails]);
    setValue("email" as any, dataProject[0]?.templateEmails?.mailsTo.length > 0 ? dataProject[0]?.templateEmails?.mailsTo : [{name: ''}]);
  }
}
}
const vaidaSaveUpdateProject = async (data: any, setisLoading: any,setValue: any, updateProject:any, id: any,setError: any, setRedireccionar: any) => {
  try {
    setisLoading(true);
    const templateCliente: string = await getBase64(data?.templateClient[0]?.messageTemplate) as string;
    const templateExecutive: string = await getBase64(data?.templateExecute[0]?.documentTemplate) as string;
    let requestProject: Project = {
      slug: data.project,
      name: data.project,
      sender: data.sender,
      templateEmails: {
        titleClient: data?.templateClient[0]?.titleClient ? data?.templateClient[0]?.titleClient : '',
        messageTemplate: data?.templateClient[0]?.messageTemplate ? templateCliente : '',
        titleExecutive: data?.templateExecute[0]?.titleExecutive ? data?.templateExecute[0]?.titleExecutive : '',
        documentTemplate: data?.templateExecute[0]?.documentTemplate ? templateExecutive : '',
        mailsTo: data.email
      } as templateEmails
    };
  if (requestProject.templateEmails?.hasOwnProperty('messageTemplate') && requestProject.templateEmails?.messageTemplate === '') {
    let { messageTemplate, titleClient, ...rest } = requestProject.templateEmails;
    requestProject.templateEmails = rest as any;
  }
  if (requestProject.templateEmails?.hasOwnProperty('documentTemplate') && requestProject.templateEmails?.documentTemplate === '') {
    let { documentTemplate, titleExecutive, mailsTo, ...rest } = requestProject.templateEmails;
    requestProject.templateEmails = rest as any;
  }
  if (!requestProject.templateEmails?.hasOwnProperty('messageTemplate') && !requestProject.templateEmails?.hasOwnProperty('documentTemplate')) {
    let { mailsTo, ...rest } = requestProject as any;
    setValue("sender", '');
    requestProject = rest;
  }
    const payload = await updateProject(id, requestProject);
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
const validEmail = (inputValue: any, newEmailClass: any, index: any, newEmailErrors: any, setInputClass:any, inputClass:any, setErrorMessages:any, errorMessages:any) => {
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
  validEmail(inputValue, newEmailClass, index, newEmailErrors, setInputClass, inputClass, setErrorMessages, errorMessages);
};
const validateProject = (fieldName: any, event: any, setInputClass:any, inputClass: any, setErrorMessages:any, errorMessages:any) => {
  const inputValue = event.target.value;
  let newClass = inputValue.trim() === '' ? 'form-control is-invalid' : 'form-control';
  let errorMessage = inputValue.trim() === '' ? `${fieldName} requerido` : '';
  setInputClass({ ...inputClass, [fieldName]: newClass});
  setErrorMessages({...errorMessages, [fieldName]: errorMessage });
};

const validSenderEmail = (inputValue: any, newClass:any, errorMessage:any, setInputClass:any, setErrorMessages:any, inputClass:any, errorMessages:any, fieldName:any) => {
  if (inputValue.trim() !== '' && !email.PATTERN_EMAIL.test(inputValue)) {
    newClass = 'form-control is-invalid';
    errorMessage = 'Formato de email incorrecto';
    setInputClass({ ...inputClass, [fieldName]: newClass });
    setErrorMessages({ ...errorMessages, [fieldName]: errorMessage });
}
}
const validateSender = (fieldName: any, event: any, setInputClass:any, inputClass: any, setErrorMessages: any, errorMessages: any) => {
  const inputValue = event.target.value;
  let newClass = inputValue.trim() === '' ? 'form-control is-invalid' : 'form-control';
  let errorMessage = inputValue.trim() === '' ? `${fieldName} requerido` : '';
  setInputClass({ ...inputClass, [fieldName]: newClass});
  setErrorMessages({...errorMessages, [fieldName]: errorMessage });
  validSenderEmail(inputValue, newClass, errorMessage, setInputClass, setErrorMessages, inputClass, errorMessages, fieldName);
};
const validClientTemplate = (fieldName:any, newTemplateClass: any, index:any, inputValue:any, newTemplateErrors:any, validateHtml:any) => {
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
const validateTemplateClient = (fieldName: any, index: any, event: any,inputClass: any, errorMessages: any, validateHtml: any,setInputClass:any, setErrorMessages:any) => {
  const inputValue = event.target.value;
  const newTemplateClass = [...inputClass.templateClient];
  const newTemplateErrors = [...errorMessages.templateClient];
  validClientTemplate(fieldName, newTemplateClass, index, inputValue, newTemplateErrors, validateHtml)
  setInputClass({ ...inputClass, templateClient: newTemplateClass });
  setErrorMessages({ ...errorMessages, templateClient: newTemplateErrors });
};
const validTemplateExecute = (fieldName: any, newTemplateClass:any, index:any,inputValue:any, newTemplateErrors:any, validateHtml:any) => {
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
const validateTemplateExecute = (fieldName: any, index: any, event: any, inputClass:any, errorMessages: any, validateHtml: any, setInputClass:any, setErrorMessages: any) => {
  const inputValue = event.target.value;
  const newTemplateClass = [...inputClass.templateExecute];
  const newTemplateErrors = [...errorMessages.templateExecute];
  validTemplateExecute(fieldName, newTemplateClass, index,inputValue, newTemplateErrors, validateHtml);
  setInputClass({ ...inputClass, templateExecute: newTemplateClass });
  setErrorMessages({ ...errorMessages, templateExecute: newTemplateErrors });
};
const validAddTemplateClient = (templateClient: any, appendTemplateClient:any, setFlagTempClient: any, setButtonClient: any, setValue: any) => {
  if(templateClient.length == 0) {
    appendTemplateClient({ titleClient: "", messageTemplate: ''} );
    setFlagTempClient(true);
    setButtonClient(true);
    } else {
      const newTemplateClient = [...templateClient];
      newTemplateClient[0]= { titleClient: "", messageTemplate: ''} as any;
      setValue("templateClient", newTemplateClient);
      setFlagTempClient(true);
      setButtonClient(true);
    }
}
const addTemplateCliente = (templateClient: any, appendTemplateClient: any, setFlagTempClient: any, setButtonClient:any, setValue:any) => {
  validAddTemplateClient(templateClient, appendTemplateClient, setFlagTempClient, setButtonClient, setValue);
}
const validAddTemplateExecutive = (templateExecute: any, appendTemplateExecute: any, setFlagTemplateExecutive: any, setButtonExecute: any, setValue:any) => {
  if(templateExecute.length == 0) {
    appendTemplateExecute({ titleExecutive: "", documentTemplate: ''} );
    setFlagTemplateExecutive(true);
    setButtonExecute(true);
    } else {
      const newTemplateExecute = [...templateExecute];
      newTemplateExecute[0]= { titleExecutive: "", documentTemplate: ''} as any;
      setValue("templateExecute", newTemplateExecute) as any;
      setFlagTemplateExecutive(true);
      setButtonExecute(true);
    }
}
const addTemplateExecutive = (templateExecute: any, appendTemplateExecute: any, setFlagTemplateExecutive: any, setButtonExecute:any, setValue: any) => {
  validAddTemplateExecutive(templateExecute, appendTemplateExecute, setFlagTemplateExecutive, setButtonExecute, setValue)
}
const removeTemplateCustom = (index: any= 0, removeTemplateClient: any,setValue: any, setFlagTempClient: any, setButtonClient: any) => {
  removeTemplateClient(index);
  setValue("sender", '');
  setFlagTempClient(false);
  setButtonClient(false);
}
const removeTemplateExecuteCustom = (index: any= 0, removeTemplateExecute: any, setValue: any, setFlagTemplateExecutive: any, setButtonExecute: any) => {
  removeTemplateExecute(index);
  const formEmail: Array<any>= [{name: ''}] as any;
    setValue("email", formEmail);
    setValue("sender", '');
    setFlagTemplateExecutive(false);
    setButtonExecute(false);
}
const saveUdpateProject = async (data: any, setisLoading: any, setValue: any, updateProject: any, id: any ,setError: any, setRedireccionar: any) => {
    await vaidaSaveUpdateProject(data, setisLoading, setValue, updateProject, id ,setError , setRedireccionar);
}
const listProject = (records: any, search: any, setOriginalRecords: any) => {
  const filteredData = records.filter(({ name, mailsTo  }: { name: string, mailsTo: any }) => {
    let nameForm: any = name.toUpperCase().match(search.toUpperCase());
    let emailName: any = mailsTo.map((val: any) => (val.name)).join(', ');
    let emailProject: any = emailName.toUpperCase().match(search.toUpperCase());
    return nameForm || emailProject;
  });
  setOriginalRecords(filteredData);
}

export {
    validDataAndSetProject,
    validateEmail,
    validateProject,
    validateSender,
    validateTemplateClient,
    validateTemplateExecute,
    addTemplateCliente,
    addTemplateExecutive,
    removeTemplateCustom,
    removeTemplateExecuteCustom,
    saveUdpateProject,
    listProject
};