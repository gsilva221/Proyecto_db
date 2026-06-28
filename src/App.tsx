import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

type MenuKey =
  | 'Dashboard'
  | 'Gestión de Inquilinos'
  | 'Gestión de Departamentos'
  | 'Asignación de Inquilinos'
  | 'Gestión de Guardias'
  | 'Gestión de Empleados'
  | 'Gestión de Subcontratistas'
  | 'Registro de Novedades'
  | 'Bitácora Diaria'
  | 'Registro de Turnos'
  | 'Registro de Ingresos y Salidas'
  | 'Solicitud de Implementos'
  | 'Registro de Visitas'
  | 'Registro de Paquetes'
  | 'Usuarios del Sistema'
  | 'Reportes';

const menuItems: { key: MenuKey; label: string; icon: string }[] = [
  { key: 'Dashboard', label: 'Dashboard', icon: 'fa-gauge-high' },
  { key: 'Gestión de Inquilinos', label: 'Inquilinos', icon: 'fa-user-group' },
  { key: 'Gestión de Departamentos', label: 'Departamentos', icon: 'fa-building' },
  { key: 'Asignación de Inquilinos', label: 'Asignación', icon: 'fa-arrows-left-right' },
  { key: 'Gestión de Guardias', label: 'Guardias', icon: 'fa-user-shield' },
  { key: 'Gestión de Empleados', label: 'Empleados', icon: 'fa-briefcase' },
  { key: 'Gestión de Subcontratistas', label: 'Subcontratistas', icon: 'fa-hands-helping' },
  { key: 'Registro de Novedades', label: 'Novedades', icon: 'fa-note-sticky' },
  { key: 'Bitácora Diaria', label: 'Bitácora', icon: 'fa-book' },
  { key: 'Registro de Turnos', label: 'Turnos', icon: 'fa-clock' },
  { key: 'Registro de Ingresos y Salidas', label: 'Ingresos/Salidas', icon: 'fa-door-open' },
  { key: 'Solicitud de Implementos', label: 'Implementos', icon: 'fa-box-open' },
  { key: 'Registro de Visitas', label: 'Visitas', icon: 'fa-user-check' },
  { key: 'Registro de Paquetes', label: 'Paquetes', icon: 'fa-boxes-packing' },
  { key: 'Usuarios del Sistema', label: 'Usuarios', icon: 'fa-users-gear' },
  { key: 'Reportes', label: 'Reportes', icon: 'fa-chart-line' }
];

interface Tenant {
  id: number;
  nombre: string;
  apellido: string;
  rut: string;
  telefono: string;
  correo: string;
  departamento: string;
  estado: string;
}

interface Department {
  id: number;
  numero: string;
  torre: string;
  estado: string;
  inquilino: string;
}

interface StaffPerson {
  id: number;
  nombre: string;
  rut: string;
  telefono: string;
  extra: string;
  estado: string;
}

interface VisitLog {
  id: number;
  nombre: string;
  tipo: string;
  ingreso: string;
  salida: string;
  estado: string;
}

const initialTenants: Tenant[] = [
  { id: 1, nombre: 'María', apellido: 'Rojas', rut: '12.345.678-9', telefono: '+56 9 8123 4567', correo: 'mrojas@mail.com', departamento: '405 B', estado: 'Activo' },
  { id: 2, nombre: 'Jorge', apellido: 'Salas', rut: '11.111.111-1', telefono: '+56 9 7654 3210', correo: 'jsalas@mail.com', departamento: '201 A', estado: 'Activo' },
  { id: 3, nombre: 'Ana', apellido: 'López', rut: '10.222.333-4', telefono: '+56 9 9955 2244', correo: 'alopez@mail.com', departamento: '307 C', estado: 'Suspendido' }
];

const initialDepartments: Department[] = [
  { id: 1, numero: '101', torre: 'Norte', estado: 'Ocupado', inquilino: 'Jorge Salas' },
  { id: 2, numero: '405', torre: 'Sur', estado: 'Ocupado', inquilino: 'María Rojas' },
  { id: 3, numero: '302', torre: 'Este', estado: 'Disponible', inquilino: '-' }
];

