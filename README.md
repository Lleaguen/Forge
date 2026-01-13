# Forge

Forge es una plataforma web multi-tenant para la gestión de proyectos y tareas,
diseñada como un monolito modular con arquitectura hexagonal pragmática.

El objetivo del proyecto es demostrar seniority en desarrollo full-stack,
priorizando claridad arquitectónica, escalabilidad, separación de responsabilidades
y buenas prácticas de seguridad y autenticación.

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

## 🚀 Estado del proyecto

Actualmente en fase de diseño y setup inicial.
La implementación comienza por el módulo de autenticación.
