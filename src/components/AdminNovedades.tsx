import React, { useEffect, useState } from 'react';
import novedadService from '../services/novedadService';

type Novedad = {
  id?: string;
  _id?: string;
  titulo: string;
  descripcion?: string;
  estado?: string;
  fecha?: string;
};

const AdminNovedades: React.FC = () => {
  const [novedades, setNovedades] = useState<Novedad[]>([]);
  const [, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ titulo: '', descripcion: '' });

  const getId = (n: Novedad) => n._id || n.id || '';

  const cargar = async () => {
    setLoading(true);
    try {
      const data = await novedadService.obtenerNovedades();
      setNovedades(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error cargando novedades', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const handleDelete = async (id?: string) => {
    if (!id) return;
    setLoading(true);
    try {
      await novedadService.eliminarNovedad(id);
      setNovedades(prev => prev.filter(n => getId(n) !== id));
    } catch (err) {
      console.error('Error eliminando novedad', err);
    } finally { setLoading(false); }
  };

  const handleStartEdit = (n: Novedad) => {
    setEditId(getId(n));
    setEditForm({ titulo: n.titulo || '', descripcion: n.descripcion || '' });
  };

  const handleCancel = () => { setEditId(null); setEditForm({ titulo: '', descripcion: '' }); };

  const handleSave = async (id?: string) => {
    if (!id) return;
    setLoading(true);
    try {
      const payload = { titulo: editForm.titulo.trim(), descripcion: editForm.descripcion.trim() };
      const updated = await novedadService.actualizarNovedad(id, payload);
      setNovedades(prev => prev.map(n => (getId(n) === id ? { ...n, ...updated } : n)));
      handleCancel();
    } catch (err) {
      console.error('Error actualizando novedad', err);
    } finally { setLoading(false); }
  };

  const handleMarkResolved = async (id?: string) => {
    if (!id) return;
    setLoading(true);
    try {
      const updated = await novedadService.actualizarNovedad(id, { estado: 'resuelto' });
      setNovedades(prev => prev.map(n => (getId(n) === id ? { ...n, ...updated } : n)));
    } catch (err) {
      console.error('Error marcando resuelto', err);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ background: '#1e1e24', borderRadius: 12, padding: 18, color: '#f3f4f6' }}>
        <h3 style={{ margin: 0 }}>Novedades</h3>
        <p style={{ margin: '8px 0 12px', color: '#b8bcc8' }}>Listado de novedades registradas.</p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: '#9ca3af' }}>
                <th style={{ padding: '10px 8px' }}>Título</th>
                <th style={{ padding: '10px 8px' }}>Descripción</th>
                <th style={{ padding: '10px 8px' }}>Fecha</th>
                <th style={{ padding: '10px 8px' }}>Estado</th>
                <th style={{ padding: '10px 8px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {novedades.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: 20, color: '#b8bcc8' }}>No hay novedades.</td></tr>
              ) : (
                novedades.map(n => {
                  const id = getId(n);
                  const isEditing = editId === id;
                  return (
                    <tr key={id || `${n.titulo}-${n.fecha}` } style={{ borderTop: '1px solid #2f2f36' }}>
                      {isEditing ? (
                        <>
                          <td style={{ padding: 10 }}><input value={editForm.titulo} onChange={e => setEditForm(prev => ({ ...prev, titulo: e.target.value }))} style={inputStyle} /></td>
                          <td style={{ padding: 10 }}><input value={editForm.descripcion} onChange={e => setEditForm(prev => ({ ...prev, descripcion: e.target.value }))} style={inputStyle} /></td>
                          <td style={{ padding: 10 }}>{n.fecha ? new Date(n.fecha).toLocaleString() : '-'}</td>
                          <td style={{ padding: 10 }}>{n.estado || 'pendiente'}</td>
                          <td style={{ padding: 10 }}>
                            <button onClick={() => handleSave(id)} style={{ ...actionBtn, background: '#16a34a' }}>Guardar</button>
                            <button onClick={handleCancel} style={{ ...actionBtn, background: '#6b7280' }}>Cancelar</button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td style={{ padding: 10 }}>{n.titulo}</td>
                          <td style={{ padding: 10 }}>{n.descripcion}</td>
                          <td style={{ padding: 10 }}>{n.fecha ? new Date(n.fecha).toLocaleString() : '-'}</td>
                          <td style={{ padding: 10 }}>{n.estado || 'pendiente'}</td>
                          <td style={{ padding: 10 }}>
                            <button onClick={() => handleStartEdit(n)} style={{ ...actionBtn, background: '#0ea5e9', marginRight: 8 }}>✏️</button>
                            <button onClick={() => handleMarkResolved(id)} style={{ ...actionBtn, background: '#16a34a', marginRight: 8 }}>Marcar resuelto</button>
                            <button onClick={() => handleDelete(id)} style={{ ...actionBtn, background: '#b91c1c' }}>🗑️</button>
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
  width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #2f2f36', background: '#33333a', color: '#fff'
};

const actionBtn: React.CSSProperties = {
  padding: '7px 10px', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer'
};

export default AdminNovedades;
