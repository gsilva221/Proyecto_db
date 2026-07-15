import React, { useEffect, useState } from 'react';
import visitaService from '../services/visitaService';
import departamentoService from '../services/departamentoService';

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [departamentosLista, setDepartamentosLista] = useState<{ _id?: string; numero: string; piso: number }[]>([]);
  // Inline editing states
  const [editRowId, setEditRowId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({ nombre: '', rut: '', departamento: '', motivo: '' });

  const getVisitaId = (visita: Visita) => visita._id || visita.id || '';

  const cargarVisitas = async () => {
    try {
      const data = await visitaService.getVisitas();
      setVisitas(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Error al cargar visitas:', error);
      setMensaje({ tipo: 'error', texto: error?.response?.data?.mensaje || 'No se pudo cargar visitas' });
    }
  };

  useEffect(() => {
    cargarVisitas();
    cargarDepartamentos();
  }, []);

  const cargarDepartamentos = async () => {
    try {
      const data = await departamentoService.obtenerDepartamentos();
      setDepartamentosLista(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Error al cargar departamentos:', error);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    setForm((prev) => ({ ...prev, [name]: value }));
  };



  const cancelEdit = () => {
    setEditingId(null);
    setForm({ nombre: '', rut: '', departamento: '', motivo: '' });
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

      if (editingId) {
        const updatedVisita = await visitaService.updateVisita(editingId, payload);
        setVisitas((prev) => prev.map((v) => (getVisitaId(v) === editingId ? { ...v, ...updatedVisita } : v)));
        setMensaje({ tipo: 'success', texto: 'Visita actualizada correctamente' });
      } else {
        const nuevaVisita = await visitaService.createVisita(payload);
        setVisitas((prev) => [nuevaVisita, ...prev]);
        setMensaje({ tipo: 'success', texto: 'Visita registrada correctamente' });
      }

      setForm({ nombre: '', rut: '', departamento: '', motivo: '' });
      setEditingId(null);
    } catch (error: any) {
      setMensaje({ tipo: 'error', texto: error?.response?.data?.mensaje || 'Error al guardar visita' });
    } finally {
      setLoading(false);
    }
  };

  const handleMarcarSalida = async (id?: string) => {
    console.log('handleMarcarSalida called with id:', id);
    if (!id) {
      console.warn('No id provided to handleMarcarSalida');
      return;
    }
    setLoading(true);
    setMensaje(null);
    try {
      const updated = await visitaService.registrarSalida(id);
      console.log('registrarSalida response:', updated);
      setVisitas((prev) => prev.map((v) => (getVisitaId(v) === id ? { ...v, ...updated } : v)));
      setMensaje({ tipo: 'success', texto: 'Salida registrada correctamente' });
    } catch (error: any) {
      console.error('Error al registrar salida:', error);
      if (error?.response?.status === 401) {
        setMensaje({ tipo: 'error', texto: 'No autorizado. Inicia sesión nuevamente.' });
      } else if (error?.response?.data?.mensaje) {
        setMensaje({ tipo: 'error', texto: error.response.data.mensaje });
      } else {
        setMensaje({ tipo: 'error', texto: 'Error al registrar salida' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    setLoading(true);
    setMensaje(null);
    try {
      await visitaService.deleteVisita(id);
      setVisitas((prev) => prev.filter((v) => getVisitaId(v) !== id));
      setMensaje({ tipo: 'success', texto: 'Visita eliminada correctamente' });
    } catch (error: any) {
      console.error('Error al eliminar visita:', error);
      setMensaje({ tipo: 'error', texto: error?.response?.data?.mensaje || 'Error al eliminar visita' });
    } finally {
      setLoading(false);
    }
  };

  // Inline edit handlers
  const handleEditClick = (visita: Visita) => {
    const id = visita._id || visita.id || null;
    setEditRowId(id);
    setEditFormData({
      nombre: visita.nombre || '',
      rut: visita.rut || '',
      departamento: visita.departamento || '',
      motivo: visita.motivo || ''
    });
  };

  const handleCancelClick = () => {
    setEditRowId(null);
    setEditFormData({ nombre: '', rut: '', departamento: '', motivo: '' });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveClick = async (id?: string | null) => {
    if (!id) return;
    setLoading(true);
    setMensaje(null);
    try {
      const payload = {
        nombre: editFormData.nombre.trim(),
        rut: editFormData.rut.trim(),
        departamento: editFormData.departamento.trim(),
        motivo: editFormData.motivo.trim(),
      };

      await visitaService.updateVisita(id, payload);
      setVisitas((prev) => prev.map((v) => (getVisitaId(v) === id ? { ...v, ...payload } : v)));
      setMensaje({ tipo: 'success', texto: 'Visita actualizada correctamente' });
      setEditRowId(null);
      setEditFormData({ nombre: '', rut: '', departamento: '', motivo: '' });
    } catch (error: any) {
      console.error('Error al actualizar visita:', error);
      setMensaje({ tipo: 'error', texto: error?.response?.data?.mensaje || 'Error al actualizar visita' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      <div style={{ background: '#1e1e24', borderRadius: '16px', padding: '24px', color: '#f3f4f6' }}>
        <h3 style={{ margin: '0 0 8px' }}>{editingId ? 'Editar visita' : 'Registrar visita'}</h3>
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
          <select name="departamento" value={form.departamento} onChange={handleChange} required style={{ ...inputStyle, height: 40 }}>
            <option value="">Selecciona departamento</option>
            {departamentosLista.map((d) => (
              <option key={d._id} value={d.numero}>{`${d.numero} (Piso ${d.piso})`}</option>
            ))}
          </select>
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

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" disabled={loading} style={{ ...buttonStyle, background: loading ? '#4b5d8d' : '#2563eb' }}>
              {loading ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Registrar visita'}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} style={{ ...buttonStyle, background: '#6b7280' }}>
                Cancelar
              </button>
            )}
          </div>
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
              {visitas.length === 0 ? (
                <tr>
                  <td style={{ ...tdStyle, padding: 20, color: '#b8bcc8' }} colSpan={6}>
                    No hay visitas registradas aún.
                  </td>
                </tr>
              ) : (
                visitas.map((visita) => {
                const visitaId = visita._id || visita.id || '';

                const isEditingRow = visitaId === editRowId;

                return (
                  <tr key={visitaId} style={{ borderTop: '1px solid #2f2f36' }}>
                    {isEditingRow ? (
                      <>
                        <td style={{ ...tdStyle }}>
                          <input name="nombre" value={editFormData.nombre} onChange={handleEditInputChange} style={inputStyle} />
                        </td>
                        <td style={{ ...tdStyle }}>
                          <input name="rut" value={editFormData.rut} onChange={handleEditInputChange} style={inputStyle} />
                        </td>
                        <td style={{ ...tdStyle }}>
                          <select name="departamento" value={editFormData.departamento} onChange={handleEditInputChange} style={{ ...inputStyle, height: 40 }}>
                            <option value="">Selecciona departamento</option>
                            {departamentosLista.map((d) => (
                              <option key={d._id || d.numero} value={d.numero}>{`${d.numero} (Piso ${d.piso})`}</option>
                            ))}
                          </select>
                        </td>
                        <td style={{ ...tdStyle }}>
                          <input name="motivo" value={editFormData.motivo} onChange={handleEditInputChange} style={inputStyle} />
                        </td>
                        <td style={tdStyle}>{visita.estado || 'Dentro'}</td>
                        <td style={tdStyle}>
                          <button onClick={() => handleSaveClick(visitaId)} style={{ ...actionButtonStyle, background: '#16a34a', marginRight: 8 }}>
                            Guardar
                          </button>
                          <button onClick={() => handleCancelClick()} style={{ ...actionButtonStyle, background: '#6b7280' }}>
                            Cancelar
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={tdStyle}>{visita.nombre}</td>
                        <td style={tdStyle}>{visita.rut}</td>
                        <td style={tdStyle}>{visita.departamento}</td>
                        <td style={tdStyle}>{visita.motivo}</td>
                        <td style={tdStyle}>{visita.estado || 'Dentro'}</td>
                        <td style={tdStyle}>
                          <button onClick={() => { console.log('Acción Editar en visita:', visitaId); handleEditClick(visita); }} style={{ ...actionButtonStyle, background: '#0ea5e9', marginRight: 8 }}>
                            ✏️
                          </button>
                          <button onClick={() => { console.log('Acción Registrar Salida en visita:', visitaId); handleMarcarSalida(visitaId); }} style={actionButtonStyle}>
                            ✅
                          </button>
                          <button onClick={() => { console.log('Acción Eliminar en visita:', visitaId); handleDelete(visitaId); }} style={{ ...actionButtonStyle, background: '#b91c1c' }}>
                            🗑️
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                );
                })
              )}
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