const initialGuards: StaffPerson[] = [
  { id: 1, nombre: 'Carlos Pérez', rut: '15.123.456-7', telefono: '+56 9 6321 1234', extra: 'Turno Noche', estado: 'Activo' },
  { id: 2, nombre: 'Lucía Gómez', rut: '16.987.654-3', telefono: '+56 9 7123 9876', extra: 'Turno Día', estado: 'Activo' }
];

const initialEmployees: StaffPerson[] = [
  { id: 1, nombre: 'Patricio Vega', rut: '18.321.654-2', telefono: '+56 9 8122 3322', extra: 'Recepción', estado: 'Activo' },
  { id: 2, nombre: 'Carolina Silva', rut: '19.876.543-1', telefono: '+56 9 6544 9988', extra: 'Administración', estado: 'Activo' }
];

const initialSubcontractors: StaffPerson[] = [
  { id: 1, nombre: 'Igor Castillo', rut: '20.111.222-3', telefono: '+56 9 9876 5432', extra: 'Electricista', estado: 'En turno' },
  { id: 2, nombre: 'Renata Suárez', rut: '21.222.333-4', telefono: '+56 9 7788 6655', extra: 'Jardinería', estado: 'Fuera' }
];

const initialVisits: VisitLog[] = [
  { id: 1, nombre: 'Carmen Díaz', tipo: 'Visita', ingreso: '09:10', salida: '-', estado: 'Dentro' },
  { id: 2, nombre: 'Marco Silva', tipo: 'Delivery', ingreso: '10:35', salida: '10:50', estado: 'Fuera' }
];

const initialPackages: VisitLog[] = [
  { id: 1, nombre: 'Paquete DHL', tipo: 'Paquete', ingreso: '11:05', salida: '-', estado: 'Pendiente' },
  { id: 2, nombre: 'Encomienda', tipo: 'Paquete', ingreso: '10:15', salida: '11:00', estado: 'Entregado' }
];

const initialUsers = [
  { id: 1, nombre: 'Administrador', correo: 'admin@condo.com', rol: 'Administrador' },
  { id: 2, nombre: 'Guardia 1', correo: 'guardia1@condo.com', rol: 'Guardia' }
];

const statistics = [
  { label: 'Personas dentro', value: '24', icon: 'fa-person', color: '#2563eb' },
  { label: 'Guardias en turno', value: '5', icon: 'fa-user-shield', color: '#1d4ed8' },
  { label: 'Inquilinos registrados', value: '86', icon: 'fa-house-chimney', color: '#3b82f6' },
  { label: 'Empleados registrados', value: '18', icon: 'fa-briefcase', color: '#22c55e' },
  { label: 'Subcontratistas', value: '12', icon: 'fa-hands-helping', color: '#0ea5e9' },
  { label: 'Visitas del día', value: '14', icon: 'fa-user-check', color: '#7c3aed' },
  { label: 'Paquetes pendientes', value: '9', icon: 'fa-box-open', color: '#f97316' },
  { label: 'Novedades registradas', value: '6', icon: 'fa-exclamation-triangle', color: '#ef4444' }
];

