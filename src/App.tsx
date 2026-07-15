import { useEffect, useState } from 'react';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import RegistroVisitas from './components/RegistroVisitas';
import AdminDepartamentos from './components/AdminDepartamentos';

type MenuKey = 'Dashboard' | 'Registro de Visitas' | 'Departamentos';

const menuItems: { key: MenuKey; label: string; icon: string }[] = [
  { key: 'Dashboard', label: 'Dashboard', icon: 'fa-gauge-high' },
  { key: 'Registro de Visitas', label: 'Visitas', icon: 'fa-user-check' },
];

const dashboardStats = [
  { label: 'Personas dentro', value: '24', icon: 'fa-person', color: '#2563eb' },
  { label: 'Guardias en turno', value: '5', icon: 'fa-user-shield', color: '#1d4ed8' },
  { label: 'Visitas del día', value: '14', icon: 'fa-user-check', color: '#7c3aed' },
  { label: 'Novedades registradas', value: '6', icon: 'fa-exclamation-triangle', color: '#ef4444' },
];

function App() {
  const [username, setUsername] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedMenu, setSelectedMenu] = useState<MenuKey>('Dashboard');
  const [userRole, setUserRole] = useState<string>('');
  const [currentTime, setCurrentTime] = useState(new Date());

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setIsAuthenticated(false);
    setUsername('');
    setSelectedMenu('Dashboard');
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const storedUsuario = localStorage.getItem('usuario');
    const storedToken = localStorage.getItem('token');

    if (storedToken && storedUsuario) {
      const usuario = JSON.parse(storedUsuario);
      setUsername(usuario?.nombre || usuario?.correo || 'Usuario');
      setUserRole(usuario?.rol || usuario?.role || '');
      setIsAuthenticated(true);
    }
  }, []);

  const formattedDate = currentTime.toLocaleDateString('es-CL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = currentTime.toLocaleTimeString('es-CL');
  

  const handleLoginSuccess = (usuario: { nombre?: string; correo?: string; rol?: string }) => {
    setUsername(usuario?.nombre || usuario?.correo || 'Usuario');
    setUserRole(usuario?.rol || '');
    setIsAuthenticated(true);
  };

  const handleRegisterSuccess = (usuario: { nombre?: string; correo?: string; rol?: string }) => {
    setUsername(usuario?.nombre || usuario?.correo || 'Usuario');
    setAuthMode('login');
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case 'Dashboard':
        return (
          <>
            <div className="dashboard-grid">
              {dashboardStats.map((stat) => (
                <article className="dashboard-card" key={stat.label} style={{ borderTopColor: stat.color }}>
                  <div className="dashboard-card-icon" style={{ background: `${stat.color}1f` }}>
                    <i className={`fa-solid ${stat.icon}`}></i>
                  </div>
                  <div>
                    <p>{stat.label}</p>
                    <strong>{stat.value}</strong>
                  </div>
                </article>
              ))}
            </div>

            <div className="panel-card">
              <h3>Resumen general</h3>
              <p>Visión rápida de operaciones del edificio y actividades del día.</p>
              <div className="panel-grid">
                <div className="panel-stat">
                  <span>Visitas activas</span>
                  <strong>3</strong>
                </div>
                <div className="panel-stat">
                  <span>Guardias en turno</span>
                  <strong>5</strong>
                </div>
                <div className="panel-stat">
                  <span>Paquetes pendientes</span>
                  <strong>9</strong>
                </div>
                <div className="panel-stat">
                  <span>Novedades recientes</span>
                  <strong>6</strong>
                </div>
              </div>
            </div>
          </>
        );

      case 'Registro de Visitas':
        return <RegistroVisitas />;

      case 'Departamentos':
        return <AdminDepartamentos />;

      default:
        return null;
    }
  };

  if (!isAuthenticated) {
    return authMode === 'login' ? (
      <Login
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => setAuthMode('register')}
      />
    ) : (
      <Register
        onRegisterSuccess={handleRegisterSuccess}
        onSwitchToLogin={() => setAuthMode('login')}
      />
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-brand">
          <div className="brand-mark-mini"><i className="fa-solid fa-shield-halved"></i></div>
          <div>
            <p className="topbar-title">CondoManage</p>
            <p className="topbar-subtitle">Dashboard Administrativo</p>
          </div>
        </div>

        <div className="topbar-meta">
          <div className="meta-row">
            <span><i className="fa-solid fa-user"></i> {username}</span>
            <span><i className="fa-solid fa-user-tag"></i> {userRole}</span>
          </div>
          <div className="meta-row">
            <span><i className="fa-solid fa-calendar-day"></i> {formattedDate}</span>
            <span><i className="fa-solid fa-clock"></i> {formattedTime}</span>
          </div>
        </div>

        <div className="topbar-actions">
          <button className="secondary-button" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i> Cerrar sesión
          </button>
        </div>
      </header>

      <div className="main-layout">
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="sidebar-logo"><i className="fa-solid fa-building-columns"></i></div>
            <div>
              <p>CondoManage</p>
              <span>Panel</span>
            </div>
          </div>

          <nav className="menu-list">
            {menuItems.map((item) => (
              <button
                key={item.key}
                className={`menu-item ${selectedMenu === item.key ? 'active' : ''}`}
                onClick={() => setSelectedMenu(item.key)}
              >
                <span className="menu-icon"><i className={`fa-solid ${item.icon}`}></i></span>
                {item.label}
              </button>
            ))}
            {userRole === 'administrador' && (
              <button
                className={`menu-item ${selectedMenu === 'Departamentos' ? 'active' : ''}`}
                onClick={() => setSelectedMenu('Departamentos')}
              >
                <span className="menu-icon"><i className={`fa-solid fa-building`}></i></span>
                Departamentos
              </button>
            )}
          </nav>
        </aside>

        <main className="content-panel">
          <div className="content-header">
            <div>
              <h2>{selectedMenu}</h2>
              <p>Gestión completa del condominio con navegación sin recarga.</p>
            </div>
          </div>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
