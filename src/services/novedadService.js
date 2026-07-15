import api from "./api";

const novedadService = {
    obtenerNovedades: async () => {
        const response = await api.get("/novedades");
        return response.data;
    },

    crearNovedad: async (novedad) => {
        const response = await api.post("/novedades", novedad);
        return response.data;
    },

    actualizarNovedad: async (id, novedad) => {
        const response = await api.put(`/novedades/${id}`, novedad);
        return response.data;
    },

    eliminarNovedad: async (id) => {
        const response = await api.delete(`/novedades/${id}`);
        return response.data;
    }
};

export default novedadService;