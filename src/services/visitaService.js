import api from "./api";

const visitaService = {
    obtenerVisitas: async () => {
        const response = await api.get("/visitas");
        return response.data;
    },

    registrarVisita: async (visita) => {
        const response = await api.post("/visitas", visita, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    },

    actualizarVisita: async (id, visita) => {
        const response = await api.put(`/visitas/${id}`, visita);
        return response.data;
    },

    marcarSalida: async (id) => {
        const response = await api.put(`/visitas/${id}/salida`);
        return response.data;
    },

    eliminarVisita: async (id) => {
        const response = await api.delete(`/visitas/${id}`);
        return response.data;
    }
};

export default visitaService;