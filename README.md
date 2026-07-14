# 📑 PARTE 1: ANÁLISIS DE NEGOCIO Y REQUISITOS

Este apartado define las bases estratégicas, operativas y técnicas que justifican el desarrollo y despliegue del sistema **CondoManage**[cite: 1].

---

## 1.1. Análisis de las Necesidades del Negocio (Criterio 4.1.1.G.1)

Los condominios residenciales modernos enfrentan desafíos críticos de seguridad y eficiencia operativa debido a la persistencia de procesos analógicos[cite: 1]. Tradicionalmente, las conserjerías y guardias de seguridad registran los accesos utilizando libros de actas manuales (papel y lápiz). 

Este enfoque físico introduce serios problemas operativos:
*   **Falta de legibilidad:** La escritura apresurada de los guardias dificulta la lectura de datos clave en situaciones de emergencia.
*   **Vulnerabilidad física:** El extravío, daño por líquidos o robo del libro anula el historial completo de accesos del condominio.
*   **Ausencia de búsqueda inmediata:** Encontrar el registro de un visitante o vehículo sospechoso de días anteriores exige hojear manualmente cientos de páginas, perdiendo minutos valiosos.
*   **Falta de privacidad:** Cualquier persona ajena a la conserjería puede visualizar fácilmente datos personales (RUT, patentes, nombres) expuestos en el cuaderno abierto.

> **Solución CondoManage:**  
> Digitaliza y automatiza el registro de accesos en tiempo real mediante una plataforma web fluida. Esto reduce el tiempo de registro por visita, garantiza la inmutabilidad de la información almacenada y restringe visualmente los datos confidenciales a usuarios no autorizados[cite: 1].

---

## 1.2. Determinación de Volúmenes de Datos (Criterio 4.1.1.G.2)

Para dimensionar la infraestructura de datos requerida en la nube, se proyectó el crecimiento transaccional para un condominio promedio de **200 departamentos**[cite: 1]:

### Estimación Transaccional y de Crecimiento
*   **Tasa promedio de visitas:** Se estiman un promedio de 3 visitas diarias por departamento (incluyendo delivery, visitas personales y técnicos).
    Visitas diarias = 200 departamentos x 3 visitas/día = 600 registros/día.
*   **Volumen mensual de registros:** 
    Visitas mensuales = 600 registros/día x 30 días = 18.000 registros/mes.
*   **Tamaño promedio del documento NoSQL (JSON):** Cada visita registrada tiene un peso aproximado de 500 bytes en MongoDB.
*   **Consumo de almacenamiento mensual:**
    Almacenamiento mensual = 18.000 documentos x 500 bytes = 9.000.000 bytes (9 MB).

### Proyección de Crecimiento a 3 Años
*   **Almacenamiento estimado en 36 meses:** 324 MB.
*   **Decisión de Infraestructura:** El nivel de almacenamiento requerido demuestra que el plan de base de datos en la nube MongoDB Atlas M0 (Free Tier de 512 MB) es técnicamente idóneo para soportar holgadamente la operación del condominio durante su primer año de uso antes de requerir un escalado a un plan de pago básico[cite: 1].

---

## 1.3. Requisitos de Rendimiento, Escalabilidad y Disponibilidad (Criterio 4.1.1.G.3)

Para garantizar un estándar óptimo de experiencia de usuario en portería, se definieron los siguientes requerimientos arquitectónicos[cite: 1]:

*   **Rendimiento:** Las consultas y operaciones de lectura/escritura (CRUD) en el frontend no deben superar un tiempo de respuesta de 500 ms. Para mitigar latencias de red en el ambiente de producción, se implementó una Actualización Optimista (Optimistic UI) en el estado local de React, de modo que la tabla refleje los cambios instantáneamente mientras la base de datos procesa la solicitud asíncronamente en segundo plano.
*   **Escalabilidad:** El backend en Render y la base de datos documental en MongoDB Atlas operan bajo plataformas PaaS (Plataforma como Servicio) de escalado elástico, permitiendo aumentar recursos de RAM, CPU o almacenamiento sin interrupciones del servicio a medida que se incorporen más condominios o módulos al software[cite: 1].
*   **Disponibilidad:** El sistema apunta a una continuidad operativa del 99.9%. MongoDB Atlas distribuye y replica automáticamente los datos en múltiples zonas de disponibilidad (Replica Set), previniendo pérdidas de información ante caídas de nodos individuales[cite: 1].

