import React, { useState } from 'react';
import novedadService from '../services/novedadService';

type Props = {
  onCreated?: (n: any) => void;
};

const NewNovedad: React.FC<Props> = ({ onCreated }) => {
  const [form, setForm] = useState({ titulo: '', descripcion: '' });
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'error' | 'success'; texto: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as HTMLInputElement | HTMLTextAreaElement;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje(null);
    try {
      // include current user (if any) for auditing
      let usuarioNombre: string | null = null;
      try {
        const stored = localStorage.getItem('usuario');
        if (stored) {
          const u = JSON.parse(stored);
          usuarioNombre = u?.nombre || u?.correo || null;
        }
      } catch (e) {
        usuarioNombre = null;
      }

      const payload = { titulo: form.titulo.trim(), descripcion: form.descripcion.trim(), usuario: usuarioNombre };
      const created = await novedadService.crearNovedad(payload);
      setMensaje({ tipo: 'success', texto: 'Novedad registrada correctamente' });
      setForm({ titulo: '', descripcion: '' });
      if (onCreated) onCreated(created);
    } catch (error: any) {
      setMensaje({ tipo: 'error', texto: error?.response?.data?.mensaje || 'Error al crear novedad' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#1e1e24', borderRadius: 12, padding: 18, color: '#f3f4f6' }}>
      <h3 style={{ margin: '0 0 8px' }}>Nueva Novedad</h3>
      <p style={{ margin: '0 0 12px', color: '#b8bcc8' }}>Registra una novedad para que el equipo lo revise.</p>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
        <input name="titulo" value={form.titulo} onChange={handleChange} required placeholder="Título" style={inputStyle} />
        <textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción (opcional)" rows={3} style={{ ...inputStyle, resize: 'vertical' }} />

        {mensaje && (
          <div style={{ padding: '10px 12px', borderRadius: '8px', background: mensaje.tipo === 'success' ? '#143d2a' : '#3f1d1d', color: mensaje.tipo === 'success' ? '#b8f3c8' : '#f7b0b0' }}>
            {mensaje.texto}
          </div>
        )}

        <button type="submit" disabled={loading} style={{ ...buttonStyle, background: loading ? '#4b5d8d' : '#2563eb' }}>
          {loading ? 'Enviando...' : 'Registrar novedad'}
        </button>
      </form>
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

export default NewNovedad;
