import React, { useState } from 'react';

// 1. Estructura de datos alineada exactamente con tu Backend
interface Visita {
  nombreVisitante: string;
  rutVisitante: string; // Corregido para que coincida con tu BD
  departamento: string;
  motivo: string;       // Agregado el campo que faltaba
}

function App() {
  // 2. Estado inicial con todos los campos vacíos
  const [form, setForm] = useState<Visita>({
    nombreVisitante: '',
    rutVisitante: '',
    departamento: '',
    motivo: ''
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [mensaje, setMensaje] = useState<string>('');

  // 3. Manejador de cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // 4. Envío seguro de los datos a tu URL pública en Render
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');

    try {
      const response = await fetch('https://backend-db-48n7.onrender.com/api/visitas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje('🟢 ¡Visita registrada con éxito!');
        // Reseteamos el formulario al terminar con éxito
        setForm({ nombreVisitante: '', rutVisitante: '', departamento: '', motivo: '' });
      } else {
        // Muestra el mensaje de error personalizado que mande el backend si existe
        setMensaje(`🔴 Error: ${data.mensaje || 'No se pudo guardar la visita'}`);
      }
    } catch (error) {
      console.error(error);
      setMensaje('🔴 Error de red o el servidor está despertando. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '50px auto', 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif', 
      border: '1px solid #444', 
      borderRadius: '8px',
      backgroundColor: '#1e1e24', // Fondo oscuro como tu captura
      color: '#fff' 
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Registro de Visitas 🏢</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>Nombre del Visitante:</label>
          <input
            type="text"
            name="nombreVisitante"
            value={form.nombreVisitante}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', backgroundColor: '#333', color: '#fff', border: '1px solid #555', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>RUT:</label>
          <input
            type="text"
            name="rutVisitante" // Corregido: 'rutVisitante'
            value={form.rutVisitante}
            onChange={handleChange}
            required
            placeholder="19.123.456-7"
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', backgroundColor: '#333', color: '#fff', border: '1px solid #555', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>Departamento:</label>
          <input
            type="text"
            name="departamento"
            value={form.departamento}
            onChange={handleChange}
            required
            placeholder="Ej: 402"
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', backgroundColor: '#333', color: '#fff', border: '1px solid #555', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>Motivo:</label>
          <input
            type="text"
            name="motivo" // Agregado para que viaje al backend
            value={form.motivo}
            onChange={handleChange}
            required
            placeholder="Ej: Delivery de comida o mudanza"
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', backgroundColor: '#333', color: '#fff', border: '1px solid #555', borderRadius: '4px' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '12px', 
            backgroundColor: '#007BFF', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Guardando...' : 'Registrar Visita'}
        </button>
      </form>

      {mensaje && <p style={{ marginTop: '20px', fontWeight: 'bold', textAlign: 'center' }}>{mensaje}</p>}
    </div>
  );
}

export default App;