# Solución al Error 404 en Login

## Problema
El error 404 indica que la petición a `/api/auth/login` no está llegando al backend correctamente.

## Posibles Causas

### 1. El backend no está corriendo
**Solución:** Verifica que tu backend esté corriendo en el puerto 3000:
```bash
# En otra terminal, verifica:
curl http://localhost:3000/api/auth/login
# O abre en el navegador: http://localhost:3000/api/auth/login
```

### 2. El proxy de Next.js no está funcionando
**Solución:** Reinicia el servidor de Next.js:
```bash
# Detén el servidor (Ctrl+C) y reinicia:
pnpm dev
```

### 3. El puerto del backend es diferente
**Solución:** Actualiza `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:PUERTO_DE_TU_BACKEND/api
```

### 4. Desactivar el proxy (si CORS está configurado en el backend)
**Solución:** Edita `.env.local` y agrega:
```env
NEXT_PUBLIC_USE_PROXY=false
```

Esto hará que las peticiones vayan directamente al backend sin pasar por el proxy.

## Verificación Paso a Paso

1. **Verifica que el backend esté corriendo:**
   ```bash
   curl http://localhost:3000/api/auth/login
   ```
   Deberías recibir una respuesta (aunque sea un error de método o autenticación, no un 404).

2. **Verifica la configuración:**
   - Abre `.env.local`
   - Confirma que `NEXT_PUBLIC_API_URL` apunta al puerto correcto
   - Si tu backend está en otro puerto (ej: 5000), cámbialo

3. **Reinicia Next.js:**
   ```bash
   # Detén el servidor
   # Luego reinicia:
   pnpm dev
   ```

4. **Si el proxy no funciona, desactívalo:**
   - Agrega `NEXT_PUBLIC_USE_PROXY=false` en `.env.local`
   - Reinicia Next.js
   - **Importante:** Asegúrate de tener CORS configurado en tu backend

## Debug en la Consola del Navegador

Abre la consola del navegador (F12) y verifica:
- La pestaña **Network**: Verás la URL completa de la petición
- Si la URL es `/api/auth/login`, el proxy debería redirigir a `http://localhost:3000/api/auth/login`
- Si la URL es `http://localhost:3000/api/auth/login` directamente, el proxy está desactivado

## Configuración del Backend para CORS

Si desactivas el proxy, necesitas configurar CORS en tu backend:

### Express.js
```javascript
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3001', // Puerto de Next.js
  credentials: true
}));
```

### NestJS
```typescript
app.enableCors({
  origin: 'http://localhost:3001',
  credentials: true
});
```
