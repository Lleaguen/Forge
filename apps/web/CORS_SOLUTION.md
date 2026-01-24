# Solución al Problema de CORS

## Problema
El error indica que el backend en `http://localhost:3000` está rechazando peticiones desde `http://localhost:3001` debido a políticas CORS.

## Soluciones Implementadas

### 1. Proxy de Next.js (Solución Temporal - Ya Implementada)
He configurado un proxy en `next.config.js` que redirige todas las peticiones `/api/*` al backend. Esto evita el problema de CORS porque las peticiones se hacen al mismo origen.

**Cómo funciona:**
- Frontend hace petición a: `http://localhost:3001/api/auth/login`
- Next.js proxy redirige a: `http://localhost:3000/api/auth/login`
- No hay CORS porque el navegador ve la petición como same-origin

### 2. Configuración de CORS en el Backend (Solución Permanente)

Si tu backend está en Node.js/Express, agrega esto:

```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

Si tu backend está en NestJS:

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  await app.listen(3000);
}
bootstrap();
```

Si tu backend está en otro framework, busca la documentación de CORS para ese framework.

## Configuración Actual

El código del frontend ahora:
1. ✅ Usa el proxy de Next.js en desarrollo (`/api/*`)
2. ✅ Usa la URL completa en producción
3. ✅ Maneja correctamente el refresh token

## Verificación

1. Reinicia el servidor de Next.js:
   ```bash
   pnpm dev
   ```

2. Las peticiones ahora deberían funcionar sin errores de CORS.

## Nota Importante

El proxy de Next.js solo funciona en desarrollo. Para producción, **debes configurar CORS en tu backend** o usar la misma URL para frontend y backend.
