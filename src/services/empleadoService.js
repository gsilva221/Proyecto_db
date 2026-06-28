import api from "./api";

const empleadoService = {
    listar: async () => {
        const response = await api.get("/empleado");
        return response.data;
    },

    crear: async (empleado) => {
        const response = await api.post("/empleado", empleado);
        return response.data;
    },

    eliminar: async (id) => {
        const response = await api.delete(`/empleado/${id}`);
        return response.data;
    }
};

export default empleadoService;