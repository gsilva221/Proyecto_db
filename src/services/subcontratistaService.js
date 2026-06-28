import api from "./api";

const subcontratistaService = {
    listar: async () => {
        const response = await api.get("/subcontratista");
        return response.data;
    },

    crear: async (subcontratista) => {
        const response = await api.post("/subcontratista", subcontratista);
        return response.data;
    },

    eliminar: async (id) => {
        const response = await api.delete(`/subcontratista/${id}`);
        return response.data;
    }
};