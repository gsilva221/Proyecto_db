import api from "./api";

const usuarioService = {
    obtenerUsuarios: async () => {
        const response = await api.get("/usuarios");
        return response.data;
    },

    obtenerUsuario: async (id) => {
        const response = await api.get(`/usuarios/${id}`);
        return response.data;
    },

    crearUsuario: async (usuario) => {
        const response = await api.post("/usuarios", usuario);
        return response.data;
    },

    actualizarUsuario: async (id, usuario) => {
        const response = await api.put(`/usuarios/${id}`, usuario);
        return response.data;
    },

    eliminarUsuario: async (id) => {
        const response = await api.delete(`/usuarios/${id}`);
        return response.data;
    },

    login: async (credenciales) => {
        const response = await api.post("/usuarios/login", credenciales);
        return response.data;
    }
};

export default usuarioService;