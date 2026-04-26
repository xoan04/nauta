# Documentación Técnica — Nauta · Perlapp

> Plataforma de comercio local que conecta compradores con comerciantes de su zona.

---

## 1. Cómo funciona la solución

Nauta (Perlapp) es una **aplicación web frontend** construida con Next.js 14 que consume una API REST externa. Permite a usuarios registrarse como **compradores** o **comerciantes (merchants)**, explorar negocios locales en un mapa interactivo, gestionar productos y publicaciones, y conectar entre sí mediante un sistema de conexiones B2B.

### Flujo completo

```
┌─────────────┐
│  Landing /  │──▶ Explorar (mapa) ──▶ Perfil de merchant
│             │──▶ Login
│             │──▶ Registro (comprador / comerciante)
└─────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│                     Registro                             │
│                                                          │
│  Comprador (3 pasos)         Comerciante (4 pasos)       │
│  Nombre → Email → Password   Nombre → Ubicación (mapa)  │
│                               → Email → Password         │
│                                                          │
│  POST /api/v1/public/buyers   POST /api/v1/public/       │
│                                     merchants            │
│  → Auto-login → Redirect /    → Auto-login → Redirect /  │
└──────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│                       Login                              │
│                                                          │
│  Email + Password → POST /api/v1/auth/login              │
│  Respuesta: { user, access_token, refresh_token,         │
│               expires_in, profiles }                     │
│                                                          │
│  → Guarda token en localStorage ("auth-storage")         │
│  → Escribe cookie "auth-token" (7 días, SameSite=Lax)   │
│  → Sincroniza rol de UI en "perlapp-role"                │
│  → Redirect a "/" o al path de ?redirect=                │
└──────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│               Área autenticada                           │
│                                                          │
│  /dashboard    → Panel principal (datos con TanStack Q.) │
│  /profile      → Perfil del usuario autenticado          │
│  /settings     → Configuración                           │
│  /explorar     → Mapa interactivo de merchants (Leaflet) │
│  /merchant/[id]→ Detalle público de un merchant          │
│  /perfil       → Perfil público del comprador            │
│  /notifications→ Notificaciones                          │
│  Carrito       → Drawer lateral, pedido vía WhatsApp     │
└──────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│                     Logout                               │
│                                                          │
│  Limpia localStorage y cookie → Rol = "invitado"         │
│  → Redirect a /login                                     │
└──────────────────────────────────────────────────────────┘
```

### Roles de usuario

| Rol         | Descripción                                                                     |
|-------------|---------------------------------------------------------------------------------|
| `invitado`  | Usuario no autenticado. Puede explorar merchants y registrarse.                 |
| `comprador` | Buyer registrado. Puede favoritar, ver perfiles y conectar con merchants.       |
| `market`    | Merchant registrado. Gestiona su tienda, productos, publicaciones y conexiones. |

El rol se persiste en `localStorage` bajo la clave `perlapp-role` y se sincroniza automáticamente desde la respuesta de login mediante el componente `AuthPerlappRoleSync`.

### Protección de rutas

El middleware de Next.js (`src/middleware.ts`) intercepta cada request:

- **Rutas protegidas** (`/dashboard`, `/profile`, `/settings`, `/notifications`, `/perfil`): si no hay cookie `auth-token`, redirige a `/login?redirect=[path]`.
- **Ruta `/login`** con token válido: redirige a `/`.

---

## 2. Stack tecnológico

| Tecnología         | Versión   | Uso                                                              |
|--------------------|-----------|------------------------------------------------------------------|
| **Next.js**        | 14.2.35   | Framework React con App Router, SSR y middleware                 |
| **React**          | ^18.2.0   | Librería de UI                                                   |
| **TypeScript**     | ^5        | Tipado estático strict en todo el proyecto                       |
| **Tailwind CSS**   | ^3.4.1    | Estilos utilitarios y diseño responsive                          |
| **shadcn/ui**      | —         | Componentes UI pre-construidos (Radix UI + Tailwind)             |
| **TanStack Query** | ^5.62.8   | Fetching de datos, caché, estados de loading/error               |
| **Zustand**        | ^5.0.2    | Estado global del cliente (auth, carrito, rol, UI)               |
| **Zod**            | ^3.24.1   | Validación de schemas y DTOs en runtime                          |
| **Leaflet**        | ^1.9.4    | Mapa interactivo para explorar y registrar merchants             |
| **react-leaflet**  | ^4.2.1    | Bindings React para Leaflet                                      |
| **react-hook-form**| ^7.53.0   | Gestión de formularios con validación integrada                  |
| **Lucide React**   | ^0.468.0  | Iconos SVG                                                       |
| **Prettier**       | ^3.4.2    | Formateo de código                                               |
| **ESLint**         | ^8        | Linter (con `eslint-config-next`)                                |
| **PostCSS**        | ^8        | Procesamiento de CSS (requerido por Tailwind)                    |
| **Autoprefixer**   | ^10.4.20  | Prefijos CSS automáticos para compatibilidad cross-browser       |

