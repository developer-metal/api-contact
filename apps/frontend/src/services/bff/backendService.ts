import Axios from "axios";

const signOut = async (data:any): Promise<any> => {
    try {   
        const { data: { payload } } = await Axios.post(`${process.env.HOST_BFF_BACKEND}/bff/v1/auth-users/sign-out`,data ,{withCredentials: true}) as any;
        if (!payload) { throw new Error('Error al cerrar session.'); }
        return payload;
    } catch (error) {
        throw error;
    }
};
const login = async (data: any): Promise<any> => {
    try {   
        const { data: { payload } } = await Axios.post(`${process.env.HOST_BFF_BACKEND}/bff/v1/auth-users/login`, data ,{withCredentials: true}) as any;
        if (!payload) { throw new Error('Error al iniciar session.'); }
        return payload;
    } catch (error) {
        throw error;
    }
};
const groupProjects = async (dataGroup:any): Promise<any> => {
    try {   
        const { data } = await Axios.post(`${process.env.HOST_BFF_BACKEND}/bff/v1/auth-users/group-projects`, dataGroup ,{withCredentials: true}) as any;
        if (!data) { throw new Error('Error al cerrar grupo.'); }
        return data;
    } catch (error) {
        throw error;
    }
};

const allGroupProjects = async (dataGroup?:any): Promise<any> => {
    try {   
        const condition: any = dataGroup ? `?${dataGroup}` : '';
        const { data } = await Axios.post(`${process.env.HOST_BFF_BACKEND}/bff/v1/auth-users/all-group-projects${condition}`, dataGroup ,{ withCredentials: true}) as any;
        if (!data) { throw new Error('Error al listar grupo'); }
        return data;
    } catch (error) {
        throw error;
    }
};
const readGroupProjects = async (id:string): Promise<any> => {
    try {   
        const condition: any = id ? `${id}` : '';
        const { data } = await Axios.get(`${process.env.HOST_BFF_BACKEND}/bff/v1/auth-users/${condition}` ,{ withCredentials: true}) as any;
        if (!data) { throw new Error('Error al listar ID grupo'); }
        return data;
    } catch (error) {
        throw error;
    }
};

const updateGroupProjects = async (id:string, dataUpdate: any): Promise<any> => {
    try {   
        const condition: any = id ? `${id}` : '';
        const { data } = await Axios.patch(`${process.env.HOST_BFF_BACKEND}/bff/v1/auth-users/${condition}`, dataUpdate ,{ withCredentials: true}) as any;
        if (!data) { throw new Error('Error al actualizar ID grupo'); }
        return data;
    } catch (error) {
        throw error;
    }
};
const deleteGroupProjects = async (id:string): Promise<any> => {
    try {   
        const condition: any = id ? `${id}` : '';
        const { data } = await Axios.delete(`${process.env.HOST_BFF_BACKEND}/bff/v1/auth-users/${condition}` ,{ withCredentials: true}) as any;
        if (!data) { throw new Error('Error al eliminar ID grupo'); }
        return data;
    } catch (error) {
        throw error;
    }
};
const profilesUsers = async (name?:string): Promise<any> => {
    try {   
        const condition: any = name ? `${name}` : '';
        const { data } = await Axios.post(`${process.env.HOST_BFF_BACKEND}/bff/v1/auth-users/profile-all/${condition}`, { withCredentials: true}) as any;
        if (!data) { throw new Error('Error al consultar perfil usuario.'); }
        return data;
    } catch (error) {
        throw error;
    }
};
export {
    signOut,
    login,
    groupProjects,
    allGroupProjects,
    readGroupProjects,
    updateGroupProjects,
    deleteGroupProjects,
    profilesUsers
};