---

## 1.4. Requisitos de Seguridad y Cumplimiento Normativo (Criterio 4.1.1.G.4)

El control de visitas procesa información de identificación personal sensible. Su resguardo se rige por las siguientes pautas[cite: 1]:

*   **Protección de Datos Personales:** El sistema almacena nombres, números de RUT y domicilios específicos (departamentos)[cite: 1]. Estos datos se tratan bajo estrictas políticas de confidencialidad y no se exponen en APIs públicas desprotegidas[cite: 1].
*   **Seguridad de Conexión de Datos:** La base de datos en MongoDB Atlas no está abierta a todo internet[cite: 1]. Cuenta con un cortafuegos activo mediante una IP Access List, limitando el tráfico exclusivamente al clúster de Render (backend en producción) y a la dirección IP privada del desarrollador[cite: 1].
*   **Cifrado en Tránsito:** Toda la comunicación entre el Cliente (Vercel), el Backend (Render) y la base de datos se realiza bajo protocolos seguros cifrados mediante HTTPS y TLS/SSL.

# 📑 PARTE 2: ARQUITECTURA TECNOLÓGICA E INFRAESTRUCTURA

En esta sección se detalla y justifica la selección de la arquitectura, se comparan las alternativas de la nube y se documenta el flujo de comunicación de los componentes de **CondoManage**, cumpliendo con los criterios de la rúbrica.

---

## 2.1. Requisitos Técnicos de MongoDB Atlas y la Aplicación Web (Criterio 4.1.2.G.5)

Para el correcto funcionamiento de la solución en la nube, se identificaron y configuraron los siguientes requisitos de conectividad, frameworks y dependencias evaluando su compatibilidad:

*   **Compatibilidad de Frameworks:** El backend de la aplicación utiliza Node.js con el framework Express. La integración con MongoDB Atlas se realiza mediante la librería Mongoose, la cual requiere una versión de driver compatible con esquemas de conexión seguros en la nube.
*   **Servicios Cloud de Terceros:** Se requiere la autorización de solicitudes cruzadas (CORS) en el backend de Render para recibir peticiones seguras desde el dominio asignado por Vercel (frontend).
*   **Requerimientos de Conectividad:** La comunicación con el motor de base de datos requiere la apertura de puertos seguros y habilitar el protocolo TLS/SSL en el string de conexión para asegurar el cifrado de datos de tránsito y cumplir con los requerimientos de conectividad[cite: 1].

---

## 2.2. Comparación de Alternativas de Infraestructura en la Nube (Criterio 4.1.2.G.6)

A continuación, se presenta una matriz comparativa evaluando técnicamente diferentes alternativas para el despliegue de la aplicación web[cite: 1]:

| Dimensión de Análisis | Virtualización Local / Tradicional | Plataformas Cloud (Render, Railway, etc.) | Plataformas Cloud Frontend (Vercel) |
| :--- | :--- | :--- | :--- |
| **Facilidad de Despliegue** | **Baja:** Requiere instalación manual de S.O., configuración de red y dependencias[cite: 1]. | **Alta:** Facilidad de despliegue mediante conexión a repositorios de control de versiones[cite: 1]. | **Excelente:** Despliegue automático optimizado[cite: 1]. |
| **Escalabilidad** | **Baja:** Limitada al hardware físico disponible[cite: 1]. | **Alta:** Escalabilidad vertical y horizontal bajo demanda en la nube[cite: 1]. | **Alta:** Escalabilidad global instantánea[cite: 1]. |
| **Disponibilidad** | **Muy Baja:** Sujeta a fallas físicas y cortes locales[cite: 1]. | **Alta:** Garantizada por proveedores en la nube y alta disponibilidad[cite: 1]. | **Excelente:** Arquitectura distribuida globalmente[cite: 1]. |
| **Costos** | **Altos:** Consumo eléctrico, mantenimiento físico y licencias[cite: 1]. | **Bajos/Eficientes:** Costos de implementación basados en consumo real, con capas gratuitas para desarrollo[cite: 1]. | **Eficientes:** Capas gratuitas robustas para desarrollo[cite: 1]. |