---

## 3. Herramientas y servicios de terceros

### API Backend — Kodelabs Apihack

| Servicio                           | URL base                             | Descripción                                      |
|------------------------------------|--------------------------------------|--------------------------------------------------|
| **Apihack API**                    | `https://apihack.kodelabs.dev`       | Backend REST principal para auth, merchants, buyers, productos, publicaciones y conexiones B2B |
| **Apihack S3 (imágenes)**         | `https://s3hack.kodelabs.dev`        | Almacenamiento de imágenes (fotos de productos, perfiles, etc.)  |

#### Endpoints principales consumidos

| Método | Endpoint                                | Uso                                     |
|--------|----------------------------------------|-----------------------------------------|
| POST   | `/api/v1/auth/login`                   | Autenticación (email + password)        |
| POST   | `/api/v1/public/buyers`                | Registro de comprador                   |
| POST   | `/api/v1/public/merchants`             | Registro de merchant                    |
| GET    | `/api/v1/public/merchants`             | Listado público de merchants            |
| GET    | `/api/v1/merchants/{id}`               | Detalle de un merchant                  |
| GET    | `/api/v1/merchants/{id}/products`      | Productos de un merchant                |
| GET    | `/api/v1/merchants/{id}/posts`         | Publicaciones de un merchant            |
| POST   | `/api/v1/merchants/{id}/products`      | Crear producto                          |
| PUT    | `/api/v1/merchants/{id}/products/{id}` | Actualizar producto                     |
| DELETE | `/api/v1/merchants/{id}/products/{id}` | Eliminar producto                       |
| POST   | `/api/v1/merchants/{id}/posts`         | Crear publicación                       |
| PUT    | `/api/v1/merchants/{id}/posts/{id}`    | Actualizar publicación                  |
| DELETE | `/api/v1/merchants/{id}/posts/{id}`    | Eliminar publicación                    |
| GET    | `/api/v1/public/merchants/nearby`      | Merchants cercanos por geolocalización  |
| GET    | `/api/v1/feed`                         | Feed de publicaciones                   |

### WhatsApp (pedidos)

El carrito de compras genera un enlace de WhatsApp (`https://wa.me/...`) con el resumen del pedido. El número de destino se configura mediante la variable de entorno `NEXT_PUBLIC_WHATSAPP_ORDER_NUMBER`.

### Leaflet / OpenStreetMap

Los mapas interactivos utilizan **Leaflet** con tiles de **OpenStreetMap** para:
- Explorar merchants en `/explorar`
- Seleccionar ubicación durante el registro de merchants

### Google User Content

El proyecto permite cargar imágenes desde `lh3.googleusercontent.com` (perfiles de Google) configurado en `next.config.mjs`.

---

## 4. Arquitectura

### Arquitectura de capas (Clean Architecture)

El proyecto sigue una **arquitectura por capas** donde cada capa solo se comunica con la inmediatamente inferior:

```
┌────────────────────────────────────────────────────────────────┐
│                     Vista (Presentación)                       │
│         src/app/   ·   src/components/                         │
│  Páginas y componentes React — solo renderizado, sin lógica    │
│  de negocio. Consume hooks para obtener datos.                 │
└───────────────────────────┬────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────────┐
│                    Hooks (Estado de servidor)                   │
│                      src/hooks/                                │
│  TanStack Query: caché, loading, error, revalidación.          │
│  Conecta la vista con los use cases.                           │
└───────────────────────────┬────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────────┐
│                  Use Cases (Lógica de negocio)                  │
│                  src/core/use-cases/                            │
│  Orquestan servicios, validan datos con Zod, aplican reglas    │
│  de negocio.                                                   │
└───────────────────────────┬────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────────┐
│                   Services (Acceso a datos)                     │
│                  src/core/services/                             │
│  Un archivo por endpoint. Solo realizan llamadas HTTP.          │
└───────────────────────────┬────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────────┐
│                     HTTP Client (Transporte)                    │
│                     src/core/http/                              │
│  Cliente fetch centralizado: Bearer token automático,           │
│  manejo de errores, timeout de 30 s.                           │
└────────────────────────────────────────────────────────────────┘
```

### Estructura de carpetas

