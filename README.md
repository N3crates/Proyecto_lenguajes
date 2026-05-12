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
- Bootstrap

---

# Estructura del proyecto

```txt
Proyecto_lenguajes/
│
├── backend/
│
├── frontend/
│
├── .gitignore
│
└── README.md
```

---

# Estructura Backend

```txt
backend/
│
├── src/
│   ├── config/
│   ├── middlewares/
│   ├── modules/
│   ├── routes/
│   ├── utils/
│   └── app.js
│
├── .env
├── package.json
├── package-lock.json
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
│   ├── assets/
│   ├── components/
│   │   ├── forms/
│   │   ├── layout/
│   │   └── ui/
│   ├── context/
│   ├── hooks/
│   ├── pages/
│   ├── routes/
│   ├── styles/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
│
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

# Instalación Backend

## Entrar a backend

```bash
cd backend
```

## Instalar dependencias

```bash
npm install
```

## Dependencias utilizadas

```bash
npm install express firebase-admin dotenv cors bcrypt jsonwebtoken helmet morgan
```

## Dependencias de desarrollo

```bash
npm install -D nodemon
```

---

# Variables de entorno Backend

Crear archivo `.env`

Ejemplo:

```env
PORT=3000
JWT_SECRET=your_secret_key
```

---

# Ejecutar Backend

## Modo desarrollo

```bash
npm run dev
```

## Modo producción

```bash
npm start
```

---

# Instalación Frontend

## Entrar a frontend

```bash
cd frontend
```

## Instalar dependencias

```bash
npm install
```

## Dependencias utilizadas

```bash
npm install react-router-dom axios bootstrap
```

---

# Ejecutar Frontend

```bash
npm run dev
```

---

# Funcionalidades principales

- Autenticación JWT
- Roles y permisos
- CRUD de usuarios
- CRUD de docentes
- CRUD de alumnos
- CRUD de materias
- CRUD de grupos
- Gestión de calificaciones
- Dashboard
- Auditoría
- Protección de rutas
- Validaciones frontend y backend

---

# APIs principales

## Auth

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
PATCH /api/auth/change-password
```

## Usuarios

```http
GET    /api/users
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
```

## Roles

```http
GET  /api/roles
POST /api/roles
```

---

# Seguridad implementada

- JWT Authentication
- Password hashing con bcrypt
- Middleware de autenticación
- Middleware de roles y permisos
- Variables de entorno
- Helmet
- CORS
- Manejo de errores
- Auditoría de acciones

---

# Scripts disponibles

## Backend

```bash
npm run dev
npm start
```

## Frontend

```bash
npm run dev
npm run build
```

---

# Git Ignore

El proyecto ignora automáticamente:

- node_modules
- variables de entorno
- builds
- logs
- credenciales Firebase

---

# Integrantes

## Integrante 1 — Auth, Seguridad y Administración
- Firebase
- JWT/Auth
- Roles y permisos
- Auditoría
- Login
- Dashboard
- Usuarios
- Roles

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

# Estado del proyecto

🚧 En desarrollo

---

# Licencia

Proyecto académico.