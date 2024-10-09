import Axios from "axios";
import { headersCustom } from "../utils/const/TokenHeader";
const allForms = async (data?: any): Promise<any> => {
    try {   
        const condition = data ? `?${data}` : '';
        const { data: { payload } } = await Axios.get(`/api/v1/form-general/${condition}`, { headers: headersCustom }) as any;
        if (!payload) { throw new Error('Error al obtener los formularios.'); }
        return payload;
    } catch (error) {
        throw error;
    }
};
const deleteForm = async (data?: any): Promise<any> => {
    try {   
        const condition = data ? `${data}` : '';
        const { data: { payload } } = await Axios.delete(`/api/v1/form-general/${condition}`, { headers: headersCustom }) as any;
        if (!payload) { throw new Error('Error al obtener los formularios.'); }
        return payload;
    } catch (error) {
        throw error;
    }
};

export {
    allForms,
    deleteForm
}
