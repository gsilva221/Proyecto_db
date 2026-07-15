import React, { useEffect, useState } from 'react';
import guardiaService from '../services/guardiaService';

type Guardia = {
  _id?: string;
  id?: string;
  nombre: string;
  rut: string;
  telefono?: string;
  activo?: boolean;
};

const AdminGuardias: React.FC = () => {
  const [guardias, setGuardias] = useState<Guardia[]>([]);
  const [form, setForm] = useState({ nombre: '', rut: '', telefono: '' });
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingOriginalId, setEditingOriginalId] = useState<string | null>(null);
  const [editNombre, setEditNombre] = useState('');
  const [editRut, setEditRut] = useState('');
  const [editTelefono, setEditTelefono] = useState('');
  const [editActivo, setEditActivo] = useState(true);

  const cargar = async () => {
    try {
      const data = await guardiaService.obtenerGuardias();
      setGuardias(Array.isArray(data) ? data : []);
    } catch (error) {
      setMensaje({ tipo: 'error', texto: 'Error al cargar guardias' });
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
      const payload = { nombre: form.nombre.trim(), rut: form.rut.trim(), telefono: form.telefono.trim() };
      const created = await guardiaService.crearGuardia(payload as any);
      setForm({ nombre: '', rut: '', telefono: '' });
      await cargar();
      setMensaje({ tipo: 'success', texto: 'Guardia registrado' });
    } catch (error: any) {
      setMensaje({ tipo: 'error', texto: error?.response?.data?.mensaje || 'Error al registrar guardia' });
    } finally { setLoading(false); }
  };

  const startEdit = (g: Guardia, key?: string) => {
    const id = g._id ?? (g as any).id ?? null;
    setEditingKey(key ?? id);
    setEditingOriginalId(id);
    setEditNombre(g.nombre);
    setEditRut(g.rut);
    setEditTelefono(g.telefono || '');
    setEditActivo(g.activo !== undefined ? !!g.activo : true);
    setMensaje(null);
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setEditingOriginalId(null);
    setEditNombre('');
    setEditRut('');
    setEditTelefono('');
    setEditActivo(true);
  };

  const handleUpdate = async () => {
    const id = editingOriginalId;
    if (!id) {
      setMensaje({ tipo: 'error', texto: 'No se puede actualizar: guardia no existe en el servidor' });
      return;
    }
    setLoading(true);
    try {
      const payload = { nombre: editNombre.trim(), rut: editRut.trim(), telefono: editTelefono.trim(), activo: !!editActivo };
      const updated = await guardiaService.actualizarGuardia(id, payload as any);
      setGuardias((prev) => prev.map((it) => ((it._id === id || (it as any).id === id) ? updated : it)));
      cancelEdit();
      setMensaje({ tipo: 'success', texto: 'Guardia actualizado' });
    } catch (error: any) {
      setMensaje({ tipo: 'error', texto: error?.response?.data?.mensaje || 'Error al actualizar guardia' });
    } finally { setLoading(false); }
  };

  const handleDelete = async (id?: string, g?: Guardia) => {
    if (!id) {
      // eliminar local
      setGuardias(prev => prev.filter(it => it !== g));
      setMensaje({ tipo: 'success', texto: 'Entrada local eliminada' });
      return;
    }
    setLoading(true);
    try {
      await guardiaService.eliminarGuardia(id);
      setGuardias((prev) => prev.filter((it) => (it._id !== id && (it as any).id !== id)));
      setMensaje({ tipo: 'success', texto: 'Guardia eliminado' });
    } catch (error: any) {
      setMensaje({ tipo: 'error', texto: error?.response?.data?.mensaje || 'Error al eliminar guardia' });
    } finally { setLoading(false); }
  };

  // seguridad en componente: sólo administradores
  const stored = localStorage.getItem('usuario');
  const usuario = stored ? JSON.parse(stored) : null;
  if (!usuario || (usuario.rol !== 'administrador' && usuario.role !== 'administrador')) {
    return <div style={{ color: '#f87171' }}>Acceso denegado: se requiere rol administrador.</div>;
  }

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      <div style={{ background: '#1e1e24', borderRadius: '16px', padding: '24px', color: '#f3f4f6' }}>
        <h3 style={{ margin: '0 0 8px' }}>Registrar Guardia</h3>
        <p style={{ margin: '0 0 20px', color: '#b8bcc8' }}>Registra un nuevo guardia.</p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px' }}>
          <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre completo" required style={inputStyle} />
          <input name="rut" value={form.rut} onChange={handleChange} placeholder="RUT/DNI" required style={inputStyle} />
          <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" style={inputStyle} />

          {mensaje && (
            <div style={{ padding: '10px 12px', borderRadius: '8px', background: mensaje.tipo === 'success' ? '#143d2a' : '#3f1d1d', color: mensaje.tipo === 'success' ? '#b8f3c8' : '#f7b0b0' }}>
              {mensaje.texto}
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" disabled={loading} style={{ ...buttonStyle, background: loading ? '#4b5d8d' : '#2563eb' }}>
              {loading ? 'Creando...' : 'Registrar guardia'}
            </button>
          </div>
        </form>
      </div>

      <div style={{ background: '#1e1e24', borderRadius: '16px', padding: '24px', color: '#f3f4f6' }}>
        <h3 style={{ margin: '0 0 8px' }}>Guardias registrados</h3>
        <p style={{ margin: '0 0 16px', color: '#b8bcc8' }}>Listado de guardias registrados.</p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: '#9ca3af' }}>
                <th style={thStyle}>Nombre</th>
                <th style={thStyle}>RUT</th>
                <th style={thStyle}>Teléfono</th>
                <th style={thStyle}>Estado</th>
                <th style={thStyle}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {guardias.length === 0 ? (
                <tr>
                  <td style={{ ...tdStyle, padding: 20, color: '#b8bcc8' }} colSpan={5}>No hay guardias registrados</td>
                </tr>
              ) : (
                guardias.map((g, i) => {
                  const origId = g._id ?? (g as any).id ?? null;
                  const keyId = origId || `${g.rut}-${i}`;
                  const isEditing = editingKey === keyId;
                  return (
                    <tr key={keyId} style={{ borderTop: '1px solid #2f2f36' }}>
                      <td style={tdStyle}>
                        {isEditing ? (
                          <input value={editNombre} onChange={(e) => setEditNombre(e.target.value)} style={inputStyle} />
                        ) : (
                          g.nombre
                        )}
                      </td>
                      <td style={tdStyle}>
                        {isEditing ? (
                          <input value={editRut} onChange={(e) => setEditRut(e.target.value)} style={inputStyle} />
                        ) : (
                          g.rut
                        )}
                      </td>
                      <td style={tdStyle}>
                        {isEditing ? (
                          <input value={editTelefono} onChange={(e) => setEditTelefono(e.target.value)} style={inputStyle} />
                        ) : (
                          g.telefono
                        )}
                      </td>
                      <td style={tdStyle}>
                        {isEditing ? (
                          <select value={editActivo ? 'activo' : 'inactivo'} onChange={(e) => setEditActivo(e.target.value === 'activo')} style={{ ...inputStyle, height: 40 }}>
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                          </select>
                        ) : (
                          g.activo ? 'Activo' : 'Inactivo'
                        )}
                      </td>
                      <td style={tdStyle}>
                        {isEditing ? (
                          <>
                            <button type="button" onClick={() => handleUpdate()} style={{ ...actionButtonStyle, background: '#16a34a', marginRight: 8 }}>Guardar</button>
                            <button type="button" onClick={() => cancelEdit()} style={{ ...actionButtonStyle, background: '#6b7280' }}>Cancelar</button>
                          </>
                        ) : (
                          <>
                            <button type="button" onClick={() => startEdit(g, keyId)} style={{ ...actionButtonStyle, background: '#0ea5e9', marginRight: 8 }}>✏️</button>
                            <button type="button" onClick={() => handleDelete(origId || undefined, g)} style={{ ...actionButtonStyle, background: '#b91c1c' }}>🗑️</button>
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

export default AdminGuardias;
