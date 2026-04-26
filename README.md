# Nauta · Perlapp

> Plataforma de comercio local — Next.js 14 · Clean Architecture · Solo frontend

---

## Credenciales de prueba

| Campo    | Valor              |
|----------|--------------------|
| Email    | test@hackathon.dev |
| Password | hackathon123       |

---

## Stack

| Herramienta    | Uso                              |
|----------------|----------------------------------|
| Next.js 14     | Framework · App Router           |
| TypeScript     | Tipado estático strict           |
| Tailwind CSS   | Estilos utilitarios              |
| shadcn/ui      | Componentes UI                   |
| TanStack Query | Fetching · caché · loading/error |
| Zustand        | Estado global de cliente         |
| Zod            | Validación de modelos y DTOs     |
| Leaflet        | Mapa interactivo (registro merchant) |

---

## Roles de usuario

La app maneja tres roles que definen lo que cada usuario puede ver y hacer:

| Rol        | Descripción                                           |
|------------|-------------------------------------------------------|
| `invitado` | Usuario no autenticado. Puede explorar y registrarse. |
| `comprador`| Buyer registrado. Puede favoritar, ver y conectar con merchants. |
| `market`   | Merchant registrado. Gestiona su tienda, productos y publicaciones. |

El rol se guarda en `perlapp-role` (localStorage) y se sincroniza desde la respuesta de login.

---

## Flujo completo

### 1. Landing (`/`)

El usuario llega a la home pública (`PerlappHome`). Desde aquí puede:
- Ir a **Explorar** (`/explorar`) — ver merchants en un mapa.
- Ir a **Login** (`/login`).
- Ir a **Registro** (`/registro`) — elegir tipo de cuenta.

---

### 2. Registro de Comprador (`/registro/comprador`)

Formulario de 3 pasos:

```
Paso 1 → Nombre
Paso 2 → Email
Paso 3 → Contraseña  →  POST /api/v1/public/buyers
                      →  Auto-login
                      →  Redirect a "/"
```

**Validación:** Zod en cada paso antes de avanzar.  
**Payload enviado:** `{ name, email, password }`  
**Al completar:** Se hace login automático, se guarda sesión y se establece rol `comprador`.

---

### 3. Registro de Merchant (`/registro/comerciante`)

Formulario de 4 pasos:

```
Paso 1 → Nombre del negocio
Paso 2 → Ubicación (mapa Leaflet — selecciona latitud/longitud)
Paso 3 → Email
Paso 4 → Contraseña  →  POST /api/v1/public/merchants
                      →  Auto-login
                      →  Redirect a "/"
```

**Validación:** Zod por paso.  
**Payload enviado:** `{ name, latitude, longitude, email, password }`  
**Al completar:** Login automático, rol `market`, `activeMarketId` guardado en store.

---

### 4. Login (`/login`)

```
Usuario ingresa email + password
  ↓
loginUseCase → loginWithEmailPassword service
  ↓
POST /api/v1/auth/login
  ↓
Respuesta: { user, access_token, refresh_token, expires_in, profiles }
  ↓
useAuthStore.loginFromApi()
  → Guarda token, user, expiresAt en "auth-storage" (localStorage)
  → Escribe cookie "auth-token" (7 días, SameSite=Lax)
  ↓
applySessionRoleFromLoginUser()
  → Mapea rol de API al rol de UI y lo guarda en "perlapp-role"
  ↓
Redirect a "/" (o al path del ?redirect= param)
```

---

### 5. Protección de rutas (Middleware)

El middleware en `src/middleware.ts` corre en cada request antes de renderizar.

**Rutas protegidas:** `/dashboard`, `/profile`, `/settings`, `/notifications`, `/perfil`

```
Request llega
  ↓
¿Ruta protegida?
  No → continúa normalmente
  Sí ↓
¿Tiene cookie "auth-token"?
  No → redirect /login?redirect=[path]
  Sí → continúa

¿Ruta es /login y tiene token?
  Sí → redirect /
```

---

### 6. Sesión y sincronización de rol

Al iniciar la app (cualquier página), el componente `AuthPerlappRoleSync` (en `Providers.tsx`) corre un `useEffect` que:

1. Espera a que el auth store hidrate desde localStorage.
2. Llama a `syncPerlappRoleFromAuthUser()` para mantener el rol de UI alineado con la sesión.

Esto garantiza que si el usuario ya estaba logueado, el rol se restaure correctamente tras un refresh.

---

### 7. Área privada (`/dashboard`, `/profile`, `/settings`)

Solo accesible con sesión activa. Usa el layout `PrivateLayout` que incluye:
- `Sidebar` con navegación principal.
- `Navbar` con información de usuario.

El dashboard muestra datos de ejemplo traídos con TanStack Query.

---

### 8. Explorar merchants (`/explorar`)

