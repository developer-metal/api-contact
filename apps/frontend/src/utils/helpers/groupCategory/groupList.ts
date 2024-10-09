import { allGroupProjects, deleteGroupProjects, groupProjects, readGroupProjects, updateGroupProjects } from "../../../services/bff/backendService";
import { allProject } from "../../../services/projectService";

const listUpdate = async (setIsLoading: any, isFlagRoute: any, isStatusValid: any, setContentModal: any, showModal: any, setGroup: any, setFilter: any) => {
    try {
      const {payload} = await allGroupProjects();
      if (payload.length > 0) {
      setIsLoading(false);
      const formatData = payload.map((val: any,index: any) => ({
        ...val,
        id: (index + 1),
        name: val.name,
        projects: val.projects,
        active: val.active
    }));
    const messageModal: string = !isFlagRoute ? `¿Está seguro que desea ${ !isStatusValid ? 'Activar' : 'Desactivar'} el Grupo ?` : `¿Está seguro que desea eliminar el Grupo ?`;
    const buttonMessage: string = !isFlagRoute ? `Confirmo ${ !isStatusValid ? 'Activación' : 'Desactivación'}`: `Confirmo Eliminación`; 
    setContentModal({
      description: messageModal,
      titleButton: [{variant: 'secondary', name: 'Cerrar' }, {variant: 'primary', name: buttonMessage}],
      showParam: showModal
    });
    setGroup(formatData);
    setFilter(formatData);
  }
  } catch (error) {
      console.log('error al listar grupo',error);
  }
  }
  const deleteGroup = async (setButtonStatus: any, dataId: any, setShowModal: any, setShowModalAlert: any) => {
    try{
      setButtonStatus(true);
      const { payload } =  await deleteGroupProjects(dataId);
      if (payload.message == 'SUCCESS_DELETE_GROUP_PROJECTS') {
        console.log('eliminado');
        setButtonStatus(false);
        setShowModal(false);
        setShowModalAlert(false);
        } else if (payload.message == 'ERROR_DELETE_GROUP_PROJECT_ACTIVE') {
          console.log('desactivar registro');
          setButtonStatus(false);
          setShowModal(true);
          setShowModalAlert(true);
        }
      } catch (error) {
        setButtonStatus(false);
        setShowModal(false);
        setShowModalAlert(false);
        console.log('error al eliminado grupo ',error);
      }
  }
  const validStatusGroup = async (setButtonStatus: any, dataId: any, isStatusValid: any, setShowModalAlert: any, setShowModal: any) => {
    try{
      setButtonStatus(true);
      const { payload } =  await updateGroupProjects(dataId, { active: isStatusValid ? false : true });
      if (payload.message == 'SUCCESS_UPDATE_GROUP_PROJECTS') {
        console.log('actualizado');
        setShowModalAlert(false);
        setButtonStatus(false);
        setShowModal(false);
        }
      } catch (error) {
        setShowModalAlert(false);
        setShowModal(false);
        setButtonStatus(false);
        console.log('error al actualizar status ',error);
      }
  }
  const modalSend = async (isFlagRoute: any, setButtonStatus: any, dataId: any, setShowModal: any, setShowModalAlert: any, isStatusValid: any) => {
    if (isFlagRoute) {
      console.log('eliminar');
      await deleteGroup(setButtonStatus, dataId, setShowModal, setShowModalAlert);
    } else {
      console.log('actualizar status');
      await validStatusGroup(setButtonStatus, dataId, isStatusValid, setShowModalAlert, setShowModal);
    }
  };
  const validaModalDelete = (id: string, setFlagRoute: any, setId: any, setButtonStatus: any, setShowModal: any, setShowModalAlert: any) => {
    setFlagRoute(true);
      setId(id);
      setButtonStatus(false);
      setShowModal(true);
      setShowModalAlert(false);
  };
  const validaModalStatus = (id: string, status: boolean, setFlagRoute: any, setId: any, setStatus: any, setButtonStatus: any, setShowModal: any, setShowModalAlert: any) => {
     setFlagRoute(false);
      setId(id);
      setStatus(status);
       setButtonStatus(false);
      setShowModal(true);
      setShowModalAlert(false);
  };
  const validateProjects = (selectedOptions: any, errorMessages: any, setErrorMessages: any) => {
    let errorMessage = selectedOptions?.length == 0 ? `${'projects'} requerido` : '';
    setErrorMessages({...errorMessages, 'projects': errorMessage });
  }
  const validInputEmpy = (inputValue: any, setInput: any) => {
    if (String(inputValue).trim() !== '') {
      setInput(true);
  } else {
      setInput(false);
  }
  }
  const validateGroup = (fieldName?: any, event?: any, getValues?: any, setInput?: any, inputClass?: any, setInputClass?: any, setErrorMessages?: any, errorMessages?: any) => {
    const inputValue = event?.target?.value || getValues('category');
    validInputEmpy(inputValue, setInput);
    let newClass = String(inputValue).trim() === '' ? 'form-control is-invalid' : 'form-control';
    let errorMessage = String(inputValue).trim() === '' ? `${fieldName} requerido` : '';
    setInputClass({ ...inputClass, 'category': newClass});
    setErrorMessages({...errorMessages, 'category': errorMessage });
  };
  const getProjects = async (setOptions: any) => {
    const payload = await allProject();
    const dataProj = payload.map((val: any) => val.name);
    if (dataProj?.length > 0) {
    setOptions(dataProj);
    }
  };
  const getAllCategory = async (setOptions: any, id: any, setIsLoading: any, setValue: any, setSelectedOptions: any) => {
    try {
      await getProjects(setOptions);
      const { payload } = await readGroupProjects(id);
      if ( payload ) {
        console.log('payload ',payload.projects);
        setIsLoading(true);
        const dataProject: any= payload.projects.map((val: any) => val.name);
        setValue('category', payload.name);
        setSelectedOptions(dataProject);
        validateGroup();
      }
  } catch (error) {
    setIsLoading(true);
    console.log('error consultar Projecto',error);
  }
  }
  const saveGroupCategory = async (setisLoading: any, selectedOptions: any, getValues: any, id: any,setError: any, navigate: any) => {
    setisLoading(true);
    try {
    const projectsSelect: any = selectedOptions?.map((val: any) => ({name: val}));
    const data: any = { name: getValues('category'), projects: projectsSelect };
    const { payload } = await updateGroupProjects(id, data);
    if (payload.message == 'SUCCESS_UPDATE_GROUP_PROJECTS') {
      setError(false);
      setisLoading(false);
      navigate('/group-list');
      }
    } catch (error) {
      setisLoading(false);
      setError(true);
      console.log('error Group ',error);
    }
  }
  const saveGroupCreate = async (setisLoading: any, selectedOptions: any, getValues: any, setError: any, navigate: any) => {
    setisLoading(true);
    try {
    const projectsSelect: any = selectedOptions.map((val: any) => ({name: val}));
    const data: any = { name: getValues('category'), projects: projectsSelect };
    const { payload } = await groupProjects(data);
    if (payload == 'SUCCESS_GROUP_PROJECTS') {
      setError(false);
      setisLoading(false);
      navigate('/group-list');
      }
    } catch (error) {
      setisLoading(false);
      setError(true);
      console.log('error Group ',error);
    }
  }
  export {
    listUpdate,
    deleteGroup,
    validStatusGroup,
    modalSend,
    validaModalDelete,
    validaModalStatus,
    validateProjects,
    validateGroup,
    getAllCategory,
    saveGroupCategory,
    validInputEmpy,
    getProjects,
    saveGroupCreate
  }