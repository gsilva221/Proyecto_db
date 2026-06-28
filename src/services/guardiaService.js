import api from "./api";

const guardiaService = {
    obtenerGuardias: async () => {
        const response = await api.get("/guardia");
        return response.data;
    },

    crearGuardia: async (guardia) => {
        const response = await api.post("/guardia", guardia);
        return response.data;
    },

    actualizarGuardia: async (id, guardia) => {
        const response = await api.put(`/guardia/${id}`, guardia);
        return response.data;
    },

    eliminarGuardia: async (id) => {
        const response = await api.delete(`/guardia/${id}`);
        return response.data;
    }
};

export default guardiaService;