Vista pública de descubrimiento. Muestra merchants en un mapa (Leaflet).  
Los datos se obtienen con `usePublicMerchants()` → `GET /api/v1/public/merchants`.

---

### 9. Perfil de Merchant (`/merchant/[id]`)

Página pública con detalle del merchant: nombre, ubicación, productos y publicaciones.  
Datos: `GET /api/v1/merchants/{id}`

---

### 10. Conexiones B2B (`/merchant/group-invite`)

Los merchants pueden enviar y gestionar solicitudes de conexión entre ellos.  
El estado se maneja en `market-connections.store.ts` con los estados: `pendiente`, `aceptada`, `rechazada`.

---

### 11. Carrito de compras

Estado global en `cart.store.ts` (persiste en `perlapp-cart`).  
Funcionalidades: agregar, quitar, cambiar cantidad, vaciar. Un drawer se abre automáticamente al agregar un ítem.

---

### 12. Logout

```
useAuthStore.logout()
  → Limpia user, token, expiresAt de localStorage
  → Elimina cookie "auth-token"
  → resetPerlappRoleToGuest() → rol = "invitado"
  → Redirect a /login
```

---

## Arquitectura de capas

Cada capa solo habla con la inmediatamente inferior:

```
Page / Component  (React · solo renderiza)
      ↓
Hook              (TanStack Query · estado de servidor)
      ↓
Use Case          (lógica de negocio · validación Zod)
      ↓
Service           (mapea endpoints · HTTP calls)
      ↓
HttpClient        (fetch centralizado · auth header · timeout)
```

### Descripción de capas

| Capa | Carpeta | Responsabilidad |
|------|---------|-----------------|
| Vista | `app/`, `components/` | Renderiza, consume hooks, sin lógica de negocio |
| Hooks | `hooks/` | TanStack Query: cache, loading, error, revalidación |
| Use Cases | `core/use-cases/` | Orquestan servicios, validan con Zod |
| Services | `core/services/` | Un archivo por endpoint, solo HTTP |
| HTTP Client | `core/http/` | Bearer token, errores, timeout de 30s |
| Models | `core/models/` | Schemas Zod + tipos TypeScript inferidos |

---

## Estado global (Zustand stores)

| Store | Clave localStorage | Qué guarda |
|-------|--------------------|------------|
| `auth.store` | `auth-storage` | Usuario, token, expiresAt, profiles |
| `perlapp-role.store` | `perlapp-role` | Rol UI actual (`invitado`/`comprador`/`market`), activeMarketId |
| `cart.store` | `perlapp-cart` | Ítems del carrito |
| `merchant-catalog.store` | `perlapp-merchant-catalog` | Catálogo de productos por merchant |
| `buyer-activity.store` | `perlapp-buyer-activity` | Favorites, posts interactuados, conexiones |
| `market-connections.store` | `perlapp-market-connections` | Solicitudes B2B entre merchants |
| `ui.store` | `ui-storage` | Estado del sidebar |

---

## Rutas

### Públicas `/(public)`

| Ruta | Componente principal | Descripción |
|------|---------------------|-------------|
| `/` | `PerlappHome` | Landing page |
| `/explorar` | `ExplorarPageClient` | Mapa de merchants |
| `/login` | `LoginForm` | Formulario de acceso |
| `/registro` | — | Elección buyer vs merchant |
| `/registro/comprador` | `BuyerRegistrationPage` | Registro en 3 pasos |
| `/registro/comerciante` | `MerchantRegistrationPage` | Registro en 4 pasos con mapa |
| `/perfil` | `BuyerProfileView` | Perfil público comprador |
| `/merchant/[id]` | `MerchantProfilePageClient` | Detalle de merchant |
| `/merchant/group-invite` | — | Invitación de grupo B2B |
| `/notifications` | — | Notificaciones |

### Privadas `/(private)` — requieren `auth-token`

| Ruta | Descripción |
|------|-------------|
| `/dashboard` | Dashboard principal |
| `/profile` | Perfil de usuario autenticado |
| `/settings` | Configuración |

---

## Variables de entorno

```env
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_APIHACK_BASE_URL=https://apihack.kodelabs.dev
```

---

## Comandos

```bash
npm install        # instalar dependencias
npm run dev        # servidor de desarrollo → http://localhost:3000
npm run build      # build de producción
npm run lint       # linter
npm run format     # prettier
```

---

## Cómo agregar un nuevo feature

1. Define el modelo en `core/models/[feature].model.ts` (Zod schema + tipo)
2. Crea el service en `core/services/[feature].service.ts`
3. Crea el use case en `core/use-cases/[feature]/`
4. Crea el hook en `hooks/use[Feature].ts`
5. Crea los componentes en `components/[feature]/`
6. Agrega la página en `app/(public o private)/[ruta]/page.tsx`