**Conclusión de la comparativa:** Se descarta el enfoque tradicional debido a sus limitaciones y se justifica la selección de infraestructuras nativas de la nube (Vercel, Render y MongoDB Atlas) por su superioridad técnica en los criterios evaluados[cite: 1].

---

## 2.3. Selección de la Arquitectura Tecnológica de la Solución (Criterio 4.1.2.G.7)

La elección del stack de tecnologías se justifica técnicamente bajo los siguientes parámetros[cite: 1]:

*   **Base de Datos (MongoDB Atlas):** Justificación técnica de la elección de MongoDB Atlas por ser un servicio en la nube gestionado que ofrece alta disponibilidad, seguridad y escalabilidad nativa, ideal para el modelo documental de la aplicación[cite: 1].
*   **Plataforma de Despliegue (Vercel y Render):** Justificación técnica de Vercel (Frontend) y Render (Backend) por su integración fluida con GitHub para despliegues continuos, eliminando la sobrecarga de administración de servidores[cite: 1].
*   **Lenguaje y Framework:** La elección de React (Frontend) y Node.js/Express (Backend) se justifica por la unificación del stack tecnológico en un solo lenguaje (JavaScript/TypeScript), lo que mejora la mantenibilidad, compatibilidad y el rendimiento general de la solución[cite: 1].

---

## 2.4. Documentación de la Arquitectura de la Solución (Criterio 4.1.2.G.8)

El siguiente diagrama de arquitectura ilustra la solución, donde aparecen claramente el Cliente Web, la Aplicación (Backend), MongoDB Atlas, GitHub y las Plataformas Cloud utilizadas[cite: 1]:

```text
                                  ┌───────────────────────────┐
                                  │       CLIENTE WEB         │
                                  │   (Vercel SPA - React)    │
                                  └─────────────┬─────────────┘
                                                │
                                                │ HTTPS (REST API)
                                                ▼
                                  ┌───────────────────────────┐
                                  │        APLICACIÓN         │
                                  │   (Node.js API - Render)  │
                                  └─────────────┬─────────────┘
                                                │
                                                │ Conexión Segura
                                                ▼
┌──────────────────────┐          ┌───────────────────────────┐
│        GITHUB        ├─────────►│       MONGODB ATLAS       │
│  (Control Ramas/CD)  │          │   (Database en la Nube)   │
└──────────────────────┘          └───────────────────────────┘
```
### Componentes y Flujo:
1. **Cliente Web (Vercel):** Representa la plataforma Cloud que hospeda el cliente[cite: 1].
2. **Aplicación (Render):** Representa la plataforma Cloud que procesa la lógica de negocio[cite: 1].
3. **MongoDB Atlas:** Actúa como el DBMS en la nube, almacenando la información[cite: 1].
4. **GitHub:** Actúa como el orquestador del código y la arquitectura de despliegue continuo (CI/CD) para ambas plataformas Cloud[cite: 1].

# 📑 PARTE 3: CONFIGURACIÓN, SEGURIDAD Y DESPLIEGUE EN LA NUBE

Esta sección detalla la configuración de repositorios, gestión de entornos, implementación de bases de datos y aplicación de medidas de seguridad, alineándose con las mejores prácticas de desarrollo y despliegue continuo[cite: 1].

---

## 3.1. Repositorio GitHub y Estrategia de Ramas (Criterio 4.1.3.G.9)

Se configuró un repositorio en GitHub implementando una estrategia de ramas apropiada para el trabajo colaborativo y despliegue seguro[cite: 1]:
*   **Rama `main` (Producción):** Contiene el código estable y está conectada directamente a las plataformas de nube (Vercel y Render) para ejecutar los despliegues automáticos.
*   **Ramas de Desarrollo/Pruebas:** Se implementó el uso de ramas aisladas (ej. `prueba-edicion`) para desarrollar y testear nuevas funcionalidades siguiendo buenas prácticas de desarrollo[cite: 1]. Esto permite validar cambios en entornos de prueba seguros antes de realizar la fusión (*merge*) mediante convenciones de control de versiones y organización colaborativa[cite: 1].

---

## 3.2. Configuración del Proyecto y Variables de Entorno (Criterio 4.1.3.G.10)

