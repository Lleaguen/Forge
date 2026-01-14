# Forge – Backend Auth (Arquitectura y Flujo)

Este documento explica **qué está construido hasta ahora**, **cómo funciona el flujo de autenticación**, y **qué responsabilidad cumple cada carpeta**. Está pensado tanto para **stakeholders no técnicos** como para desarrolladores.

---

## 🧩 Qué es Forge (estado actual)

Forge es una plataforma web **multi‑tenant** para gestión de proyectos y tareas.

Actualmente el backend tiene **el sistema de autenticación completo**, diseñado con:

- Arquitectura **Hexagonal (Ports & Adapters)**
- **Monolito modular** con NestJS
- Dominio desacoplado de infraestructura
- Seguridad basada en **JWT + Refresh Tokens**
- Preparado para **roles, permisos y organizaciones**

👉 En este punto, **el sistema de Auth está terminado de punta a punta (e2e)**.

---

## 🔐 Qué funcionalidades de Auth existen hoy

Desde el punto de vista de producto:

- Registro de usuarios
- Login con email + password
- Hashing seguro de contraseñas
- Emisión de Access Token (JWT)
- Emisión y persistencia de Refresh Token
- Refresh Token de **uso único (rotación)**
- Revocación automática de tokens
- Protección de endpoints
- Autorización por **roles** y **permisos**
- Contexto de autenticación disponible en cada request
- Base preparada para multi‑tenant (organizationId)

---

## 🏗️ Arquitectura general

El backend sigue **Arquitectura Hexagonal pragmática**:

```
HTTP / DB / JWT / Prisma
        ↓
   Adapters (Infrastructure)
        ↓
      Ports (Interfaces)
        ↓
   Application (Use Cases)
        ↓
       Domain
```

**Regla clave:**
- El dominio no conoce frameworks
- Application no conoce HTTP ni DB
- Infraestructura depende del dominio, nunca al revés

---

## 📂 Estructura de carpetas (Auth Module)

```
src/modules/auth
│
├── domain
│   ├── entities
│   │   ├── user.entity.ts
│   │   └── refresh-token.entity.ts
│   ├── value-objects
│   │   ├── email.vo.ts
│   │   └── user-id.vo.ts
│   └── repositories
│       └── user.repository.ts
│
├── application
│   ├── use-cases
│   │   ├── register-user.use-case.ts
│   │   ├── login.use-case.ts
│   │   └── refresh-token.use-case.ts
│   ├── dtos
│   │   ├── register-user.dto.ts
│   │   └── login.dto.ts
│   └── ports
│       ├── password-hasher.port.ts
│       ├── token-generator.port.ts
│       ├── refresh-token-repository.port.ts
│       └── index.ts
│
├── infrastructure
│   ├── persistence
│   │   ├── prisma-user.repository.ts
│   │   └── prisma-refresh-token.repository.ts
│   ├── security
│   │   ├── bcrypt-password-hasher.ts
│   │   └── jwt-token-generator.ts
│   └── http
│       ├── guards
│       │   ├── auth.guard.ts
│       │   ├── roles.guard.ts
│       │   └── permissions.guard.ts
│       └── pipes
│           └── zod-validation.pipe.ts
│
├── interfaces
│   └── auth-context.interface.ts
│
├── auth.controller.ts
└── auth.module.ts
```

---

## 🧠 Responsabilidad de cada capa

### 🟡 Domain

**Reglas de negocio puras**:
- Entidades (`User`, `RefreshToken`)
- Value Objects (`Email`, `UserId`)
- Invariantes del sistema

✔ No conoce NestJS
✔ No conoce Prisma
✔ No conoce JWT

---

### 🔵 Application

**Casos de uso** del sistema:

- RegisterUser
- Login
- RefreshToken

Define **qué se puede hacer**, no **cómo**.

- Usa interfaces (ports)
- Orquesta dominio

---

### 🟢 Infrastructure

Implementaciones técnicas:

- Prisma (PostgreSQL)
- JWT
- bcrypt
- HTTP (controllers, guards, pipes)

Es la única capa que conoce frameworks.

---

### 🟣 Interfaces

Contratos compartidos **entre infraestructura HTTP y guards**:

- `AuthContext`

Permite tipar:
```ts
req.authContext
```

Sin acoplar dominio a HTTP.

---

## 🔁 Flujo de Auth (Login → Request protegido)

### 1️⃣ Login

```
HTTP POST /auth/login
   ↓
Controller
   ↓
LoginUseCase
   ↓
UserRepository + PasswordHasher
   ↓
JWT + RefreshToken
```

Resultado:
- Access Token
- Refresh Token

---

### 2️⃣ Request protegido

```
Request HTTP
   ↓
AuthGuard
   ↓ (valida JWT)
req.authContext
   ↓
RolesGuard / PermissionsGuard
   ↓
Controller
```

---

### 3️⃣ Refresh Token

```
POST /auth/refresh
   ↓
RefreshTokenUseCase
   ↓
Valida token
   ↓
Revoca token usado
   ↓
Genera nuevos tokens
```

✔ Tokens de un solo uso
✔ Seguridad enterprise

---

## 🧪 Validación (Zod)

- Zod vive en `shared/zod`
- Se usa **solo en la frontera HTTP**
- Application nunca conoce Zod

```
HTTP → Zod → DTO → UseCase
```

---

## 🧱 Base de datos (Prisma)

Modelo clave:

```prisma
model RefreshToken {
  token      String   @id
  userId     String
  email      String
  expiresAt DateTime
  revokedAt DateTime?
  createdAt DateTime @default(now())
}
```

Permite:
- Revocación
- Rotación
- Auditoría

---

## ✅ Estado del proyecto

### Completado

- Auth e2e
- Seguridad
- Arquitectura base

### Próximos pasos naturales

- Organizations & memberships
- Roles por organización
- Permisos dinámicos
- Policy engine
- Testing e2e

---

## 🧠 Conclusión

Este backend es:
- Escalable
- Testeable
- Segura
- Evolutiva

Forge está listo para crecer sin deuda técnica.

