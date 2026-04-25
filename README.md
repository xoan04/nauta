# Nombre del Proyecto

> Proyecto Next.js 14 · Clean Architecture · Solo frontend

---

## Credenciales de prueba

| Campo    | Valor                  |
|----------|------------------------|
| Email    | test@hackathon.dev     |
| Password | hackathon123           |

---

## Stack

| Herramienta     | Uso                              |
|-----------------|----------------------------------|
| Next.js 14      | Framework · App Router           |
| TypeScript      | Tipado estático strict           |
| Tailwind CSS    | Estilos utilitarios              |
| shadcn/ui       | Componentes UI                   |
| TanStack Query  | Fetching · caché · loading/error |
| Zustand         | Estado global de cliente         |
| Zod             | Validación de modelos y DTOs     |

---

## Arquitectura

La app sigue un patrón de capas estricto. Cada capa solo puede hablar con la capa inmediatamente inferior.

```
View (componente React)
  ↓ consume
Hook (TanStack Query)
  ↓ llama
Use Case (lógica de negocio)
  ↓ orquesta
Service (acceso a API)
  ↓ usa
http.utils (fetch centralizado)
```

### Capas y responsabilidades

**`core/http/http.utils.ts`**
Único punto de entrada a la red. Maneja headers, token, errores HTTP y parseo. Nadie más llama a `fetch` directamente.

**`core/models/`**
Interfaces Zod que definen la forma del dato. Son la única fuente de verdad del tipo. Exportan tanto el schema Zod como el tipo TypeScript inferido.

**`core/services/`**
Mapean los endpoints de la API. Reciben y devuelven tipos del modelo. No contienen lógica de negocio, solo traducen llamadas HTTP.

**`core/use-cases/`**
Lógica de negocio pura. Orquestan uno o más servicios, validan con Zod antes de enviar y transforman datos si hace falta. Son funciones async puras sin estado.

**`hooks/`**
Conectan los use-cases con React vía TanStack Query. Manejan cache, loading, error y revalidación automáticamente.

**`store/`**
Estado global de cliente (auth, UI). Usa Zustand con persist. El auth store sincroniza el token con una cookie para que el middleware lo pueda leer.

**`components/`**
Solo renderizan. No contienen lógica de fetching ni de negocio. Consumen hooks y reciben props.

---

## Middleware y autenticación

El middleware (`src/middleware.ts`) protege todas las rutas bajo `/dashboard`, `/profile` y `/settings`. Lee la cookie `auth-token` en cada request.

- Si no hay token → redirige a `/login?redirect=/ruta-original`
- Si hay token y vas a `/login` → redirige a `/dashboard`

El login actual usa un usuario mock hardcodeado en `src/lib/mock-user.ts`. Para conectar auth real, reemplaza la lógica en `src/app/(public)/login/page.tsx` y el store en `src/store/auth.store.ts`.

---

## Cómo agregar un nuevo feature

1. Crea el modelo en `core/models/[feature].model.ts`
2. Crea el service en `core/services/[feature].service.ts`
3. Crea los use-cases en `core/use-cases/[feature]/`
4. Crea el hook en `hooks/use[Feature].ts`
5. Crea los componentes en `components/features/[feature]/`

---

## Variables de entorno

Copia `.env.local.example` a `.env.local` y completa los valores:

```env
NEXT_PUBLIC_API_URL=https://api.example.com
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
