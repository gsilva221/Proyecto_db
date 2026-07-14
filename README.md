# CondoManage Frontend

## 🌟 DESCRIPCIÓN DEL PROYECTO

Este repositorio contiene la interfaz de usuario de CondoManage, el sistema de control de visitas para condominios. El frontend digitaliza el registro manual de libros de actas en la conserjería y ofrece una experiencia de administración moderna y reactiva.

Objetivos principales:
- Proveer una interfaz clara y consistente para la gestión de visitas.
- Conectar en tiempo real con el backend para registros de ingreso y salida.
- Minimizar el uso de papel y errores de datos manuales.
- Permitir al conserje controlar visitantes y actualizaciones de forma eficiente.

---

## 🛠️ STACK TECNOLÓGICO

| Capa | Tecnología | Justificación | Beneficio |
|---|---|---|---|
| Frontend | React + TypeScript + Vite | UI moderna, desempeño rápido y tipado estático. | Desarrollo seguro, recarga instantánea y mantenibilidad. |
| Backend | Node.js + Express | API REST estándar de alta compatibilidad. | Backend ligero y fácil de integrar. |
| Base de datos | MongoDB Atlas | Persistencia documental para visitas. | Escala automática y sin infraestructura física. |
| Despliegue | Vercel | Despliegues estáticos y serverless optimizados para React. | CI/CD sencillo y previews automáticos. |

---

## 📁 ESTRUCTURA DEL REPOSITORIO FRONTEND

```text
Proyecto_db/
  ├─ public/
  ├─ src/
  │   ├─ assets/
  │   ├─ components/
  │   │   ├─ Login.tsx
  │   │   ├─ Register.tsx
  │   │   ├─ RegistroVisitas.tsx
  │   ├─ services/
  │   │   ├─ api.js
  │   │   ├─ visitaService.js
  │   ├─ App.tsx
  │   ├─ main.tsx
  │   ├─ index.css
  │   └─ App.css
  ├─ package.json
  ├─ tsconfig.json
  ├─ tsconfig.app.json
  ├─ tsconfig.node.json
  ├─ vite.config.ts
  └─ README.md
```

---

## ⚙️ INSTALACIÓN Y CONFIGURACIÓN LOCAL

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPO_FRONTEND>
cd Proyecto_db
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Variables de entorno

Crea un archivo `.env` en esta carpeta con el siguiente contenido:

```env
VITE_API_URL=http://localhost:4000/api
```

### 4. Levantar el servidor en local

```bash
npm run dev
```

El frontend usará `VITE_API_URL` para conectarse al backend y consumir la API de visitas.

---

## 🗄️ MODELADO DE DATOS (NoSQL)

Aunque este repositorio no contiene el modelo Mongoose, el frontend consume la colección `visitas` y espera la siguiente estructura JSON:

- `nombre`: String.
- `rut`: String.
- `departamento`: String.
- `motivo`: String.
- `fechaIngreso`: Date en formato ISO.
- `fechaSalida`: Date en formato ISO.

#### Ejemplo de objeto recibido

```json
{
  "nombre": "María Pérez",
  "rut": "12.345.678-9",
  "departamento": "A-403",
  "motivo": "Entrega de paquete",
  "fechaIngreso": "2026-07-14T09:25:00.000Z",
  "fechaSalida": "2026-07-14T09:42:00.000Z"
}
```

---

## 🔌 API ENDPOINTS UTILIZADOS

| Método | Ruta | Uso en el frontend |
|---|---|---|
| GET | `/api/visitas` | Obtener listado de visitas.
| POST | `/api/visitas` | Crear una nueva visita.
| PUT | `/api/visitas/:id` | Actualizar los datos de una visita.
| DELETE | `/api/visitas/:id` | Eliminar un registro de visita.

---

## 🐙 ESTRATEGIA DE RAMAS Y DEPLOYMENT (CI/CD)

### Flujo de trabajo con Git

1. Trabaja desde la rama estable `main`.
2. Crea ramas temporales de desarrollo:

```bash
git checkout -b prueba-edicion
```

3. Testea cambios localmente y con Preview Deployments.
4. Fusiona a `main` solo cuando el frontend esté validado.

```bash
git checkout main
git merge prueba-edicion
```

5. Elimina la rama de prueba:

```bash
git branch -d prueba-edicion
```

### Placeholders de despliegue

- Frontend (Vercel): `https://<TU_APP_CONDOMANAGE>.vercel.app`
- Backend (Render): `https://<TU_API_CONDOMANAGE>.onrender.com`

---

## 📌 Notas

Este README documenta el repositorio del frontend de CondoManage. Para detalles del backend, revisa el repo correspondiente y su README específico.
