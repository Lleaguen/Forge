# Guía de Solución de Problemas

## Error 404 (Not Found)

### Posibles causas:

1. **El backend no está corriendo**
   - Verifica que tu servidor backend esté corriendo en el puerto 3000
   - Ejemplo: `http://localhost:3000/api/auth/login` debería responder

2. **El proxy de Next.js no está funcionando**
   - Reinicia el servidor de Next.js después de cambiar `next.config.js`
   - El proxy solo funciona en desarrollo (`pnpm dev`)

3. **La URL del backend es incorrecta**
   - Verifica el archivo `.env.local`
   - Asegúrate de que `NEXT_PUBLIC_API_URL` apunte al puerto correcto

### Soluciones:

#### 1. Verificar que el backend esté corriendo
```bash
# En otra terminal, verifica que el backend responda:
curl http://localhost:3000/api/auth/login
# O abre en el navegador: http://localhost:3000/api/auth/login
```

#### 2. Reiniciar Next.js
```bash
# Detén el servidor (Ctrl+C) y reinicia:
pnpm dev
```

#### 3. Verificar configuración
- Asegúrate de tener un archivo `.env.local` con:
  ```
  NEXT_PUBLIC_API_URL=http://localhost:3000/api
  ```

#### 4. Desactivar proxy temporalmente (para debug)
Si el proxy no funciona, puedes desactivarlo temporalmente editando `src/app/shared/api/axios.ts`:

```typescript
const getBaseURL = () => {
  // Forzar URL directa (sin proxy)
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
}
```

**Nota:** Esto causará errores de CORS a menos que configures CORS en tu backend.

## Warning de Deprecación de Node.js

El warning `util._extend` es de una dependencia antigua. No afecta la funcionalidad, pero puedes ignorarlo o actualizar las dependencias:

```bash
pnpm update
```

## Verificar que todo funciona

1. **Backend corriendo**: `http://localhost:3000/api` responde
2. **Frontend corriendo**: `http://localhost:3001` carga
3. **Proxy funcionando**: Las peticiones a `/api/*` se redirigen al backend
4. **Sin CORS**: No hay errores de CORS en la consola del navegador

## Debug

Abre la consola del navegador (F12) y verifica:
- Las peticiones en la pestaña "Network"
- Los errores en la pestaña "Console"
- La URL completa de las peticiones fallidas
