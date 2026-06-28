import api from "./api";

const solicitudService = {
    obtenerSolicitudes: async () => {
        const response = await api.get("/solicitud");
        return response.data;
    },

    crearSolicitud: async (solicitud) => {
        const response = await api.post("/solicitud", solicitud);
        return response.data;
    },

    aprobarSolicitud: async (id) => {
        const response = await api.put(`/solicitud/aprobar/${id}`);
        return response.data;
    },

    rechazarSolicitud: async (id) => {
        const response = await api.put(`/solicitud/rechazar/${id}`);
        return response.data;
    },

    eliminarSolicitud: async (id) => {
        const response = await api.delete(`/solicitud/${id}`);
        return response.data;
    }
};

export default solicitudService;