```
src/
├── app/                          # Páginas (App Router de Next.js)
│   ├── (public)/                 # Rutas públicas
│   │   ├── explorar/             #   Mapa de merchants
│   │   ├── login/                #   Formulario de login
│   │   ├── registro/             #   Registro (comprador / comerciante)
│   │   ├── merchant/[id]/        #   Perfil público de merchant
│   │   ├── merchant/group-invite/#   Conexiones B2B
│   │   ├── merchant/journey/     #   Journey del merchant
│   │   ├── perfil/               #   Perfil público comprador
│   │   └── notifications/        #   Notificaciones
│   └── (private)/                # Rutas protegidas (requieren auth-token)
│       ├── dashboard/            #   Panel principal
│       ├── profile/              #   Perfil autenticado
│       └── settings/             #   Configuración
│
├── components/                   # Componentes React reutilizables
│   ├── auth/                     #   Login, registro
│   ├── buyer/                    #   Componentes del comprador
│   ├── cart/                     #   Carrito de compras
│   ├── explorar/                 #   Mapa y listado de merchants
│   ├── home/                     #   Landing page
│   ├── layout/                   #   Sidebar, Navbar, PrivateLayout
│   ├── merchant/                 #   Perfil, productos, publicaciones
│   ├── notifications/            #   Sistema de notificaciones
│   ├── perlapp/                  #   Componentes específicos de Perlapp
│   ├── shared/                   #   Componentes compartidos
│   └── ui/                       #   Componentes base (shadcn/ui)
│
├── core/                         # Lógica de negocio y acceso a datos
│   ├── http/                     #   HttpClient centralizado
│   ├── models/                   #   Schemas Zod + tipos TypeScript
│   ├── services/                 #   Servicios HTTP (un archivo por endpoint)
│   └── use-cases/                #   Casos de uso por dominio
│       ├── auth/                 #     Login
│       ├── buyer/                #     Registro de comprador
│       ├── master/               #     Datos maestros
│       ├── merchant/             #     Operaciones de merchant
│       └── example/              #     Ejemplo base
│
├── hooks/                        # Custom hooks (TanStack Query)
├── lib/                          # Utilidades (cn, helpers)
├── providers/                    # Providers de React (Query, Auth sync)
├── store/                        # Zustand stores (estado global)
├── styles/                       # Estilos globales (CSS/SCSS)
├── types/                        # Tipos TypeScript compartidos
└── middleware.ts                 # Middleware de protección de rutas
```

### Estado global (Zustand stores)

| Store                        | Clave localStorage             | Qué guarda                                         |
|------------------------------|--------------------------------|-----------------------------------------------------|
| `auth.store`                 | `auth-storage`                 | Usuario, token, expiresAt, profiles                 |
| `perlapp-role.store`         | `perlapp-role`                 | Rol de UI (`invitado` / `comprador` / `market`), activeMarketId |
| `cart.store`                 | `perlapp-cart`                 | Ítems del carrito de compras                        |
| `merchant-catalog.store`     | `perlapp-merchant-catalog`     | Catálogo de productos por merchant                  |
| `buyer-activity.store`       | `perlapp-buyer-activity`       | Favoritos, posts interactuados, conexiones          |
| `market-connections.store`   | `perlapp-market-connections`   | Solicitudes de conexión B2B entre merchants         |
| `ui.store`                   | `ui-storage`                   | Estado del sidebar (abierto/cerrado)                |

### HTTP Client

El cliente HTTP centralizado (`src/core/http/http-client.ts`) proporciona:

- **Bearer token automático**: inyecta el `Authorization` header en cada petición autenticada.
- **Timeout de 30 segundos** usando `AbortSignal.timeout`.
- **Manejo de errores** estructurado: parsea respuestas de error JSON y lanza `HttpError` con status y mensaje.
- **Query params**: serialización automática de parámetros de consulta.

---

## 5. Cómo correr el proyecto localmente

### Prerrequisitos

- **Node.js** ≥ 18 (recomendado: LTS)
- **npm** (incluido con Node.js)

### Pasos

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/xoan04/nauta.git
   cd nauta
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   Copiar el archivo de ejemplo y ajustar si es necesario:

   ```bash
   cp .env.local.example .env.local
   ```

   Variables disponibles:

   | Variable                           | Valor por defecto                    | Descripción                                        |
   |------------------------------------|--------------------------------------|----------------------------------------------------|
   | `NEXT_PUBLIC_API_URL`              | `https://jsonplaceholder.typicode.com` | URL de API pública de ejemplo                    |
   | `NEXT_PUBLIC_APIHACK_BASE_URL`     | `https://apihack.kodelabs.dev`       | Backend Perlapp (registro, auth, merchants, etc.)  |
   | `NEXT_PUBLIC_WHATSAPP_ORDER_NUMBER`| *(vacío)*                            | Número de WhatsApp para pedidos (formato internacional) |

4. **Iniciar el servidor de desarrollo**

   ```bash
   npm run dev
   ```

   La aplicación estará disponible en **http://localhost:3000**.

5. **Credenciales de prueba**

   | Campo    | Valor              |
   |----------|--------------------|
   | Email    | `test@hackathon.dev` |
   | Password | `hackathon123`     |

### Otros comandos útiles

| Comando            | Descripción                              |
|--------------------|------------------------------------------|
| `npm run build`    | Genera el build de producción            |
| `npm run start`    | Inicia el servidor de producción         |
| `npm run lint`     | Ejecuta el linter (ESLint)               |
| `npm run format`   | Formatea el código con Prettier          |
