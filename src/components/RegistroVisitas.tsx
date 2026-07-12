import React, { useEffect, useState } from 'react';
import visitaService from '../services/visitaService';

type Visita = {
  id?: string;
  _id?: string;
  nombre: string;
  rut: string;
  departamento: string;
  motivo: string;
  entrada?: string;
  salida?: string | null;
  estado?: string;
};

const RegistroVisitas: React.FC = () => {
  const [form, setForm] = useState({ nombre: '', rut: '', departamento: '', motivo: '' });
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'error' | 'success'; texto: string } | null>(null);

  const getVisitaId = (visita: Visita) => visita.id || visita._id || '';

  const cargarVisitas = async () => {
    try {
      const data = await visitaService.obtenerVisitas();
      setVisitas(data);
    } catch (error: any) {
      setMensaje({ tipo: 'error', texto: error?.response?.data?.mensaje || 'No se pudo cargar visitas' });
    }
  };

  useEffect(() => {
    cargarVisitas();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMensaje(null);

    try {
      const payload = {
        nombre: form.nombre.trim(),
        rut: form.rut.trim(),
        departamento: form.departamento.trim(),
        motivo: form.motivo.trim(),
      };

      await visitaService.registrarVisita(payload);
      setForm({ nombre: '', rut: '', departamento: '', motivo: '' });
      await cargarVisitas();
      setMensaje({ tipo: 'success', texto: 'Visita registrada correctamente' });
    } catch (error: any) {
      setMensaje({ tipo: 'error', texto: error?.response?.data?.mensaje || 'Error al registrar visita' });
    } finally {
      setLoading(false);
    }
  };

  const handleMarcarSalida = async (id?: string) => {
    if (!id) return;
    try {
      await visitaService.marcarSalida(id);
      await cargarVisitas();
      setMensaje({ tipo: 'success', texto: 'Salida registrada' });
    } catch (error: any) {
      setMensaje({ tipo: 'error', texto: error?.response?.data?.mensaje || 'Error al registrar salida' });
    }
  };

  const handleEliminar = async (id?: string) => {
    if (!id) return;
    try {
      await visitaService.eliminarVisita(id);
      await cargarVisitas();
      setMensaje({ tipo: 'success', texto: 'Visita eliminada' });
    } catch (error: any) {
      setMensaje({ tipo: 'error', texto: error?.response?.data?.mensaje || 'Error al eliminar visita' });
    }
  };

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      <div style={{ background: '#1e1e24', borderRadius: '16px', padding: '24px', color: '#f3f4f6' }}>
        <h3 style={{ margin: '0 0 8px' }}>Registrar visita</h3>
        <p style={{ margin: '0 0 20px', color: '#b8bcc8' }}>Ingresa los datos del visitante para controlar el acceso al condominio.</p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px' }}>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            placeholder="Nombre completo"
            style={inputStyle}
          />
          <input
            name="rut"
            value={form.rut}
            onChange={handleChange}
            required
            placeholder="RUT/DNI"
            style={inputStyle}
          />
          <input
            name="departamento"
            value={form.departamento}
            onChange={handleChange}
            required
            placeholder="Departamento a visitar"
            style={inputStyle}
          />
          <textarea
            name="motivo"
            value={form.motivo}
            onChange={handleChange}
            required
            placeholder="Motivo de la visita"
            rows={3}
            style={{ ...inputStyle, resize: 'vertical' }}
          />

          {mensaje && (
            <div style={{ padding: '10px 12px', borderRadius: '8px', background: mensaje.tipo === 'success' ? '#143d2a' : '#3f1d1d', color: mensaje.tipo === 'success' ? '#b8f3c8' : '#f7b0b0' }}>
              {mensaje.texto}
            </div>
          )}

          <button type="submit" disabled={loading} style={{ ...buttonStyle, background: loading ? '#4b5d8d' : '#2563eb' }}>
            {loading ? 'Registrando...' : 'Registrar visita'}
          </button>
        </form>
      </div>

      <div style={{ background: '#1e1e24', borderRadius: '16px', padding: '24px', color: '#f3f4f6' }}>
        <h3 style={{ margin: '0 0 8px' }}>Últimas visitas registradas</h3>
        <p style={{ margin: '0 0 16px', color: '#b8bcc8' }}>Visitas activas y registradas recientemente.</p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: '#9ca3af' }}>
                <th style={thStyle}>Nombre</th>
                <th style={thStyle}>RUT</th>
                <th style={thStyle}>Departamento</th>
                <th style={thStyle}>Motivo</th>
                <th style={thStyle}>Estado</th>
                <th style={thStyle}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visitas.map((visita) => {
                const visitaId = getVisitaId(visita);

                return (
                  <tr key={visitaId} style={{ borderTop: '1px solid #2f2f36' }}>
                    <td style={tdStyle}>{visita.nombre}</td>
                    <td style={tdStyle}>{visita.rut}</td>
                    <td style={tdStyle}>{visita.departamento}</td>
                    <td style={tdStyle}>{visita.motivo}</td>
                    <td style={tdStyle}>{visita.estado || 'Dentro'}</td>
                    <td style={tdStyle}>
                      <button onClick={() => handleMarcarSalida(visitaId)} style={actionButtonStyle}>
                        Salida
                      </button>
                      <button onClick={() => handleEliminar(visitaId)} style={{ ...actionButtonStyle, background: '#b91c1c' }}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '10px',
  border: '1px solid #2f2f36',
  background: '#33333a',
  color: '#fff',
  outline: 'none',
  boxSizing: 'border-box'
};

const buttonStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  border: 'none',
  borderRadius: '10px',
  color: '#fff',
  fontWeight: 700,
  cursor: 'pointer'
};

const actionButtonStyle: React.CSSProperties = {
  marginRight: '8px',
  padding: '7px 10px',
  border: 'none',
  borderRadius: '8px',
  background: '#16a34a',
  color: '#fff',
  cursor: 'pointer'
};

const thStyle: React.CSSProperties = {
  padding: '10px 8px',
  fontSize: '13px',
  fontWeight: 600
};

const tdStyle: React.CSSProperties = {
  padding: '10px 8px',
  fontSize: '14px'
};

export default RegistroVisitas;
