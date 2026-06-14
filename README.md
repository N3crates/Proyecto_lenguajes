# EduControl

Sistema académico fullstack desarrollado con Node.js, Express, Firebase Firestore y React + Vite.

Proyecto realizado para la materia de Lenguajes Modernos de Programación.

---

# Tecnologías utilizadas

## Backend
- Node.js
- Express
- Firebase Admin SDK
- Cloud Firestore
- JWT
- bcrypt
- dotenv
- cors
- helmet
- morgan

## Frontend
- React
- Vite
- React Router DOM
- Axios
- Bootstrap (uso parcial)

## DevOps
- Docker
- Docker Compose

---

# Estructura del proyecto

```txt
Proyecto_lenguajes/
│
├── backend/
├── frontend/
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

# Estructura Backend

```txt
backend/
│
├── src/
│   ├── config/
│   │   └── firebase.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── role.middleware.js
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── roles/
│   │   ├── permissions/
│   │   ├── teachers/
│   │   ├── students/
│   │   ├── subjects/
│   │   ├── groups/
│   │   ├── grades/
│   │   ├── enrollments/
│   │   ├── dashboard/
│   │   └── audit/
│   ├── scripts/
│   │   └── seedRoles.js
│   ├── utils/
│   │   ├── audit.controller.js
│   │   ├── audit.routes.js
│   │   └── audit.service.js
│   └── app.js
│
├── .env
├── .dockerignore
├── Dockerfile
├── package.json
└── server.js
```

---

# Estructura Frontend

```txt
frontend/
│
├── public/
│
├── src/
│   ├── api/
│   │   └── axios.js
│   ├── assets/
│   ├── components/
│   │   └── layout/
│   │       ├── AppLayout.jsx
│   │       └── AppLayout.css
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── AuthProvider.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Users.jsx
│   │   ├── Roles.jsx
│   │   ├── Audit.jsx
│   │   ├── Teachers.jsx
│   │   ├── Students.jsx
│   │   ├── Subjects.jsx
│   │   ├── Groups.jsx
│   │   ├── MyGroups.jsx
│   │   ├── Grades.jsx
│   │   ├── Enrollments.jsx
│   │   └── Profile.jsx
│   ├── routes/
│   │   ├── AppRouter.jsx
│   │   └── ProtectedRoute.jsx
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
│
├── .env
├── .dockerignore
├── Dockerfile
├── package.json
├── vite.config.js
└── index.html
```

---

# Clonar repositorio

```bash
git clone https://github.com/N3crates/Proyecto_lenguajes.git
```

---

# Opción A — Correr con Docker (recomendado)

## Requisitos
- Docker Desktop instalado y corriendo

## Variables de entorno

Crear `backend/.env`:

```env
PORT=3000
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Crear `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

## Levantar el proyecto

```bash
# Primera vez o cuando hay cambios en Dockerfile o package.json
docker compose up --build

# Las siguientes veces
docker compose up

# Detener
docker compose down
```

## Acceder

```
Frontend → http://localhost:5173
Backend  → http://localhost:3000
```

---

# Opción B — Instalación manual

## Backend

```bash
cd backend
npm install
npm run dev
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# ⚠ Cambio importante — Configuración de Firebase

> **Leer antes de correr el proyecto si ya lo tenían funcionando antes.**

La conexión a Firebase fue migrada de un archivo `serviceAccountKey.json` a variables de entorno en el `.env`. Esto fue necesario para soportar Docker y evitar subir credenciales al repositorio.

### Antes (ya no funciona)

```js
// firebase.js — forma anterior
const serviceAccount = require('../../serviceAccountKey.json');
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
```

### Ahora

```js
// firebase.js — forma actual
admin.initializeApp({
  credential: admin.credential.cert({
    projectId:   process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey:  process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  })
});
```

### Qué hacer si tenías el proyecto corriendo antes

1. Abre tu `serviceAccountKey.json` (el que tienes en tu computadora, no se sube al repo)
2. Copia los valores correspondientes a tu `backend/.env`:

```env
FIREBASE_PROJECT_ID=      # valor de "project_id" en el JSON
FIREBASE_CLIENT_EMAIL=    # valor de "client_email" en el JSON
FIREBASE_PRIVATE_KEY=     # valor de "private_key" en el JSON (con las comillas dobles)
```

3. El `serviceAccountKey.json` ya no es necesario para correr el proyecto, pero guárdalo por si acaso.

---

# Variables de entorno Backend

Crear archivo `backend/.env`:

```env
PORT=3000
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

> Las credenciales de Firebase se obtienen desde la consola de Firebase → Configuración del proyecto → Cuentas de servicio → Generar nueva clave privada.

---

# Variables de entorno Frontend

Crear archivo `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

---

# Seed de roles base

Para inicializar los roles base (admin, teacher, student) en Firestore ejecutar una sola vez:

```bash
cd backend
node src/scripts/seedRoles.js
```

---

# Scripts disponibles

## Backend

```bash
npm run dev    # Modo desarrollo con nodemon
npm start      # Modo producción
```

## Frontend

```bash
npm run dev    # Modo desarrollo
npm run build  # Build de producción
```

## Docker

```bash
docker compose up --build    # Construir y levantar
docker compose up            # Levantar sin reconstruir
docker compose down          # Detener y eliminar contenedores
docker compose logs -f       # Ver logs en tiempo real
```

---

# APIs principales

## Auth

```http
POST  /api/auth/register
POST  /api/auth/login
POST  /api/auth/logout
POST  /api/auth/refresh
GET   /api/auth/me
PATCH /api/auth/change-password
PATCH /api/auth/update-profile
```

## Usuarios

```http
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
PATCH  /api/users/:id/status
DELETE /api/users/:id
```

