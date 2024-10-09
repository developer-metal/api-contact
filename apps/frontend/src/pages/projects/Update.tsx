import { Link, Navigate, useParams } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";
import { email } from "../../utils/const/emailPattern";
import { useEffect, useState } from "react";
import validateHtml from "../../utils/validators/validateHtml";
import { updateProject } from "../../services/projectService";
import { addTemplateCliente, addTemplateExecutive, removeTemplateCustom, removeTemplateExecuteCustom, saveUdpateProject, validDataAndSetProject, validateEmail, validateProject, validateSender, validateTemplateClient, validateTemplateExecute } from "../../utils/helpers/projects/validProjectUpdate";
import { EmailExecuteFormat, EmailsClient, TemplateExecute } from "../../components/projects/updateProjects";
function Update() {
  const dataInputClass = { project: 'form-control', email: ['form-control'] , sender: 'form-control',
  templateClient: ['form-control'], templateExecute: ['form-control'] };
  const [inputClass, setInputClass] = useState<any>(dataInputClass);
  const [flagTemplateCliente, setFlagTempClient] = useState<any>(false); 
  const [flagTemplExecutive, setFlagTemplateExecutive] = useState<any>(false);
  const [redireccionar, setRedireccionar] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [isButtonClient, setButtonClient] = useState(false);
  const [isButtonExecute, setButtonExecute] = useState(false);
  const dataErrorMessages = {project: '',sender: '', email: [], templateClient: [], templateExecute: []};
  const [errorMessages, setErrorMessages] = useState<any>(dataErrorMessages);
  const dataForms: any = { defaultValues: { project: '', sender: '', templateClient: [], templateExecute: [], email: [{name: ''}] } as any };
  const {register, handleSubmit, control, formState: { isValid}, setValue } = useForm<any>(dataForms);
  const dataFieldArray = { control, name: 'email'} as any;
  const { fields: fieldsEmail, append: appendEmail, remove: removeEmail } = useFieldArray(dataFieldArray);
  const fieldTemplate = { control, name: 'templateClient'} as any;
  const { fields: templateClient, append: appendTemplateClient, remove: removeTemplateClient } = useFieldArray(fieldTemplate);
  const dataRemovTemplate = { control, name: 'templateExecute'} as any;
  const { fields: templateExecute, append: appendTemplateExecute, remove: removeTemplateExecute } = useFieldArray(dataRemovTemplate);
  const { id } = useParams();
  useEffect(() => {
    (async () => {
      await validDataAndSetProject(id, setButtonClient, setButtonExecute, setValue);
    })();
  }, []);
  return (<div className={`container-fluid d-flex w-100 p-5 justify-content-center align-items-center bg-light`}>
        <div className={`w-50 rounded bg-white border px-5 mt-5 pb-5 rounded`}><h1 className={`text-center`}>Proyecto</h1>
  { isError && ( <div className={`alert alert-danger`} role="alert"> Error al actualizar Proyecto.</div>
              )}
              <form className={`form-floating`}><div className={`mb-2`}>
                  <label htmlFor={`project`}><b>Nombre*</b></label>
                  <input type="text" className={inputClass.project} {...register('project', { required: true, onChange: (t) => validateProject('project',t, setInputClass, inputClass, setErrorMessages, errorMessages) })} placeholder={`Introduzca Nombre del Proyecto`}></input>
                  { errorMessages.project && <span className={`text-danger`}>{`${errorMessages.project}`}</span>}
                </div><div className={`d-grid gap-2 d-md-flex justify-content-md-center font-weight-bold mb-2`}>
                <button type="button" className={`btn btn-sm btn-primary`} onClick={() => addTemplateCliente(templateClient, appendTemplateClient, setFlagTempClient, setButtonClient, setValue) } disabled={isButtonClient}>Template Cliente</button>
                <button type="button" className={`btn btn-sm btn-primary`} onClick={() => addTemplateExecutive(templateExecute, appendTemplateExecute, setFlagTemplateExecutive, setButtonExecute, setValue) } disabled={isButtonExecute}>Template Ejecutivo</button></div>
                {(flagTemplateCliente || flagTemplExecutive || (isButtonClient || isButtonExecute)) && (<div className={`mb-2`}>
                    <label htmlFor={`project`}><b>Remitente</b></label>
                    <input type="text" className={inputClass.sender} {...register('sender', { required: true, pattern: email.PATTERN_EMAIL, onChange: (t) => validateSender('sender', t, setInputClass, inputClass, setErrorMessages, errorMessages) })} placeholder={`Introduzca Nombre del Remitente`}></input>
                    { errorMessages.sender && <span className={`text-danger`}>{`${errorMessages.sender}`}</span>}
                  </div>
                   )}
                { ( flagTemplateCliente || isButtonClient) && ( <div className={`d-grid gap-2 mt-5`}>
                    <h6 className={`d-md-flex justify-content-md-center h4`}>Email Cliente</h6>
                    <hr data-content="AND" className={`hr-text`}/>
                  <div className={`mb-2`}>
                  { templateClient.map((data: any, ind: number): any => {
                  return ( <EmailsClient data={data} ind={ind} inputClass={inputClass} register={register} validateTemplateClient={validateTemplateClient} errorMessages={errorMessages} validateHtml={validateHtml} setInputClass={setInputClass} setErrorMessages={setErrorMessages} removeTemplateClient={removeTemplateClient} setValue={setValue} setFlagTempClient={setFlagTempClient} setButtonClient={setButtonClient} removeTemplateCustom={removeTemplateCustom}/>
                  )})}
                    </div></div>
                )}
              {(flagTemplExecutive || isButtonExecute) && ( <div className={`d-grid gap-2 mt-5`}>
                    <h6 className={`d-md-flex justify-content-md-center h4`}>Email Ejecutivo</h6>
                    <hr data-content="AND" className={`hr-text`}/>
                  { templateExecute.length > 0 && ( <div className={`mb-2`}>
                  { fieldsEmail.map((field, index) => {
                  return ( <EmailExecuteFormat  field={field} inputClass={inputClass} index={index} register={register} errorMessages={errorMessages} setInputClass={setInputClass} setErrorMessages={setErrorMessages} validateEmail={validateEmail} removeEmail={removeEmail}/>
                    )})} 
                  <button type="button" className={`btn btn-sm btn-primary`} onClick={() => appendEmail({ name: "" })}>Agregar</button></div>
                  )}
                  <div className={`mb-2`}> { templateExecute.map((data: any, ind: number) => {
                  return ( <TemplateExecute data={data} inputClass={inputClass} ind={ind} register={register} errorMessages={errorMessages} validateHtml={validateHtml} setInputClass={setInputClass} setErrorMessages={setErrorMessages} validateTemplateExecute={validateTemplateExecute} removeTemplateExecuteCustom={removeTemplateExecuteCustom} removeTemplateExecute={removeTemplateExecute} setValue={setValue} setFlagTemplateExecutive={setFlagTemplateExecutive} setButtonExecute={setButtonExecute}/>
                  )})}
                    </div></div>
                )}
                <button className={`btn btn-success`} onClick={handleSubmit((data) => saveUdpateProject(data, setisLoading, setValue, updateProject, id ,setError, setRedireccionar))}  disabled={!isValid || isLoading}>Actualizar</button>
                <Link to="/project" className={`btn btn-primary ms-2`}>Regresar</Link>
                {redireccionar && <Navigate to="/project" />}
              </form></div></div>
)}
export default Update;