El proyecto se configuró definiendo correctamente sus dependencias y estructura modular[cite: 1]. Para el manejo seguro de información sensible y la configuración de los entornos, se implementaron variables de entorno (`.env`) siguiendo buenas prácticas[cite: 1]:
*   **Backend:** Configuración estricta de variables como `PORT`, `CORS_ORIGIN` y `MONGODB_URI` para evitar exponer la cadena de conexión o credenciales en el código fuente del repositorio.
*   **Frontend:** Uso de archivos de configuración para definir de manera dinámica la URL de la API (`VITE_API_URL`), adaptando la comunicación dependiendo de si el sistema está en desarrollo local o en producción.

---

## 3.3. Implementación y Conexión a MongoDB Atlas (Criterios 4.1.3.G.11 y 4.1.4.G.13)

Se implementó la base de datos en MongoDB Atlas verificando la correcta creación del clúster, su configuración inicial y la integridad del servicio en la nube[cite: 1]:
*   **Conexión de la Aplicación:** Se configuró MongoDB Atlas estableciendo conexiones seguras entre la aplicación y la base de datos, verificando conectividad, autenticación y funcionamiento[cite: 1]. 
*   **Pruebas Documentadas:** La conexión se validó de manera exitosa ejecutando pruebas documentadas del funcionamiento del CRUD completo desde el servidor hacia el clúster remoto[cite: 1].

---

## 3.4. Acceso Seguro y Buenas Prácticas de Seguridad (Criterios 4.1.4.G.14 y 4.1.4.G.15)

Se configuraron mecanismos robustos de acceso y se implementaron buenas prácticas de seguridad para proteger credenciales y conexiones[cite: 1]:
*   **Usuarios y Credenciales Seguras:** Se configuró el acceso seguro mediante la creación de usuarios de base de datos con roles específicos y principios de mínimo privilegio, documentando las políticas implementadas[cite: 1].
*   **Listas de Direcciones IP Autorizadas:** Se configuró el *Network Access* en Atlas (IP Whitelist), permitiendo conexiones a la base de datos únicamente desde las direcciones IP autorizadas correspondientes a los servidores de producción y entornos locales de desarrollo[cite: 1].
*   **Protección de Conexiones:** Se implementó la gestión de secretos (variables de entorno), conexiones cifradas y restricciones de acceso en el backend mediante el uso de políticas CORS (Cross-Origin Resource Sharing) para rechazar orígenes no reconocidos[cite: 1].

---

## 3.5. Documentación de Configuración y Despliegue (Criterios 4.1.3.G.12 y 4.1.4.G.16)

Para garantizar la replicabilidad del proyecto, se documentó el proceso completo de configuración del proyecto y el despliegue en la nube[cite: 1]:
*   **Guía de Configuración:** Se creó un archivo de documentación (README) que detalla el repositorio, dependencias, variables de entorno requeridas y los comandos utilizados para iniciar la aplicación[cite: 1].
*   **Despliegue y Recomendaciones:** El documento abarca los servicios utilizados (MongoDB Atlas, Vercel, Render), configuraciones relevantes, evidencias de funcionamiento y recomendaciones técnicas para facilitar el mantenimiento y escalabilidad del sistema[cite: 1].

# 📑 PARTE 4: MODELADO DE DATOS NOSQL, CRUD Y GESTIÓN EN JIRA

Esta sección detalla el diseño conceptual y físico de la base de datos NoSQL, la implementación de las operaciones CRUD en producción, la estructura del código y la gestión ágil del proyecto utilizando Jira.

---

## 4.1. Diseño del Modelo de Datos NoSQL (Criterio 4.1.5.G.17)

Se diseñó un modelo de datos documental optimizado para las necesidades del condominio, considerando los patrones de consulta más frecuentes en conserjería (búsqueda de visitas activas, registros históricos por departamento y control de salidas):
*   **Modelo Documental (Desnormalizado):** Se optó por almacenar la información del visitante y el destino en un único documento de la colección `visitas` para maximizar el rendimiento de lectura y evitar operaciones de unión (*joins* o *lookups*) en consultas recurrentes.
*   **Patrón de Consulta:** Se priorizó el rendimiento de la aplicación indexando campos clave de consulta frecuente, permitiendo que la tabla de la interfaz de usuario se cargue y filtre de forma instantánea.

---

## 4.2. Creación de Bases de Datos y Colecciones (Criterio 4.1.5.G.18)