function App() {
  const [username, setUsername] = useState('Gabriel Silva');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'error' | 'success' | 'loading'>('idle');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<MenuKey>('Dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [tenantSearch, setTenantSearch] = useState('');
  const [tenants, setTenants] = useState<Tenant[]>(initialTenants);
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [guards] = useState<StaffPerson[]>(initialGuards);
  const [employees] = useState<StaffPerson[]>(initialEmployees);
  const [subcontractors] = useState<StaffPerson[]>(initialSubcontractors);
  const [visits] = useState<VisitLog[]>(initialVisits);
  const [packages] = useState<VisitLog[]>(initialPackages);
  const [tenantForm, setTenantForm] = useState({ nombre: '', apellido: '', rut: '', telefono: '', correo: '', departamento: '' });
  const [departmentForm, setDepartmentForm] = useState({ numero: '', torre: '', estado: 'Disponible', inquilino: '' });
  const [tenantAssign, setTenantAssign] = useState({ nombre: '', departamento: '' });

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setMessage('');
    setStatus('idle');
    setSelectedMenu('Dashboard');
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = currentTime.toLocaleTimeString('es-CL');
  const userRole = 'Administrador';

  const filteredTenants = useMemo(
    () => tenants.filter((tenant) => {
      const query = tenantSearch.toLowerCase();
      return (
        tenant.nombre.toLowerCase().includes(query) ||
        tenant.apellido.toLowerCase().includes(query) ||
        tenant.rut.toLowerCase().includes(query) ||
        tenant.departamento.toLowerCase().includes(query)
      );
    }),
    [tenantSearch, tenants]
  );

  const handleLoginSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      setMessage('Por favor completa ambos campos.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setMessage('');

    window.setTimeout(() => {
      setIsAuthenticated(true);
      setStatus('success');
      setMessage('');
    }, 800);
  };

  const handleDeleteTenant = (id: number) => {
    const tenant = tenants.find((item) => item.id === id);
    if (!tenant) return;
    if (window.confirm(`¿Eliminar a ${tenant.nombre} ${tenant.apellido}?`)) {
      setTenants(tenants.filter((item) => item.id !== id));
    }
  };

  const handleDeleteDepartment = (id: number) => {
    const department = departments.find((item) => item.id === id);
    if (!department) return;
    if (window.confirm(`¿Eliminar departamento ${department.numero}?`)) {
      setDepartments(departments.filter((item) => item.id !== id));
    }
  };

  const handleAddTenant = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextId = tenants.length ? Math.max(...tenants.map((tenant) => tenant.id)) + 1 : 1;
    setTenants([{ id: nextId, estado: 'Activo', ...tenantForm }, ...tenants]);
    setTenantForm({ nombre: '', apellido: '', rut: '', telefono: '', correo: '', departamento: '' });
    window.alert('Inquilino agregado correctamente.');
  };

  const handleAddDepartment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextId = departments.length ? Math.max(...departments.map((item) => item.id)) + 1 : 1;
    setDepartments([{ id: nextId, ...departmentForm }, ...departments]);
    setDepartmentForm({ numero: '', torre: '', estado: 'Disponible', inquilino: '' });
    window.alert('Departamento registrado correctamente.');
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case 'Dashboard':
        return (
          <>
            <div className="dashboard-grid">
              {statistics.map((stat) => (
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
              <p>Visión rápida de operaciones del edificio, niveles de ocupación y actividades del día.</p>
              <div className="panel-grid">
                <div className="panel-stat">
                  <span>Paquetes pendientes</span>
                  <strong>9</strong>
                </div>
                <div className="panel-stat">
                  <span>Visitas activas</span>
                  <strong>3</strong>
                </div>
                <div className="panel-stat">
                  <span>Guardias en turno</span>
                  <strong>5</strong>
                </div>
                <div className="panel-stat">
                  <span>Novedades recientes</span>
                  <strong>6</strong>
                </div>
              </div>
            </div>
          </>
        );

      case 'Gestión de Inquilinos':
        return (
          <>
            <section className="section-panel">
              <div className="section-header">
                <div>
                  <h3>Gestión de Inquilinos</h3>
                  <p>Agregar, modificar, eliminar y buscar inquilinos.</p>
                </div>
                <div className="chip success"><i className="fa-solid fa-user-check"></i> Activos</div>
              </div>
              <form className="search-row" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="search"
                  placeholder="Buscar por nombre, rut o departamento"
                  value={tenantSearch}
                  onChange={(event) => setTenantSearch(event.target.value)}
                />
                <button className="secondary-button" onClick={() => setTenantSearch('')}>
                  <i className="fa-solid fa-xmark"></i> Limpiar
                </button>
              </form>
            </section>
            <section className="section-panel grid-two">
              <div className="panel-card">
                <h4>Agregar Inquilino</h4>
                <form onSubmit={handleAddTenant} className="submit-form">
                  <div className="form-row">
                    <input placeholder="Nombre" value={tenantForm.nombre} onChange={(e) => setTenantForm({ ...tenantForm, nombre: e.target.value })} />
                    <input placeholder="Apellido" value={tenantForm.apellido} onChange={(e) => setTenantForm({ ...tenantForm, apellido: e.target.value })} />
                  </div>
                  <div className="form-row">
                    <input placeholder="RUT" value={tenantForm.rut} onChange={(e) => setTenantForm({ ...tenantForm, rut: e.target.value })} />
                    <input placeholder="Teléfono" value={tenantForm.telefono} onChange={(e) => setTenantForm({ ...tenantForm, telefono: e.target.value })} />
                  </div>
                  <div className="form-row">
                    <input placeholder="Correo" value={tenantForm.correo} onChange={(e) => setTenantForm({ ...tenantForm, correo: e.target.value })} />
                    <input placeholder="Departamento" value={tenantForm.departamento} onChange={(e) => setTenantForm({ ...tenantForm, departamento: e.target.value })} />
                  </div>
                  <button type="submit" className="primary-button"><i className="fa-solid fa-user-plus"></i> Guardar</button>
                </form>
              </div>
              <div className="panel-card table-section">
                <h4>Listado completo</h4>
                <div className="table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>RUT</th>
                        <th>Teléfono</th>
                        <th>Correo</th>
                        <th>Departamento</th>
                        <th>Estado</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTenants.map((tenant) => (
                        <tr key={tenant.id}>
                          <td>{tenant.nombre} {tenant.apellido}</td>
                          <td>{tenant.rut}</td>
                          <td>{tenant.telefono}</td>
                          <td>{tenant.correo}</td>
                          <td>{tenant.departamento}</td>
                          <td>{tenant.estado}</td>
                          <td>
                            <button className="table-button">
                              <i className="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button className="table-button delete" onClick={() => handleDeleteTenant(tenant.id)}>
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </>
        );

      case 'Gestión de Departamentos':
        return (
          <>
            <section className="section-panel">
              <div className="section-header">
                <div>
                  <h3>Gestión de Departamentos</h3>
                  <p>Registrar, modificar, eliminar y ver ocupación.</p>
                </div>
                <div className="chip info"><i className="fa-solid fa-building"></i> Ocupación</div>
              </div>
            </section>
            <section className="section-panel grid-two">
              <div className="panel-card">
                <h4>Registrar Departamento</h4>
                <form onSubmit={handleAddDepartment} className="submit-form">
                  <div className="form-row">
                    <input placeholder="Número" value={departmentForm.numero} onChange={(e) => setDepartmentForm({ ...departmentForm, numero: e.target.value })} />
                    <input placeholder="Torre" value={departmentForm.torre} onChange={(e) => setDepartmentForm({ ...departmentForm, torre: e.target.value })} />
                  </div>
                  <div className="form-row">
                    <input placeholder="Estado" value={departmentForm.estado} onChange={(e) => setDepartmentForm({ ...departmentForm, estado: e.target.value })} />
                    <input placeholder="Inquilino asignado" value={departmentForm.inquilino} onChange={(e) => setDepartmentForm({ ...departmentForm, inquilino: e.target.value })} />
                  </div>
                  <button type="submit" className="primary-button"><i className="fa-solid fa-plus"></i> Registrar</button>
                </form>
              </div>
              <div className="panel-card table-section">
                <h4>Ocupación actual</h4>
                <div className="table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Depto</th>
                        <th>Torre</th>
                        <th>Estado</th>
                        <th>Inquilino</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departments.map((department) => (
                        <tr key={department.id}>
                          <td>{department.numero}</td>
                          <td>{department.torre}</td>
                          <td>{department.estado}</td>
                          <td>{department.inquilino || '-'}</td>
                          <td>
                            <button className="table-button">
                              <i className="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button className="table-button delete" onClick={() => handleDeleteDepartment(department.id)}>
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </>
        );

      case 'Asignación de Inquilinos':
        return (
          <div className="panel-card">
            <h3>Asignación de Inquilinos</h3>
            <p>Asigna, cambia o libera departamentos.</p>
            <form className="submit-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-row">
                <input placeholder="Nombre del inquilino" value={tenantAssign.nombre} onChange={(e) => setTenantAssign({ ...tenantAssign, nombre: e.target.value })} />
                <input placeholder="Departamento" value={tenantAssign.departamento} onChange={(e) => setTenantAssign({ ...tenantAssign, departamento: e.target.value })} />
              </div>
              <div className="form-row">
                <button className="primary-button"><i className="fa-solid fa-person-circle-minus"></i> Cambiar de departamento</button>
                <button className="secondary-button"><i className="fa-solid fa-right-from-bracket"></i> Liberar departamento</button>
              </div>
            </form>
          </div>
        );

      case 'Gestión de Guardias':
        return (
          <div className="panel-card table-section">
            <h3>Gestión de Guardias</h3>
            <p>Agregar, editar, eliminar y ver guardias en el sistema.</p>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Rut</th>
                    <th>Teléfono</th>
                    <th>Turno</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {guards.map((guard) => (
                    <tr key={guard.id}>
                      <td>{guard.nombre}</td>
                      <td>{guard.rut}</td>
                      <td>{guard.telefono}</td>
                      <td>{guard.extra}</td>
                      <td>{guard.estado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'Gestión de Empleados':
        return (
          <div className="panel-card table-section">
            <h3>Gestión de Empleados</h3>
            <p>Busca y administra todos los empleados registrados.</p>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Rut</th>
                    <th>Teléfono</th>
                    <th>Área</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id}>
                      <td>{employee.nombre}</td>
                      <td>{employee.rut}</td>
                      <td>{employee.telefono}</td>
                      <td>{employee.extra}</td>
                      <td>{employee.estado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'Gestión de Subcontratistas':
        return (
          <div className="panel-card table-section">
            <h3>Gestión de Subcontratistas</h3>
            <p>Registra, edita y consulta subcontratistas del edificio.</p>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Rut</th>
                    <th>Teléfono</th>
                    <th>Especialidad</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {subcontractors.map((sub) => (
                    <tr key={sub.id}>
                      <td>{sub.nombre}</td>
                      <td>{sub.rut}</td>
                      <td>{sub.telefono}</td>
                      <td>{sub.extra}</td>
                      <td>{sub.estado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'Registro de Novedades':
        return (
          <div className="panel-card">
            <h3>Registro de Novedades</h3>
            <p>Registro exclusivo para guardias. Visualiza el historial y registra nuevas novedades.</p>
            <div className="panel-grid">
              <div className="panel-stat">
                <span>Novedades hoy</span>
                <strong>6</strong>
              </div>
              <div className="panel-stat">
                <span>Prioridad alta</span>
                <strong>2</strong>
              </div>
            </div>
          </div>
        );

      case 'Bitácora Diaria':
        return (
          <div className="panel-card">
            <h3>Bitácora Diaria</h3>
            <p>Registra las actividades realizadas durante el turno.</p>
            <div className="panel-grid">
              <div className="panel-stat">
                <span>Entradas</span>
                <strong>8</strong>
              </div>
              <div className="panel-stat">
                <span>Observaciones</span>
                <strong>5</strong>
              </div>
            </div>
          </div>
        );

      case 'Registro de Turnos':
        return (
          <div className="panel-card table-section">
            <h3>Registro de Turnos</h3>
            <p>Inicia y finaliza turnos con registro de ingreso y salida.</p>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Guardia</th>
                    <th>Ingreso</th>
                    <th>Salida</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Carlos Pérez</td>
                    <td>07:00</td>
                    <td>15:00</td>
                    <td>Finalizado</td>
                  </tr>
                  <tr>
                    <td>Lucía Gómez</td>
                    <td>15:00</td>
                    <td>-</td>
                    <td>Activo</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'Registro de Ingresos y Salidas':
        return (
          <div className="panel-card table-section">
            <h3>Registro de Ingresos y Salidas</h3>
            <p>Monitorea en tiempo real quién está dentro del edificio.</p>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Tipo</th>
                    <th>Ingreso</th>
                    <th>Salida</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Ana López</td>
                    <td>Inquilino</td>
                    <td>08:30</td>
                    <td>-</td>
                    <td>Dentro</td>
                  </tr>
                  <tr>
                    <td>Igor Castillo</td>
                    <td>Subcontratista</td>
                    <td>09:00</td>
                    <td>17:00</td>
                    <td>Fuera</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'Solicitud de Implementos':
        return (
          <div className="panel-card">
            <h3>Solicitud de Implementos</h3>
            <p>Solicita linternas, llaves, uniformes, radios u otros implementos.</p>
            <div className="panel-grid">
              <div className="panel-stat">
                <span>Solicitudes pendientes</span>
                <strong>4</strong>
              </div>
              <div className="panel-stat">
                <span>Solicitudes completadas</span>
                <strong>12</strong>
              </div>
            </div>
          </div>
        );

      case 'Registro de Visitas':
        return (
          <div className="panel-card table-section">
            <h3>Registro de Visitas</h3>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Visitante</th>
                    <th>Rut</th>
                    <th>Departamento</th>
                    <th>Ingreso</th>
                    <th>Salida</th>
                  </tr>
                </thead>
                <tbody>
                  {visits.map((visit) => (
                    <tr key={visit.id}>
                      <td>{visit.nombre}</td>
                      <td>{visit.tipo}</td>
                      <td>{visit.ingreso}</td>
                      <td>{visit.salida}</td>
                      <td>{visit.estado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'Registro de Paquetes':
        return (
          <div className="panel-card table-section">
            <h3>Registro de Paquetes</h3>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Destinatario</th>
                    <th>Empresa</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((pack) => (
                    <tr key={pack.id}>
                      <td>{pack.nombre}</td>
                      <td>{pack.tipo}</td>
                      <td>{pack.ingreso}</td>
                      <td>{pack.salida}</td>
                      <td>{pack.estado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'Usuarios del Sistema':
        return (
          <div className="panel-card table-section">
            <h3>Usuarios del Sistema</h3>
            <p>Gestiona los usuarios del sistema y asigna roles.</p>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Rol</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {initialUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.nombre}</td>
                      <td>{user.correo}</td>
                      <td>{user.rol}</td>
                      <td>
                        <button className="table-button"><i className="fa-solid fa-pen-to-square"></i></button>
                        <button className="table-button delete"><i className="fa-solid fa-trash"></i></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'Reportes':
        return (
          <div className="panel-card reports-panel">
            <h3>Reportes</h3>
            <div className="report-cards">
              <div className="report-card"><p>Novedades por mes</p></div>
              <div className="report-card"><p>Visitas por día</p></div>
              <div className="report-card"><p>Personas dentro</p></div>
              <div className="report-card"><p>Solicitudes de implementos</p></div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="page-shell">
        <section className="login-card animate-fade-in">
          <div className="brand">
            <div className="brand-mark">CM</div>
            <div>
              <h1>CondoManage</h1>
              <p>Gestión de condominios y servicios profesionales</p>
            </div>
          </div>

          <form className="login-form" onSubmit={handleLoginSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="username">Usuario</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Ingresa tu usuario"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Ingresa tu contraseña"
              />
            </div>

            <button type="submit" className="primary-button" disabled={status === 'loading'}>
              {status === 'loading' ? 'Ingresando...' : 'Iniciar sesión'}
            </button>

            <p className={`form-message ${status === 'error' ? 'error' : status === 'success' ? 'success' : ''}`}>
              {message}
            </p>
          </form>
        </section>
      </div>
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
