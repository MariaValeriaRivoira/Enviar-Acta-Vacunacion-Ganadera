# Guía de Despliegue - Firebase + Replit Backend

Esta guía explica cómo desplegar el frontend en Firebase Hosting mientras mantienes el backend corriendo en Replit.

## Arquitectura

- **Frontend**: Desplegado en Firebase Hosting (archivos estáticos)
- **Backend**: Corriendo en Replit (API, envío de emails)
- **Comunicación**: Frontend en Firebase hace llamadas al backend en Replit vía CORS

## Configuración Completada

### 1. Archivos de Firebase
Ya se crearon los archivos de configuración:
- `.firebaserc` - Configurado con proyecto "ActaVacunacionBayauca"
- `firebase.json` - Configurado para servir archivos desde `dist/public`

### 2. CORS en Backend
El servidor Express ya está configurado para aceptar solicitudes desde:
- `http://localhost:5173` (desarrollo local)
- `http://localhost:5000` (desarrollo local)
- `https://actavacunacionbayauca.web.app` (Firebase Hosting)
- `https://actavacunacionbayauca.firebaseapp.com` (Firebase Hosting)

### 3. Configuración del Frontend
El frontend está configurado para usar la URL del backend mediante la variable de entorno `VITE_API_URL`.

## Pasos para Desplegar

### Paso 1: Publicar tu Repl en Replit

1. Ve a tu Repl en Replit
2. Haz clic en el botón **"Publish"** (Publicar) en la esquina superior derecha
3. Copia la URL pública de tu Repl (será algo como `https://nombre-repl.nombre-usuario.repl.co`)

### Paso 2: Configurar Variable de Entorno para Build

Crea un archivo `.env.production.local` en la raíz del proyecto con la URL de tu Repl:

```bash
VITE_API_URL=https://tu-repl-name.tu-usuario.repl.co
```

**Importante**: 
- Reemplaza `tu-repl-name.tu-usuario.repl.co` con la URL real de tu Repl publicado
- NO incluyas un slash final (/) en la URL
- La función `getApiUrl` elimina automáticamente el slash final si existe, pero es mejor no incluirlo

### Paso 3: Actualizar CORS si es necesario

Si tu URL de Replit es diferente a las configuradas, edita `server/index.ts` y agrega tu URL a `allowedOrigins`:

```typescript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5000',
  'https://actavacunacionbayauca.web.app',
  'https://actavacunacionbayauca.firebaseapp.com',
  'https://tu-url-de-replit.repl.co', // Agrega esta línea
];
```

### Paso 4: Build del Proyecto

En tu máquina local o en Replit:

```bash
npm run build
```

Esto generará los archivos estáticos en `dist/public`.

### Paso 5: Desplegar a Firebase

1. Instala Firebase CLI si no lo tienes:
```bash
npm install -g firebase-tools
```

2. Inicia sesión en Firebase:
```bash
firebase login
```

3. Despliega:
```bash
firebase deploy --only hosting
```

### Paso 6: Verificar

1. Visita tu sitio en Firebase: `https://actavacunacionbayauca.web.app`
2. Prueba enviar un documento
3. Verifica que el email se envíe correctamente

## Mantenimiento

### Actualizar Frontend
Cada vez que hagas cambios en el frontend:
```bash
npm run build
firebase deploy --only hosting
```

### Actualizar Backend
Los cambios en el backend se actualizan automáticamente en Replit cuando guardas los archivos.

**Nota**: Si necesitas agregar dominios adicionales a la lista de CORS (por ejemplo, un dominio personalizado), edita el array `allowedOrigins` en `server/index.ts`.

### Variables de Entorno en Replit
Las variables de entorno sensibles (como `SESSION_SECRET` y las credenciales de Resend) están configuradas en Replit Secrets y no necesitan ser modificadas.

## Solución de Problemas

### Error CORS
Si ves errores de CORS en la consola del navegador:
1. Verifica que la URL de tu Repl esté en la lista `allowedOrigins` en `server/index.ts`
2. Verifica que `VITE_API_URL` en `.env.production.local` sea correcta
3. Asegúrate de hacer rebuild del frontend después de cambiar variables de entorno

### Backend no responde
1. Verifica que tu Repl esté publicado y corriendo en Replit
2. Verifica que puedas acceder a `https://tu-repl.repl.co/api/submit-document` directamente
3. Revisa los logs en Replit

### Variables de entorno no funcionan
1. Asegúrate de que el archivo `.env.production.local` existe
2. Verifica que la variable empiece con `VITE_` (requerido por Vite)
3. Haz un build limpio: `rm -rf dist && npm run build`

## Notas Importantes

- El backend DEBE estar corriendo en Replit para que el formulario funcione
- Firebase solo sirve archivos estáticos, no ejecuta código backend
- Las credenciales de Resend están en Replit Secrets y son seguras
- No incluyas `.env.production.local` en el control de versiones (ya está en `.gitignore`)
