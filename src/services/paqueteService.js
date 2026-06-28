import api from "./api";

const paqueteService = {
    obtenerPaquetes: async () => {
        const response = await api.get("/paquete");
        return response.data;
    },

    crearPaquete: async (paquete) => {
        const response = await api.post("/paquete", paquete);
        return response.data;
    },

    actualizarPaquete: async (id, paquete) => {
        const response = await api.put(`/paquete/${id}`, paquete);
        return response.data;
    },

    eliminarPaquete: async (id) => {
        const response = await api.delete(`/paquete/${id}`);
        return response.data;
    }
};

export default paqueteService;