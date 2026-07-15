import api from './api';

const departamentoService = {
  obtenerDepartamentos: async () => {
    const response = await api.get('/departamentos');
    return response.data;
  },

  crearDepartamento: async (departamento) => {
    const response = await api.post('/departamentos', departamento);
    return response.data;
  },

  actualizarDepartamento: async (id, departamento) => {
    const response = await api.put(`/departamentos/${id}`, departamento);
    return response.data;
  },

  eliminarDepartamento: async (id) => {
    const response = await api.delete(`/departamentos/${id}`);
    return response.data;
  }
};

export default departamentoService;