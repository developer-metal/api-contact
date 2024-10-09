import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { email } from "../../utils/const/emailPattern";
const SpinnerFormat = ({ message, isLoadingAll}:{message: string, isLoadingAll: any}) => {
  console.log('isLoadingAll',isLoadingAll);
  if (isLoadingAll == false) {
  return (
   <div className={`d-grid gap-2 d-md-flex justify-content-md-center font-weight-bold w-50 rounded bg-white border px-5 mt-5 pb-5 h2`}>{message}</div> )
  }
}
const EmailsClient = ({data, ind, inputClass, register, validateTemplateClient, errorMessages, validateHtml, setInputClass, setErrorMessages, removeTemplateClient, setValue, setFlagTempClient, setButtonClient,removeTemplateCustom }:{data: any, ind: any, inputClass: any, register: any, validateTemplateClient: any, errorMessages: any, validateHtml: any, setInputClass: any, setErrorMessages: any, removeTemplateClient: any, setValue: any, setFlagTempClient: any, setButtonClient: any,removeTemplateCustom: any}): any => {
    return (
    <div className={`mb-2`} key={data.id}>
                      <label htmlFor={`email`}><b>Titulo Email</b></label>
                      <input type="text" className={`form-control mb-1 ${ inputClass.templateClient[ind]?.titleClient }`}  {...register(`templateClient.${ind}.titleClient` as any, { required: true, onChange: (w: any) => validateTemplateClient('titleClient',ind,w, inputClass, errorMessages, validateHtml,setInputClass, setErrorMessages)})} placeholder={`Introduzca Titulo Email`}></input>
                      { errorMessages.templateClient[ind]?.titleClient && <span className={`text-danger p-2`}>{ errorMessages.templateClient[ind]?.titleClient  }</span> }
                      <div className={`mb-2`}>
                      <label htmlFor={`emailEmail`}><b>Email Cliente</b></label>
                      <textarea className={`form-control ${inputClass.templateClient[ind]?.messageTemplate}`} rows={3} {...register(`templateClient.${ind}.messageTemplate` as any, { required: true, onChange: (v: any) => validateTemplateClient('messageTemplate',ind,v, inputClass, errorMessages, validateHtml,setInputClass, setErrorMessages) } )} placeholder={`Introduzca Html`}></textarea>
                      { errorMessages.templateClient[ind]?.messageTemplate && <span className={`text-danger p-2`}>{ errorMessages.templateClient[ind]?.messageTemplate  }</span> }
                            {
                              ind >= 0 && (
                                <div className={`col-md-2`}>
                                <button type="button" className={`btn btn-sm btn-danger`} onClick={() => removeTemplateCustom(ind, removeTemplateClient,setValue, setFlagTempClient, setButtonClient)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                                </div>
                              )
                            }
                    </div>
    </div>
    )
}
const EmailExecuteFormat = ({field,inputClass, index, register, errorMessages, setInputClass, setErrorMessages, validateEmail, removeEmail}:{field: any, inputClass: any, index: any, register: any, errorMessages: any, setInputClass: any, setErrorMessages: any, validateEmail: any, removeEmail: any}) => {
    return (
    <div className={`email`} key={field.id}>
    <div className={"mb-1"}>
    <label htmlFor={`email`}><b>Email</b></label>
    <input type="text" className={`form-control mb-2  ${inputClass.email[index]}`} {...register(`email.${index}.name` as any,{ required: true, pattern: email.PATTERN_EMAIL, onChange: (e: any) => validateEmail(index,e,  inputClass, errorMessages, setInputClass, setErrorMessages) })} placeholder={`Introduzca Emails del Proyecto`}></input>
    { errorMessages.email[index] && <span className={`text-danger`}>{ errorMessages.email[index] }</span>}
    {
      index > 0 && (
        <div className={`col-md-2`}>
        <button type="button" className={`btn btn-sm btn-danger`} onClick={() => removeEmail(index)}>
            <FontAwesomeIcon icon={faTrash} />
        </button>
        </div>
      )
    }
  </div>
  </div>
    )
}
const TemplateExecute = ({data, inputClass, ind, register, errorMessages, validateHtml, setInputClass, setErrorMessages, validateTemplateExecute, removeTemplateExecuteCustom, removeTemplateExecute, setValue, setFlagTemplateExecutive, setButtonExecute}:{ data: any, inputClass: any, ind: any, register: any, errorMessages: any, validateHtml: any, setInputClass:any, setErrorMessages: any, validateTemplateExecute: any, removeTemplateExecuteCustom: any,removeTemplateExecute: any, setValue: any, setFlagTemplateExecutive: any, setButtonExecute: any}) => {
    return (
    <div className={`mb-2`} key={data.id}>
    <label htmlFor={`email`}><b>Titulo Email</b></label>
    <input type="text" className={`form-control mb-1 ${ inputClass.templateExecute[ind]?.titleExecutive }`}  {...register(`templateExecute.${ind}.titleExecutive` as any, { required: true, onChange: (w: any) => validateTemplateExecute('titleExecutive',ind,w, inputClass, errorMessages, validateHtml, setInputClass, setErrorMessages)})} placeholder={`Introduzca Titulo Email`}></input>
    { errorMessages.templateExecute[ind]?.titleExecutive && <span className={`text-danger p-2`}>{ errorMessages.templateExecute[ind]?.titleExecutive  }</span> }
    <div className={`mb-2`}>
    <label ><b>Template</b></label>
    <textarea className={`form-control ${inputClass.templateExecute[ind]?.documentTemplate}`} rows={3} {...register(`templateExecute.${ind}.documentTemplate` as any, { required: true, onChange: (v: any) => validateTemplateExecute('documentTemplate',ind,v, inputClass, errorMessages, validateHtml, setInputClass, setErrorMessages) } )} placeholder={`Introduzca Html`}></textarea>
    { errorMessages.templateExecute[ind]?.documentTemplate && <span className={`text-danger p-2`}>{ errorMessages.templateExecute[ind]?.documentTemplate  }</span> }
          {
            ind >= 0 && (
              <div className={`col-md-2`}>
              <button type="button" className={`btn btn-sm btn-danger`} onClick={() => removeTemplateExecuteCustom(ind, removeTemplateExecute, setValue, setFlagTemplateExecutive, setButtonExecute)}>
                  <FontAwesomeIcon icon={faTrash} />
              </button>
              </div>
            )
          }
  </div>
  </div>
    )
}
export {
    SpinnerFormat,
    EmailsClient,
    EmailExecuteFormat,
    TemplateExecute
}