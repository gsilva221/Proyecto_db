import React, { useEffect, useState } from 'react';
import departamentoService from '../services/departamentoService';

type Departamento = {
  _id?: string;
  id?: string;
  numero: string;
  piso: number;
};

const AdminDepartamentos: React.FC = () => {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [form, setForm] = useState({ numero: '', piso: '' });
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNumero, setEditNumero] = useState<string>('');
  const [editPiso, setEditPiso] = useState<string>('');
  const [editingOriginalId, setEditingOriginalId] = useState<string | null>(null);

  const cargar = async () => {
    try {
      const data = await departamentoService.obtenerDepartamentos();
      setDepartamentos(Array.isArray(data) ? data : []);
    } catch (err) {
      setMensaje({ tipo: 'error', texto: 'Error al cargar departamentos' });
    }
  };

  useEffect(() => { cargar(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje(null);
    try {
      const payload = { numero: form.numero.trim(), piso: Number(form.piso) };
      await departamentoService.crearDepartamento(payload as any);
      setForm({ numero: '', piso: '' });
      await cargar();
      setMensaje({ tipo: 'success', texto: 'Departamento creado' });
    } catch (error: any) {
      setMensaje({ tipo: 'error', texto: error?.response?.data?.mensaje || 'Error al crear departamento' });
    } finally { setLoading(false); }
  };

  const startEdit = (d: Departamento, idParam?: string | null) => {
    const id = idParam ?? d._id ?? (d as any).id ?? null;
    setEditingId(id);
    setEditingOriginalId(d._id ?? (d as any).id ?? null);
    setEditNumero(d.numero);
    setEditPiso(d.piso?.toString() || '');
    setMensaje(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingOriginalId(null);
    setEditNumero('');
    setEditPiso('');
  };

  const handleUpdate = async () => {
    const id = editingOriginalId;
    if (!id) {
      setMensaje({ tipo: 'error', texto: 'No se puede actualizar: departamento no existe en el servidor' });
      return;
    }
    setLoading(true);
    try {
      const payload = { numero: editNumero.trim(), piso: Number(editPiso) };
      const updated = await departamentoService.actualizarDepartamento(id, payload as any);
      setDepartamentos((prev) => prev.map((it) => ((it._id === id || (it as any).id === id) ? updated : it)));
      cancelEdit();
    } catch (error: any) {
      setMensaje({ tipo: 'error', texto: error?.response?.data?.mensaje || 'Error al actualizar departamento' });
    } finally { setLoading(false); }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    setLoading(true);
    try {
      await departamentoService.eliminarDepartamento(id);
      setDepartamentos((prev) => prev.filter((it) => (it._id !== id && (it as any).id !== id)));
    } catch (error: any) {
      setMensaje({ tipo: 'error', texto: error?.response?.data?.mensaje || 'Error al eliminar departamento' });
    } finally { setLoading(false); }
  };

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      <div style={{ background: '#1e1e24', borderRadius: '16px', padding: '24px', color: '#f3f4f6' }}>
        <h3 style={{ margin: '0 0 8px' }}>Crear Departamento</h3>
        <p style={{ margin: '0 0 20px', color: '#b8bcc8' }}>Agrega un nuevo departamento al sistema.</p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px' }}>
          <input name="numero" value={form.numero} onChange={handleChange} placeholder="Número" required style={inputStyle} />
          <input name="piso" value={form.piso} onChange={handleChange} placeholder="Piso" required style={inputStyle} />

          {mensaje && (
            <div style={{ padding: '10px 12px', borderRadius: '8px', background: mensaje.tipo === 'success' ? '#143d2a' : '#3f1d1d', color: mensaje.tipo === 'success' ? '#b8f3c8' : '#f7b0b0' }}>
              {mensaje.texto}
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" disabled={loading} style={{ ...buttonStyle, background: loading ? '#4b5d8d' : '#2563eb' }}>
              {loading ? 'Creando...' : 'Crear Departamento'}
            </button>
          </div>
        </form>
      </div>

      <div style={{ background: '#1e1e24', borderRadius: '16px', padding: '24px', color: '#f3f4f6' }}>
        <h3 style={{ margin: '0 0 8px' }}>Departamentos</h3>
        <p style={{ margin: '0 0 16px', color: '#b8bcc8' }}>Listado de departamentos registrados.</p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: '#9ca3af' }}>
                <th style={thStyle}>Número</th>
                <th style={thStyle}>Piso</th>
                <th style={thStyle}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {departamentos.length === 0 ? (
                <tr>
                  <td style={{ ...tdStyle, padding: 20, color: '#b8bcc8' }} colSpan={3}>No hay departamentos registrados</td>
                </tr>
              ) : (
                departamentos.map((d, i) => {
                  const origId = d._id ?? (d as any).id ?? null;
                  const keyId = origId || `${d.numero}-${d.piso}-${i}`;
                  const isEditing = editingId === keyId;
                  return (
                    <tr key={keyId} style={{ borderTop: '1px solid #2f2f36' }}>
                      <td style={tdStyle}>
                        {isEditing ? (
                          <input value={editNumero} onChange={(e) => setEditNumero(e.target.value)} style={inputStyle} />
                        ) : (
                          d.numero
                        )}
                      </td>
                      <td style={tdStyle}>
                        {isEditing ? (
                          <input value={editPiso} onChange={(e) => setEditPiso(e.target.value)} style={{ ...inputStyle, width: 120 }} />
                        ) : (
                          d.piso
                        )}
                      </td>
                      <td style={tdStyle}>
                        {isEditing ? (
                          <>
                            <button type="button" onClick={() => { console.log('Guardar click', editingOriginalId); handleUpdate(); }} style={{ ...actionButtonStyle, background: '#16a34a', marginRight: 8 }} aria-label="Guardar">
                              Guardar
                            </button>
                            <button type="button" onClick={() => { console.log('Cancelar click'); cancelEdit(); }} style={{ ...actionButtonStyle, background: '#6b7280' }} aria-label="Cancelar">
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <button type="button" onClick={() => { console.log('Editar click', keyId); startEdit(d, keyId); }} style={{ ...actionButtonStyle, background: '#0ea5e9', marginRight: 8 }} aria-label="Editar">
                              ✏️
                            </button>
                            <button type="button" onClick={() => {
                                console.log('Eliminar click', origId);
                                if (origId) {
                                  handleDelete(origId);
                                } else {
                                  setDepartamentos(prev => prev.filter(it => it !== d));
                                  setMensaje({ tipo: 'success', texto: 'Entrada local eliminada' });
                                }
                              }} style={{ ...actionButtonStyle, background: '#b91c1c' }} aria-label="Eliminar">
                              🗑️
                            </button>
                          </>
                        )}
                      </td>
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

const actionButtonStyle: React.CSSProperties = {
  marginRight: '8px',
  padding: '7px 10px',
  border: 'none',
  borderRadius: '8px',
  background: '#16a34a',
  color: '#fff',
  cursor: 'pointer'
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

const thStyle: React.CSSProperties = {
  padding: '10px 8px',
  fontSize: '13px',
  fontWeight: 600
};

const tdStyle: React.CSSProperties = {
  padding: '10px 8px',
  fontSize: '14px'
};

export default AdminDepartamentos;
