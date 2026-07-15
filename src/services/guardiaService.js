import api from "./api";

const guardiaService = {
    obtenerGuardias: async () => {
        const response = await api.get("/guardias");
        return response.data;
    },

    crearGuardia: async (guardia) => {
        const response = await api.post("/guardias", guardia);
        return response.data;
    },

    actualizarGuardia: async (id, guardia) => {
        const response = await api.put(`/guardias/${id}`, guardia);
        return response.data;
    },

    eliminarGuardia: async (id) => {
        const response = await api.delete(`/guardias/${id}`);
        return response.data;
    }
};

export default guardiaService;