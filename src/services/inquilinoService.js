import api from "./api";

const inquilinoService = {
    obtenerInquilinos: async () => {
        const response = await api.get("/inquilino");
        return response.data;
    },

    crearInquilino: async (inquilino) => {
        const response = await api.post("/inquilino", inquilino);
        return response.data;
    },

    actualizarInquilino: async (id, inquilino) => {
        const response = await api.put(`/inquilino/${id}`, inquilino);
        return response.data;
    },

    eliminarInquilino: async (id) => {
        const response = await api.delete(`/inquilino/${id}`);
        return response.data;
    }
};

export default inquilinoService;