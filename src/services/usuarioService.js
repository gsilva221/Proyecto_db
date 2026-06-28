import api from "./api";

const usuarioService = {
    obtenerUsuarios: async () => {
        const response = await api.get("/usuario");
        return response.data;
    },

    obtenerUsuario: async (id) => {
        const response = await api.get(`/usuario/${id}`);
        return response.data;
    },

    crearUsuario: async (usuario) => {
        const response = await api.post("/usuario", usuario);
        return response.data;
    },

    actualizarUsuario: async (id, usuario) => {
        const response = await api.put(`/usuario/${id}`, usuario);
        return response.data;
    },

    eliminarUsuario: async (id) => {
        const response = await api.delete(`/usuario/${id}`);
        return response.data;
    },

    login: async (credenciales) => {
        const response = await api.post("/usuario/login", credenciales);
        return response.data;
    }
};

export default usuarioService;