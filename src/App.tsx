import React, { useState } from 'react';
// Importamos tu servicio. Ajusta la ruta dependiendo de dónde guardes este componente
import usuarioService from './services/usuarioService'; 

interface Credenciales {
  correo: string;
  password: string; // Cambiado a 'password' para que coincida con tu backend
}

function Login() {
  const [form, setForm] = useState<Credenciales>({
    correo: '',
    password: ''
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [mensaje, setMensaje] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');

    try {
      // Usamos tu servicio limpio que ya configuraste con Axios
      const data = await usuarioService.login(form);

      setMensaje(`🟢 ¡Bienvenido, ${data.usuario.nombre}!`);
      
      // Aquí el backend te devolvió el usuario y su rol.
      console.log("Rol del usuario:", data.usuario.rol);
      
      // TODO: Guardar los datos del usuario y redirigir a la pantalla de visitas

    } catch (error: any) {
      console.error(error);
      // Capturamos el mensaje de error que manda tu backend (ej. "Contraseña incorrecta")
      const mensajeError = error.response?.data?.mensaje || 'Error al conectar con el servidor';
      setMensaje(`🔴 ${mensajeError}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', fontFamily: 'Arial, sans-serif', border: '1px solid #444', borderRadius: '8px', backgroundColor: '#1e1e24', color: '#fff' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Iniciar Sesión 🔐</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>Correo:</label>
          <input
            type="email"
            name="correo"
            value={form.correo}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', backgroundColor: '#333', color: '#fff', border: '1px solid #555', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>Contraseña:</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', backgroundColor: '#333', color: '#fff', border: '1px solid #555', borderRadius: '4px' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ width: '100%', padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
        >
          {loading ? 'Ingresando...' : 'Entrar'}
        </button>
      </form>

      {mensaje && <p style={{ marginTop: '20px', fontWeight: 'bold', textAlign: 'center' }}>{mensaje}</p>}
    </div>
  );
}

export default Login;