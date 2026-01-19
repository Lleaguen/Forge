# Forge

Forge es una plataforma web multi-tenant para la gestión de proyectos y tareas,
diseñada como un monolito modular con arquitectura hexagonal pragmática.



## 🎯 Objetivos técnicos

- Arquitectura hexagonal pragmática (Ports & Adapters)
- Dominio desacoplado de infraestructura
- Autenticación robusta (JWT + Refresh Token)
- Multi-tenancy con roles por organización
- Código legible, reutilizable y fácil de testear
- Monorepo con tipos y esquemas compartidos
- Base de datos relacional preparada para escalar

## 🧠 Decisiones clave

- **Monolito modular**: permite escalar sin complejidad prematura
- **Hexagonal pragmática**: abstracciones solo donde agregan valor
- **Zod como contrato**: validación y tipado en el borde del sistema
- **PostgreSQL + Prisma**: relaciones claras y performance predecible
- **Next.js + React Query**: separación entre UI y estado remoto

## 🏗️ Arquitectura general

- Backend: NestJS + Clean / Hexagonal Architecture
- Frontend: Next.js (App Router)
- Shared: Tipos y esquemas compartidos vía monorepo

## 🔐 Seguridad y Auth

- Login y Register
- Password hashing (bcrypt)
- Access Token + Refresh Token
- Rotación de refresh tokens
- Guards por rol y organización
- Validación de inputs con Zod

## 🧪 Testing

- Unit tests en casos de uso
- Integration tests en autenticación
- Testing enfocado en lógica, no en boilerplate

## 📡 API Endpoints

### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrar usuario
- `POST /auth/refresh` - Refrescar token

### Proyectos
- `POST /projects` - Crear proyecto (requiere auth, rol admin, permiso create_project)
  - Body: `{ organizationId: string, name: string, description?: string }`
- `GET /projects?organizationId=<id>` - Obtener proyectos por organización (requiere auth, rol admin, permiso view_project)
- `PUT /projects/:id` - Actualizar proyecto (requiere auth, rol admin, permiso update_project)
  - Body: `{ name?: string, description?: string }`
- `DELETE /projects/:id` - Eliminar proyecto (requiere auth, rol admin, permiso delete_project)

### Tareas
- `POST /tasks` - Crear tarea (requiere auth, rol admin, permiso create_task)
  - Body: `{ projectId: string, title: string, status?: string }`
- `GET /tasks?projectId=<id>` - Obtener tareas por proyecto (requiere auth, rol admin, permiso view_task)
- `PUT /tasks/:id` - Actualizar tarea (requiere auth, rol admin, permiso update_task)
  - Body: `{ title?: string, status?: string }`
- `DELETE /tasks/:id` - Eliminar tarea (requiere auth, rol admin, permiso delete_task)

### Organizaciones
- `POST /organizations` - Crear organización (requiere auth, rol admin, permiso create_organization)
  - Body: `{ name: string }`
- `GET /organizations` - Obtener organizaciones del usuario (requiere auth, rol admin, permiso view_organization)
- `PUT /organizations/:id` - Actualizar organización (requiere auth, rol admin, permiso update_organization)
  - Body: `{ name?: string }`
- `DELETE /organizations/:id` - Eliminar organización (requiere auth, rol admin, permiso delete_organization)

## 🚀 Estado del proyecto

Actualmente en fase de Mejoras.