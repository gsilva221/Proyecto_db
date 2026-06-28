import api from "./api";

const novedadService = {
    obtenerNovedades: async () => {
        const response = await api.get("/novedad");
        return response.data;
    },

    crearNovedad: async (novedad) => {
        const response = await api.post("/novedad", novedad);
        return response.data;
    },

    actualizarNovedad: async (id, novedad) => {
        const response = await api.put(`/novedad/${id}`, novedad);
        return response.data;
    },

    eliminarNovedad: async (id) => {
        const response = await api.delete(`/novedad/${id}`);
        return response.data;
    }
};

export default novedadService;