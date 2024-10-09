import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const EmailTemplateClient = ({ data, ind, inputClass, register, validateTemplateClient, setInputClass, setErrorMessages, errorMessages, setValue, removeTemplateClientCustom, setFlagTempClient, setButtonClient, removeTemplateClient }:{data: any, ind: any,inputClass: any, register: any, validateTemplateClient: any, setInputClass: any, setErrorMessages: any, errorMessages: any, setValue: any, removeTemplateClientCustom: any, setFlagTempClient: any, setButtonClient: any, removeTemplateClient: any}) => {
    return (
<div className={`mb-2`} key={data.id}> <label htmlFor={`email`}><b>Titulo Email</b></label>
                      <input type="text" className={`form-control mb-1 ${ inputClass.templateClient[ind]?.titleClient }`}  {...register(`templateClient.${ind}.titleClient` as any, { required: true, onChange: (w: any) => validateTemplateClient('titleClient',ind,w, setInputClass, setErrorMessages, inputClass, errorMessages)})} placeholder={`Introduzca Titulo Email`}></input>
                      { errorMessages.templateClient[ind]?.titleClient && <span className={`text-danger p-2`}>{ errorMessages.templateClient[ind]?.titleClient  }</span> }
                      <div className={`mb-2`}><label htmlFor={`email`}><b>Email Cliente</b></label>
                      <textarea className={`form-control ${inputClass.templateClient[ind]?.messageTemplate}`} rows={3} {...register(`templateClient.${ind}.messageTemplate` as any, { required: true, onChange: (v: any) => validateTemplateClient('messageTemplate',ind,v, setInputClass, setErrorMessages, inputClass, errorMessages) } )} placeholder={`Introduzca Html`}></textarea>
                      { errorMessages.templateClient[ind]?.messageTemplate && <span className={`text-danger p-2`}>{ errorMessages.templateClient[ind]?.messageTemplate  }</span> } { ind >= 0 && (
                              <div className={`col-md-2`}>
                            <button type="button" className={`btn btn-sm btn-danger`} onClick={() => removeTemplateClientCustom(ind, removeTemplateClient, setValue, setFlagTempClient, setButtonClient)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                                </div>
                              )}
                    </div></div>
    )};
    const EmailExecutive = ({ field, inputClass,index,register, email,setErrorMessages, validateEmail,errorMessages, setInputClass, removeEmail}:{field: any, inputClass: any, index: any, register: any, email: any, setErrorMessages: any, validateEmail: any, errorMessages: any, setInputClass: any, removeEmail: any}) => {
        return (
     <div className={`email`} key={field.id}><div className={"mb-1"}><label htmlFor={`email`}><b>Email</b></label>
    <input type="text" className={`form-control mb-2  ${inputClass.email[index]}`} {...register(`email.${index}.name` as any,{ required: true, pattern: email.PATTERN_EMAIL, onChange: (r: any) => validateEmail(index,r, inputClass, errorMessages, setInputClass, setErrorMessages)})} placeholder={`Introduzca Emails del Proyecto`}></input>{ errorMessages.email[index] && <span className={`text-danger`}>{ errorMessages.email[index] }</span> }
    { index > 0 && ( <div className={`col-md-2`}> <button type="button" className={`btn btn-sm btn-danger`} onClick={() => removeEmail(index)}><FontAwesomeIcon icon={faTrash} /></button></div>)}
  </div></div>
  )
    }
const AddEmailTemplate = ({data, ind, inputClass, register, validateTemplateExecute, setInputClass, setErrorMessages, errorMessages, removeTemplateExecuteCustom, removeTemplateExecute, setValue, setFlagTemplateExecutive, setButtonExecute}:{data:any, ind:any, inputClass:any, register:any, validateTemplateExecute:any, setInputClass:any, setErrorMessages:any, errorMessages:any, removeTemplateExecuteCustom:any, removeTemplateExecute:any, setValue:any, setFlagTemplateExecutive:any, setButtonExecute:any}) => {
    return (
    <div className={`mb-2`} key={data.id}> <label htmlFor={`email`}><b>Titulo Email</b></label>
                      <input type="text" className={`form-control mb-1 ${ inputClass.templateExecute[ind]?.titleExecutive }`}  {...register(`templateExecute.${ind}.titleExecutive` as any, { required: true, onChange: (w: any) => validateTemplateExecute('titleExecutive',ind,w, setInputClass, setErrorMessages, inputClass, errorMessages)})} placeholder={`Introduzca Titulo Email`}></input>
                      { errorMessages.templateExecute[ind]?.titleExecutive && <span className={`text-danger p-2`}>{ errorMessages.templateExecute[ind]?.titleExecutive  }</span> } <div className={`mb-2`}><label htmlFor={`template`}><b>Template</b></label>
                      <textarea className={`form-control ${inputClass.templateExecute[ind]?.documentTemplate}`} rows={3} {...register(`templateExecute.${ind}.documentTemplate` as any, { required: true, onChange: (v: any) => validateTemplateExecute('documentTemplate',ind,v, setInputClass, setErrorMessages, inputClass, errorMessages) } )} placeholder={`Introduzca Html`}></textarea>
                      { errorMessages.templateExecute[ind]?.documentTemplate && <span className={`text-danger p-2`}>{ errorMessages.templateExecute[ind]?.documentTemplate  }</span> } { ind >= 0 && ( <div className={`col-md-2`}>
                             <button type="button" className={`btn btn-sm btn-danger`} onClick={() => removeTemplateExecuteCustom(ind, removeTemplateExecute, setValue, setFlagTemplateExecutive, setButtonExecute)}>
                                    <FontAwesomeIcon icon={faTrash} /></button></div>
                              )}
                    </div></div>
    )
}
    
export {
    EmailTemplateClient,
    EmailExecutive,
    AddEmailTemplate
};

