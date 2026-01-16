# Forge Web — UX / UI

Este documento describe las vistas del frontend y su comportamiento.
El foco está en una UX clara, predecible y profesional, sin sobrecargar la interfaz.

## 🎨 Principios de diseño

- Interfaz limpia y minimalista
- Feedback claro al usuario
- Estados visibles (loading, empty, error)
- Accesibilidad básica
- Mobile-first

## 🧭 Rutas principales

### Auth

- `/login`
- `/register`

Funcionalidades:
- Validación de formularios con Zod
- Mensajes de error claros
- Estados de carga
- Redirección post-login

---

### Onboarding

- `/onboarding/organization`

Funcionalidades:
- Crear organización
- Elegir nombre
- Asignar rol inicial (OWNER)

---

### Dashboard

- `/dashboard`

Vista general:
- Organización activa
- Listado de proyectos
- Acceso rápido a creación

---

### Proyectos

- `/dashboard/projects`
- `/dashboard/projects/new`
- `/dashboard/projects/[id]`

Funcionalidades:
- Crear proyecto
- Listar proyectos
- Cambiar proyecto activo

---

### Tareas

- `/dashboard/projects/[id]/tasks`

Funcionalidades:
- Listado de tareas
- Crear / editar tareas
- Cambiar estado (todo / in-progress / done)
- Filtro básico

---

### Perfil

- `/dashboard/profile`

Funcionalidades:
- Ver datos del usuario
- Cerrar sesión
- Cambiar organización activa

---

## 🔄 Estados UX importantes

Cada vista debe contemplar:
- Loading state
- Empty state
- Error state
- Success feedback

## 📦 Estado y datos

- Server State: React Query
- Validación: Zod
- Comunicación con API: Axios tipado
- Auth state: Context + cookies httpOnly

## 🎯 Objetivo del frontend

El frontend no contiene lógica de negocio.
Actúa como consumidor de casos de uso del backend,
mostrando datos de forma clara y consistente.
