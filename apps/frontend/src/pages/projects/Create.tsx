import { Link, Navigate } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";
import { email } from "../../utils/const/emailPattern";
import { Inputs } from "../../utils/type/typeInput";
import { useState } from "react";
import { addTemplateCliente, addTemplateExecutive, removeTemplateClientCustom, removeTemplateExecuteCustom, saveProject, validateEmail, validateProject, validateSender, validateTemplateClient, validateTemplateExecute } from "../../utils/helpers/projects/validProjectsCreate";
import { EmailTemplateClient, EmailExecutive, AddEmailTemplate } from "../../components/projects/createProjects";
function Create() {
  const initialInputClass = { project: 'form-control', email: ['form-control'] , sender: 'form-control',
  templateClient: ['form-control'], templateExecute: ['form-control']};
  const [inputClass, setInputClass] = useState<any>(initialInputClass);
  const [flagTemplateCliente, setFlagTempClient] = useState<any>(false);
  const [flagTemplExecutive, setFlagTemplateExecutive] = useState<any>(false);
  const [redireccionar, setRedireccionar] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [isButtonClient, setButtonClient] = useState(false);
  const [isButtonExecute, setButtonExecute] = useState(false);
  const initialMessages = {project: '',sender: '', email: [], templateClient: [], templateExecute: []};
  const [errorMessages, setErrorMessages] = useState<any>(initialMessages);
  const initialForm = { defaultValues: { project: '', sender: '', templateClient: [], templateExecute: [], email: [{name: ''}]} as any }
  const {register, handleSubmit, control, formState: { isValid}, setValue } = useForm<Inputs>(initialForm);
  const initialContentEmail = { control, name: 'email'} as any;
  const { fields: fieldsEmail, append: appendEmail, remove: removeEmail } = useFieldArray(initialContentEmail);
  const contentTemplClient = { control, name: 'templateClient'} as any;
  const { fields: templateClient, append: appendTemplateClient, remove: removeTemplateClient } = useFieldArray(contentTemplClient);
  const initialRemove = { control, name: 'templateExecute'} as any;
  const { fields: templateExecute, append: appendTemplateExecute, remove: removeTemplateExecute } = useFieldArray(initialRemove);
  return (
    <div className={`container-fluid d-flex w-100 p-5 justify-content-center align-items-center bg-light`}>
        <div className={`w-50 rounded bg-white border px-5 mt-5 pb-5 rounded`}>
              <h1 className={`text-center`}>Proyecto</h1>
              { isError && ( <div className={`alert alert-danger`} role="alert"> Error al Crear Proyecto. </div> )}
              <form className={`form-floating`}>
                <div className={`mb-2`}><label htmlFor={`project`}><b>Nombre*</b></label>
                  <input type="text" className={inputClass.project} {...register('project', { required: true, onChange: (t) => validateProject('project',t, setInputClass,setErrorMessages, inputClass, errorMessages)})} placeholder={`Introduzca Nombre del Proyecto`}></input>
                  { errorMessages.project && <span className={`text-danger`}>{`${errorMessages.project}`}</span>}
                </div>                
                <div className={`d-grid gap-2 d-md-flex justify-content-md-center font-weight-bold mb-2`}>
                <button type="button" className={`btn btn-sm btn-primary`} onClick={() => addTemplateCliente(templateClient, appendTemplateClient, setButtonClient , setFlagTempClient) } disabled={isButtonClient}>Template Cliente</button>
                <button type="button" className={`btn btn-sm btn-primary`} onClick={() => addTemplateExecutive(templateExecute, appendTemplateExecute, setButtonExecute, setFlagTemplateExecutive) } disabled={isButtonExecute}>Template Ejecutivo</button></div>
                { (flagTemplateCliente || flagTemplExecutive) && ( <div className={`mb-2`}>
                    <label htmlFor={`project`}><b>Remitente</b></label>
                    <input type="text" className={inputClass.sender} {...register('sender', { required: true, pattern: email.PATTERN_EMAIL, onChange: (t) => validateSender('sender',t, setInputClass, setErrorMessages, inputClass, errorMessages)})} placeholder={`Introduzca Nombre del Remitente`}></input>
                    { errorMessages.sender && <span className={`text-danger`}>{`${errorMessages.sender}`}</span>}
                  </div>
                   )}
                {( flagTemplateCliente) && ( <div className={`d-grid gap-2 mt-5`}>
                    <h6 className={`d-md-flex justify-content-md-center h4`}>Email Cliente</h6>
                    <hr data-content="AND" className={`hr-text`}/>
                  <div className={`mb-2`}>
                  { templateClient.map((data: any, ind: number): any => {
                    return( <EmailTemplateClient data={data} ind={ind} inputClass={inputClass}  register={register} validateTemplateClient={validateTemplateClient} setInputClass={setInputClass} setErrorMessages={setErrorMessages} errorMessages={errorMessages} setValue={setValue} removeTemplateClientCustom={removeTemplateClientCustom} setFlagTempClient={setFlagTempClient} setButtonClient={setButtonClient} removeTemplateClient={removeTemplateClient} />)
                  })}
                    </div></div>
                )}
    { (flagTemplExecutive) && ( <div className={`d-grid gap-2 mt-5`}> <h6 className={`d-md-flex justify-content-md-center h4`}>Email Ejecutivo</h6><hr data-content="AND" className={`hr-text`}/>
                  { templateExecute.length > 0 && ( <div className={`mb-2`}> { fieldsEmail.map((field, index) => {
                  return (
                  <EmailExecutive  field={field} inputClass={inputClass} index={index} register={register} email={email}setErrorMessages={setErrorMessages} validateEmail={validateEmail} errorMessages={errorMessages} setInputClass={setInputClass} removeEmail={removeEmail}/>
                  )})}
                  <button type="button" className={`btn btn-sm btn-primary`} onClick={() => appendEmail({ name: "" })}>Agregar</button>
                  </div>
                  )}
                  <div className={`mb-2`}> { templateExecute.map((data: any, ind: number) => {
                  return (
                    <AddEmailTemplate data={data} ind={ind} inputClass={inputClass} register={register} validateTemplateExecute={validateTemplateExecute} setInputClass={setInputClass} setErrorMessages={setErrorMessages} errorMessages={errorMessages} removeTemplateExecuteCustom={removeTemplateExecuteCustom} removeTemplateExecute={removeTemplateExecute} setValue={setValue} setFlagTemplateExecutive={setFlagTemplateExecutive} setButtonExecute={setButtonExecute}/>
                  )})}
                    </div></div>
                )}
                <button className={`btn btn-success`} onClick={handleSubmit((data: any)=> saveProject(data, setisLoading, setError,setRedireccionar))}  disabled={!isValid || isLoading}>Crear</button>
                <Link to="/project" className={`btn btn-primary ms-2`}>Volver</Link>
                {redireccionar && <Navigate to="/project" />}
              </form>
          </div>
    </div>
)}
export default Create;