import Axios from "axios";
import { headersCustom } from "../utils/const/TokenHeader";
const allProject = async (params?: any) => {
    try {
      const condition = params ? `?${params}` : '';
      const { data: { payload } } = await Axios.get(`/api/v1/form-project${condition}`, { headers: headersCustom }) as any;
      if (!payload) { throw new Error('Error al obtener los proyectos.'); }
      return payload;
    } catch (error) {
      throw error;
}
};
const createProject = async (dataProject: any) => {
  try {
    const { data } = await Axios.post('/api/v1/form-project',dataProject, { headers: headersCustom }) as any;
    if (!data) { throw new Error('Error registrar Proyecto.'); }
    return data;
  } catch (error) {
    throw error;
  }
};
const updateProject = async (params: any,dataUpdate: any) => {
  try {
    const condition = params ? `/${params}` : '';
    const { data } = await Axios.patch(`/api/v1/form-project${condition}`,dataUpdate, { headers: headersCustom }) as any;
    if (!data) { throw new Error('Error registrar Proyecto.'); }
    return data;
  } catch (error) {
    throw error;
  }
};
const deleteProject = async (params: any) => {
  try {
    const condition = params ? `/${params}` : '';
    const { data } = await Axios.delete(`/api/v1/form-project${condition}`, { headers: headersCustom }) as any;
    if (!data) { throw new Error('Error registrar Proyecto.'); }
    return data;
  } catch (error) {
    throw error;
  }
};

export {
  allProject,
  createProject,
  updateProject,
  deleteProject
};