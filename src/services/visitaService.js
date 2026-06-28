import api from "./api";

const visitaService = {
    obtenerVisitas: async () => {
        const response = await api.get("/visita");
        return response.data;
    },

    registrarVisita: async (visita) => {
        const response = await api.post("/visita", visita);
        return response.data;
    },

    salirVisita: async (id, datos) => {
        const response = await api.put(`/visita/salida/${id}`, datos);
        return response.data;
    }
};

export default visitaService;