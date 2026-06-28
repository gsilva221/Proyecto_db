import api from "./api";

const turnoService = {
    obtenerTurnos: async () => {
        const response = await api.get("/turno");
        return response.data;
    },

    entradaTurno: async (turno) => {
        const response = await api.post("/turno/entrada", turno);
        return response.data;
    },

    salidaTurno: async (id, datos) => {
        const response = await api.put(`/turno/salida/${id}`, datos);
        return response.data;
    }
};

export default turnoService;