import React, { useState } from 'react';
import usuarioService from '../services/usuarioService';

type UsuarioLogin = {
  id?: string;
  nombre?: string;
  correo?: string;
  rol?: string;
};

type LoginProps = {
  onLoginSuccess: (usuario: UsuarioLogin) => void;
  onSwitchToRegister: () => void;
};

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [form, setForm] = useState({ correo: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'error' | 'success'; texto: string } | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMensaje(null);

    try {
      const data = await usuarioService.login(form);

      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      setMensaje({ tipo: 'success', texto: data.mensaje || 'Inicio de sesión correcto' });
      onLoginSuccess(data.usuario);
    } catch (error: any) {
      const mensajeError = error?.response?.data?.mensaje || 'Error al iniciar sesión';
      setMensaje({ tipo: 'error', texto: mensajeError });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f0f12',
        padding: '24px',
        fontFamily: 'Inter, Arial, sans-serif'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#1e1e24',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
          color: '#f3f4f6'
        }}
      >
        <h2 style={{ margin: '0 0 8px', fontSize: '28px' }}>Iniciar sesión</h2>
        <p style={{ margin: '0 0 24px', color: '#b8bcc8' }}>Accede a tu cuenta para continuar</p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#d7dbe6' }}>Correo</label>
            <input
              type="email"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              required
              placeholder="tu@correo.com"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                border: '1px solid #2f2f36',
                background: '#33333a',
                color: '#fff',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#d7dbe6' }}>Contraseña</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                border: '1px solid #2f2f36',
                background: '#33333a',
                color: '#fff',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {mensaje && (
            <div
              style={{
                marginBottom: '16px',
                padding: '10px 12px',
                borderRadius: '8px',
                background: mensaje.tipo === 'success' ? '#143d2a' : '#3f1d1d',
                color: mensaje.tipo === 'success' ? '#b8f3c8' : '#f7b0b0',
                fontSize: '14px'
              }}
            >
              {mensaje.texto}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px 14px',
              border: 'none',
              borderRadius: '10px',
              background: loading ? '#4b5d8d' : '#2563eb',
              color: '#fff',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 700,
              fontSize: '15px'
            }}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <button
          type="button"
          onClick={onSwitchToRegister}
          style={{
            marginTop: '16px',
            width: '100%',
            background: 'transparent',
            border: 'none',
            color: '#7dd3fc',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ¿No tienes cuenta? Regístrate aquí
        </button>
      </div>
    </div>
  );
};

export default Login;
