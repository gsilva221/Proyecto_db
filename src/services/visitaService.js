import api from "./api";

const visitaService = {
    // Listar visitas
    getVisitas: async () => {
        const response = await api.get("/visitas");
        return response.data;
    },

    // Crear visita
    createVisita: async (visita) => {
        const response = await api.post("/visitas", visita, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    },

    // Actualizar visita
    updateVisita: async (id, visita) => {
        const response = await api.put(`/visitas/${id}`, visita);
        return response.data;
    },

    // Registrar salida (estado + hora de salida)
    registrarSalida: async (id) => {
        const response = await api.put(`/visitas/${id}/salida`);
        return response.data;
    },

    // Eliminar visita
    deleteVisita: async (id) => {
        const response = await api.delete(`/visitas/${id}`);
        return response.data;
    },

    // Backwards compatibility: previous names
    obtenerVisitas: async () => await visitaService.getVisitas(),
    registrarVisita: async (v) => await visitaService.createVisita(v),
    actualizarVisita: async (id, v) => await visitaService.updateVisita(id, v),
    marcarSalida: async (id) => await visitaService.registrarSalida(id),
    eliminarVisita: async (id) => await visitaService.deleteVisita(id),
};

export default visitaService;