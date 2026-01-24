# Forge Web - Project Management Platform

Aplicación web moderna construida con Next.js 14, TypeScript, Tailwind CSS y React Query para la gestión de proyectos y tareas.

## 🚀 Características

- ✅ Autenticación completa (Login, Registro, Refresh Token)
- ✅ Gestión de proyectos (Crear, Editar, Archivar)
- ✅ Tablero Kanban para tareas
- ✅ Sistema de columnas personalizables
- ✅ Perfil de usuario
- ✅ Tema oscuro/claro
- ✅ Diseño responsive

## 📁 Estructura del Proyecto

```
src/
├── app/                          # App Router de Next.js
│   ├── api/                      # APIs organizadas por feature
│   │   ├── auth.api.ts          # API de autenticación
│   │   ├── projects.api.ts      # API de proyectos
│   │   └── tasks.api.ts         # API de tareas
│   ├── dashboard/                # Rutas del dashboard
│   │   ├── layout.tsx           # Layout del dashboard
│   │   ├── page.tsx             # Página principal del dashboard
│   │   ├── profile/             # Perfil de usuario
│   │   ├── projects/            # Gestión de proyectos
│   │   └── team/                # Gestión de equipo
│   ├── hooks/                    # Custom hooks
│   │   ├── useAuth.ts           # Hook de autenticación
│   │   ├── useProjects.ts       # Hook de proyectos
│   │   ├── useTasks.ts          # Hook de tareas
│   │   ├── useLoginForm.ts      # Hook de formulario de login
│   │   └── useRegisterForm.ts   # Hook de formulario de registro
│   ├── login/                    # Página de login
│   ├── register/                 # Página de registro
│   ├── profile/                  # Componentes de perfil
│   ├── schemas/                  # Esquemas de validación (Zod)
│   ├── shared/                   # Utilidades compartidas
│   │   └── api/                 # Configuración de axios y query keys
│   ├── types/                    # Tipos TypeScript
│   └── providers.tsx             # Providers de React Query
├── components/                   # Componentes reutilizables
│   ├── layout/                   # Componentes de layout
│   ├── shared/                   # Componentes compartidos
│   ├── states/                   # Estados de carga/error/vacío
│   └── ui/                       # Componentes de UI
└── utils/                        # Utilidades
```

## 🛠️ Tecnologías

- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utility-first
- **React Query** - Gestión de estado del servidor
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas
- **Axios** - Cliente HTTP

## 📦 Instalación

1. Clona el repositorio
```bash
git clone <repository-url>
cd carpeta-sin-título
```

2. Instala las dependencias
```bash
pnpm install
```

3. Configura las variables de entorno
```bash
cp .env.local.example .env.local
```

Edita `.env.local` y configura:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

4. Ejecuta el servidor de desarrollo
```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🔧 Configuración del Backend

La aplicación espera un backend con los siguientes endpoints:

### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrar usuario
- `POST /auth/refresh` - Refrescar token

### Proyectos
- `GET /projects?organizationId=<id>` - Obtener proyectos por organización (requiere auth, rol admin, permiso view_project)
- `POST /projects` - Crear proyecto (requiere auth, rol admin, permiso create_project)
  - Body: `{ organizationId: string, name: string, description?: string }`
- `PUT /projects/:id` - Actualizar proyecto (requiere auth, rol admin, permiso update_project)
  - Body: `{ name?: string, description?: string }`
- `DELETE /projects/:id` - Eliminar proyecto (requiere auth, rol admin, permiso delete_project)

### Tareas
- `GET /tasks?projectId=<id>` - Obtener tareas por proyecto (requiere auth, rol admin, permiso view_task)
- `POST /tasks` - Crear tarea (requiere auth, rol admin, permiso create_task)
  - Body: `{ projectId: string, title: string, status?: string }`
- `PUT /tasks/:id` - Actualizar tarea (requiere auth, rol admin, permiso update_task)
  - Body: `{ title?: string, status?: string }`
- `DELETE /tasks/:id` - Eliminar tarea (requiere auth, rol admin, permiso delete_task)

### Organizaciones
- `GET /organizations` - Obtener organizaciones del usuario (requiere auth, rol admin, permiso view_organization)
- `POST /organizations` - Crear organización (requiere auth, rol admin, permiso create_organization)
  - Body: `{ name: string }`
- `PUT /organizations/:id` - Actualizar organización (requiere auth, rol admin, permiso update_organization)
  - Body: `{ name?: string }`
- `DELETE /organizations/:id` - Eliminar organización (requiere auth, rol admin, permiso delete_organization)

## 🎨 Características de UI

- **Tema oscuro/claro** - Toggle de tema con next-themes
- **Diseño responsive** - Adaptado a móviles y tablets
- **Estados de carga** - Indicadores visuales durante las peticiones
- **Manejo de errores** - Mensajes de error claros y accionables
- **Validación de formularios** - Validación en tiempo real con Zod

## 📝 Scripts Disponibles

```bash
pnpm dev          # Servidor de desarrollo
pnpm build        # Construir para producción
pnpm start        # Servidor de producción
pnpm lint         # Ejecutar linter
```

## 🔐 Autenticación

La autenticación utiliza JWT tokens:
- `accessToken` - Token de acceso (almacenado en localStorage)
- `refreshToken` - Token de refresco (almacenado en localStorage)

Los tokens se envían automáticamente en las peticiones mediante interceptores de Axios.

## 🚧 Próximas Mejoras

- [ ] Búsqueda y filtros avanzados
- [ ] Notificaciones en tiempo real
- [ ] Integración con calendario
- [ ] Exportación de datos
- [ ] Modo offline
- [ ] Tests unitarios y de integración

## 📄 Licencia

Este proyecto es privado y confidencial.