## Roles

```http
GET    /api/roles
POST   /api/roles
PUT    /api/roles/:id
DELETE /api/roles/:id
```

## Permisos

```http
GET /api/permissions
```

## Docentes

```http
GET    /api/teachers
GET    /api/teachers/:id
GET    /api/teachers/by-user/:userId
POST   /api/teachers
PUT    /api/teachers/:id
DELETE /api/teachers/:id
```

## Alumnos

```http
GET    /api/students
GET    /api/students/:id
PUT    /api/students/:id
DELETE /api/students/:id
```

## Materias

```http
GET    /api/subjects
GET    /api/subjects/:id
POST   /api/subjects
PUT    /api/subjects/:id
DELETE /api/subjects/:id
```

## Grupos

```http
GET    /api/groups
GET    /api/groups/:id
GET    /api/groups/teacher/:teacherId
POST   /api/groups
PUT    /api/groups/:id
DELETE /api/groups/:id
```

## Calificaciones

```http
GET    /api/grades
GET    /api/grades/enrollment/:enrollmentId
POST   /api/grades
PUT    /api/grades/:id
DELETE /api/grades/:id
```

## Inscripciones

```http
GET    /api/enrollments
GET    /api/enrollments/:id
GET    /api/enrollments/student/:studentId
POST   /api/enrollments
PUT    /api/enrollments/:id
DELETE /api/enrollments/:id
```

## Dashboard

```http
GET /api/dashboard/summary
```

## Auditoría

```http
GET /api/audit
```

---

# Sistema de roles y permisos

EduControl implementa un sistema de control de acceso basado en permisos dinámicos. Los permisos disponibles son:

| Permiso | Descripción | Módulo |
|---|---|---|
| `view_dashboard` | Ver Dashboard | General |
| `manage_users` | Gestionar Usuarios | Admin |
| `manage_roles` | Gestionar Roles | Admin |
| `manage_teachers` | Gestionar Docentes | Escolar |
| `manage_students` | Gestionar Alumnos | Escolar |
| `manage_enrollments` | Gestionar Inscripciones | Escolar |
| `manage_subjects` | Gestionar Materias | Académico |
| `manage_groups` | Gestionar Grupos | Académico |
| `manage_grades` | Gestionar Calificaciones | Académico |
| `view_own_groups` | Ver Mis Grupos | Docente |
| `view_own_grades` | Ver Mis Calificaciones | Estudiante |
| `view_enrollments` | Ver Mis Inscripciones | Estudiante |
| `view_grades` | Ver Calificaciones | General |
| `view_audit` | Ver Auditoría | Solo Admin |

### Roles base

| Rol | Permisos |
|---|---|
| `admin` | Todos excepto `view_own_groups`, `view_own_grades`, `view_enrollments` |
| `teacher` | `view_dashboard`, `view_own_groups`, `manage_grades` |
| `student` | `view_dashboard`, `view_own_grades`, `view_enrollments` |

Los administradores pueden crear roles personalizados con cualquier combinación de permisos desde la página de Roles y Permisos.

---

# Colecciones en Firestore

| Colección | Descripción |
|---|---|
| `users` | Cuentas de usuario (nombre, email, rol, estado) |
| `teachers` | Perfiles de docentes |
| `students` | Perfiles de alumnos |
| `roles` | Roles y sus permisos |
| `subjects` | Materias |
| `groups` | Grupos escolares |
| `enrollments` | Inscripciones de alumnos a grupos |
| `grades` | Calificaciones |
| `audit_logs` | Registro de acciones del sistema |

---

# Seguridad implementada

- JWT Authentication con access token (1h) y refresh token (7d)
- Password hashing con bcrypt
- Middleware de autenticación en todas las rutas privadas
- Middleware de roles (`checkRole`) para rutas exclusivas de admin
- Middleware de permisos (`checkPermission`) para control granular
- Protección de rutas en el frontend con `ProtectedRoute`
- Variables de entorno para credenciales
- Helmet para headers de seguridad
- CORS configurado
- Registro de auditoría en todas las acciones importantes
- Credenciales de Firebase fuera del repositorio

---

# Funcionalidades principales

- Autenticación con JWT y refresh tokens
- Roles y permisos dinámicos — el menú del sidebar se construye automáticamente según los permisos del usuario
- Creación de roles personalizados con permisos configurables
- CRUD completo de usuarios con campos específicos por rol al crear
- CRUD de docentes con perfil separado de la cuenta de usuario
- CRUD de alumnos con matrícula, carrera y semestre
- CRUD de materias y grupos escolares
- Gestión de calificaciones con parciales y promedio automático
- Inscripciones de alumnos a grupos
- Dashboard personalizado por rol con estadísticas propias
- Actividad reciente en el dashboard por usuario
- Auditoría de todas las acciones del sistema
- Edición de perfil y cambio de contraseña para todos los roles
- Paginación en tablas de grupos y docentes

---

# Integrantes

## Integrante 1 — Auth, Seguridad y Administración
- Firebase
- JWT / Auth
- Roles y permisos dinámicos
- Auditoría
- Login / Dashboard
- Usuarios / Roles
- Docker

## Integrante 2 — Docentes, Materias y Grupos
- Teachers
- Subjects
- Groups
- CRUD módulos académicos

## Integrante 3 — Alumnos, Inscripciones y Calificaciones
- Students
- Enrollments
- Grades
- Historial académico

---

# Git Ignore

El proyecto ignora automáticamente:

- `node_modules/`
- `.env`
- `backend/serviceAccountKey.json`
- `dist/`
- `build/`
- logs

---

# Estado del proyecto

✅ Funcional

---

# Licencia

Proyecto académico.