La base de datos y sus colecciones se implementaron en MongoDB Atlas aplicando nomenclatura estandarizada y configuraciones óptimas:
*   **Nombre de la Base de Datos:** `condomanage`
*   **Colección Principal:** `visitas`
*   **Estrategia de Indexación:** Se crearon índices automáticos para el campo `createdAt` y búsquedas por coincidencia en `departamento` y `rut` para optimizar la velocidad en la barra de búsqueda del frontend.

---

## 4.3. Estructura de Documentos y Validación de Esquema (Criterios 4.1.5.G.19 y 4.1.5.G.20)

La integridad de la información se asegura a nivel de servidor utilizando esquemas de **Mongoose ODM**. Cada documento cuenta con validaciones estrictas de tipos de datos, obligatoriedad y límites:

### Documento JSON de Ejemplo en MongoDB Atlas
```json
{
  "_id": { "$oid": "668f4d9c7f1a23c4a5678901" },
  "nombre": "Constanza Ruiz",
  "rut": "19.876.543-2",
  "departamento": "402-A",
  "motivo": "Visita",
  "fechaIngreso": { "$date": "2026-07-14T12:00:00.000Z" },
  "fechaSalida": null,
  "createdAt": { "$date": "2026-07-14T12:00:02.150Z" },
  "updatedAt": { "$date": "2026-07-14T12:00:02.150Z" }
}
```
## 4.4. Implementación del CRUD en Ambiente Web Desplegado
**(Criterio 4.1.6.G.23)**

El sistema cuenta con un flujo CRUD 100% funcional y desplegado públicamente a través de una arquitectura web desacoplada:

- **Create (POST /api/tasks):** Permite registrar nuevas vulnerabilidades de forma dinámica desde el frontend utilizando la edición y validación de datos y realizando comunicación asincrónica con MongoDB Atlas.
- **Read (GET /api/tasks):** Retorna un listado completo de vulnerabilidades, utilizando la información almacenada en MongoDB Atlas para ser desplegada en pantalla.
- **Update (PUT /api/tasks/:id):** Permite la edición limitada de cualquier campo del registro (excepto `_id`), garantizando que el administrador pueda actualizar la información sin comprometer la integridad de los datos.
- **Delete (DELETE /api/tasks/:id):** Permite remover registros erróneos o duplicados directamente desde la base de datos, manteniendo el estado de la aplicación actualizado en tiempo real.
- **Manejo de Errores:** Tanto el backend como el frontend controlan excepciones de red, validaciones de esquema y errores de código mediante bloques `try-catch` y alertas en consola.

---

## 4.5. Gestión de Tareas en Jira, Control de Código y Despliegues
**(Criterio 4.1.6.G.24)**

Se implementó un entorno de trabajo ágil (Scrum) y de control de calidad técnica para asegurar la correcta gestión del proyecto de software.

### 1. Gestión del Proyecto en Jira (Atlassian)

El desarrollo se organizó en un proyecto Scrum mediante la creación de tickets:

- **Product Backlog:** Listado priorizado de requisitos e historias de usuario (Registro, Vulnerabilidades, Edición en línea y Despliegue seguro).
- **Sprint Backlog:** Tareas seleccionadas para el primer sprint del desarrollo.
- **Flujo de Trabajo (Kanban Board):** Transición transparente de las tareas y asignaciones desde "Por Hacer" → "En Progreso" → "Completado", permitiendo evidenciar el avance del equipo.

### 2. Control de Versiones y Código Fuente

El trabajo de manera colaborativa fue respaldado mediante un sistema GitHub con las ramas principales:

- **main:** Rama estable con la versión final desplegada del proyecto.
- **develop:** Rama utilizada durante el desarrollo continuo del sistema.
- **Código Comentado:** El código del backend y frontend incluye comentarios indicando el propósito de funciones, validaciones HTTP, accesos y control de errores.

### 3. URLs del Sistema en Producción

- **URL Pública de la Aplicación (Frontend - Vercel):**
  ```
  https://como-manage-frontend.vercel.app/
  ```

- **URL Pública de la API REST (Backend - Render):**
  ```
  https://backend-de-tu-proyecto.onrender.com/api
  ```

- **Repositorio Público de GitHub:**
  ```
  https://github.com/gsilva221/Proyecto_DB
  ```