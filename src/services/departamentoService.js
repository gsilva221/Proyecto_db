import api from "./api";

const auditoriaService = {
    // Obtener todos los registros
    obtenerAuditorias: async () => {
        const response = await api.get("/auditoria");
        return response.data;
    },

    // Crear un nuevo registro
    crearAuditoria: async (datos) => {
        const response = await api.post("/auditoria", datos);
        return response.data;
    },

    // Buscar por fecha
    buscarPorFecha: async (fecha) => {
        const response = await api.get(`/auditoria/fecha/${fecha}`);
        return response.data;
    }
};

export default auditoriaService;