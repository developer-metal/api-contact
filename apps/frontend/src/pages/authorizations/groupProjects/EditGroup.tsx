import { useEffect, useState } from "react";
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { Controller, useForm } from "react-hook-form";
import { readGroupProjects } from "../../../services/bff/backendService";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ListGroup } from "react-bootstrap";
import { getProjects, saveGroupCategory, validInputEmpy } from "../../../utils/helpers/groupCategory/groupList";
function GroupEdit() {
   const [flagLoading, setIsLoading] = useState<any>(false);
   const [validInput, setInput] = useState<any>(false);
   const [options, setOptions] = useState<any>([]);
   const [inputClass, setInputClass] = useState<any>({ category: 'form-control', projects: ['form-control']});
   const [errorMessages, setErrorMessages] = useState<any>({category: '',projects: []});
   const {register,getValues, control, setValue } = useForm<any>()
   const [isError, setError] = useState(false);
   const [isLoading, setisLoading] = useState(false);
   const [selectedOptions, setSelectedOptions] = useState([]);
  const navigate = useNavigate();
  const { id }: any = useParams();
  const handleSelectionChange = (selected: any) => { setSelectedOptions(selected);};
  const saveGroup = async () => { await saveGroupCategory(setisLoading, selectedOptions, getValues, id,setError, navigate);}
  useEffect(() => {
    (async () => {
          try { await getProjects(setOptions);
              const { payload } = await readGroupProjects(id);
              if ( payload ) { setIsLoading(true); const dataProject: any= payload.projects.map((val: any) => val.name);
                setValue('category', payload.name); setSelectedOptions(dataProject); validateGroup();
              }
          } catch (error) { setIsLoading(true);}
    })();
  }, []);
  const validateGroup = (fieldName?: any, event?: any) => {
    const inputValue = event?.target?.value || getValues('category');
    validInputEmpy(inputValue, setInput);
    let newClass = String(inputValue).trim() === '' ? 'form-control is-invalid' : 'form-control';
    let errorMessage = String(inputValue).trim() === '' ? `${fieldName} requerido` : '';
    setInputClass({ ...inputClass, 'category': newClass});
    setErrorMessages({...errorMessages, 'category': errorMessage });
  };
  const validateProjects = () => { 
    let errorMessage = selectedOptions?.length == 0 ? `${'projects'} requerido` : ''; setErrorMessages({...errorMessages, 'projects': errorMessage });
  }
  if (!flagLoading) { return ( <div className={`container-fluid d-flex w-100 p-5 justify-content-center align-items-center bg-light`}><div className={`d-grid gap-2 d-md-flex justify-content-md-center font-weight-bold w-50 rounded bg-white border px-5 mt-5 pb-5 h2`}>Cargando...</div></div> ) }
    return (<div className={`container-fluid d-flex w-100 p-5 justify-content-center align-items-center bg-light`}>
        <div className={`w-50 rounded bg-white border px-5 mt-5 pb-5 rounded`}>
              <h1 className={`text-center pt-3`}>Editar Grupo</h1>
              { isError && (
              <div className={`alert alert-danger`} role="alert">
                Error al Crear Grupo.
              </div>)}<div className={`row pt-5`}>
                    <div className={`col-md-6`}>
                    <div className={`form-group`}>
                    <label htmlFor={`project`}><b>Nombre*</b></label>
                        <input type="text" className={inputClass.category} {...register('category', { required: true, onBlur: (e) => validateGroup('category',e), onChange: (t) => validateGroup('category',t)})} placeholder={`Introduzca nombre`}></input>
                        { errorMessages.category && <span className={`text-danger`}>{`${errorMessages.category}`}</span>}
                    </div></div>
                    <div className={`col-md-6`}><div className={`form-group`}>
                        <label><b>Proyecto*</b></label>
                        <Controller
                            control={control}
                            name="projects"
                            render={({ field }) => (
                                <div className="mb-3">
                                <Typeahead
                                    {...field}
                                    id="basic-typeahead-single"
                                    multiple
                                    placeholder="Seleccione Proyecto"
                                    aria-describedby="typeaheadError"
                                    options={options}
                                    selected={selectedOptions}
                                    onChange={handleSelectionChange}
                                    onBlur={validateProjects}
                                    isValid={selectedOptions.length > 0}
                                />
                                { errorMessages.projects && <span className={`text-danger`}>{`${errorMessages.projects}`}</span>}
                                </div>
                            )}
                            />
                    </div></div>
                    <div className={`text-left p-3`}>
                        { selectedOptions?.length > 0 && (
                            <p style={{ display: 'inline-block', marginRight: '10px' }}><b>Reportes:</b></p>
                        )} 
                               { selectedOptions?.map((option: any, index: any) => (
                                  <span key={index}>
                                  <span style={{ display: 'inline-block', marginRight: '10px' }}>
                                    {option}
                                  </span>
                                  {index < selectedOptions?.length - 1 && <span>,</span>}
                                </span>
                              ))}
                    </div><div className={`col-md-12 d-flex align-items-center justify-content-center mt-5`}> 
                    <button className={`btn btn-success`} onClick={saveGroup}  disabled={(!validInput || selectedOptions?.length == 0) || isLoading }>Actualizar</button>
                    <ListGroup.Item><Link to="/group-list" className={`btn btn-primary ms-2`}>Volver</Link>
                    </ListGroup.Item>
                    </div></div></div></div>
)}
  export default GroupEdit;