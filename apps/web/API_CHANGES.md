# Cambios en la API - Resumen

## ✅ Cambios Implementados

### 1. **Proyectos**
- ✅ `GET /projects` ahora requiere `organizationId` como query param: `GET /projects?organizationId=<id>`
- ✅ `POST /projects` ahora requiere `organizationId` en el body
- ✅ `PUT /projects/:id` (cambió de PATCH a PUT)
- ✅ Eliminado `GET /projects/:id` (no existe en el backend)
- ✅ Eliminado `POST /projects/:id/archive` (no existe en el backend)

### 2. **Tareas**
- ✅ `GET /tasks?projectId=<id>` (cambió de `/projects/:projectId/tasks` a query param)
- ✅ `PUT /tasks/:id` (cambió de PATCH a PUT)
- ✅ Eliminado `GET /tasks/:taskId` (no existe en el backend)
- ✅ Body simplificado: solo `title` y `status` opcional

### 3. **Columnas**
- ❌ **Eliminadas completamente** - El backend no tiene endpoints para columnas
- ✅ El Kanban ahora usa columnas predefinidas: TO DO, IN PROGRESS, DONE

### 4. **Organizaciones**
- ✅ Nuevos endpoints agregados:
  - `GET /organizations`
  - `POST /organizations`
  - `PUT /organizations/:id`
  - `DELETE /organizations/:id`

### 5. **Autenticación**
- ⚠️ `GET /auth/me` no existe en el backend
- ✅ El usuario se guarda en localStorage después del login
- ✅ `useAuth` ahora carga el usuario del localStorage

## 🔄 Componentes Actualizados

1. **ProjectsGrid** - Ahora requiere `organizationId` del usuario
2. **KanbanBoard** - Usa columnas predefinidas en lugar de cargarlas del backend
3. **ProjectBoardModal** - Eliminadas funciones de columnas y archivar
4. **ProjectSettingsView** - Ahora busca el proyecto en la lista en lugar de hacer GET individual
5. **NewProjectPage** - Eliminados campos `deadline` y `visibility` (no están en el backend)
6. **ProjectList** - Actualizado para usar `organizationId`

## 📝 Notas Importantes

- Todos los endpoints requieren autenticación (token en header)
- Todos los endpoints requieren rol `admin` y permisos específicos
- El usuario debe tener una organización asignada para crear/ver proyectos
- Las columnas del Kanban son estáticas (TO DO, IN PROGRESS, DONE)
- El estado de las tareas debe coincidir con los nombres de las columnas: `todo`, `in-progress`, `done`
