import api from "./api";

const BASE_URL = "/auditoria";

// Obtener todos los registros de auditoría
export const obtenerAuditorias = async () => {
    const response = await api.get(BASE_URL);
    return response.data;
};

// Crear un registro de auditoría
export const crearAuditoria = async (datos) => {
    const response = await api.post(BASE_URL, datos);
    return response.data;
};

// Buscar auditorías por fecha
export const buscarAuditoriasPorFecha = async (fecha) => {
    const response = await api.get(`${BASE_URL}/fecha/${fecha}`);
    return response.data;
};