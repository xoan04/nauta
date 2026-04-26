# Nauta · Perlapp

Plataforma de comercio local que conecta compradores con comerciantes de su zona.

---

## ¿Qué hace esta app?

Nauta (Perlapp) es un frontend web hecho con Next.js que permite:

- Registro y login de compradores y comerciantes.
- Explorar comercios cercanos en mapa.
- Ver perfiles públicos de comercios.
- Crear y gestionar productos y publicaciones.
- Flujo de onboarding para comerciantes por etapas.

---

## Instalación local

### Requisitos

- Node.js 18 o superior.
- npm.

### Pasos

1. Clona el repositorio:

```bash
git clone https://github.com/xoan04/nauta.git
cd nauta
```

2. Instala dependencias:

```bash
npm install
```

3. Crea variables de entorno:

```bash
cp .env.local.example .env.local
```

4. Verifica o ajusta estas variables:

```env
NEXT_PUBLIC_API_URL=https://jsonplaceholder.typicode.com
NEXT_PUBLIC_APIHACK_BASE_URL=https://apihack.kodelabs.dev
NEXT_PUBLIC_WHATSAPP_ORDER_NUMBER=
```

5. Ejecuta en desarrollo:

```bash
npm run dev
```

La app queda disponible en `http://localhost:3000`.

---

## Comandos útiles

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run format
```

---

## Roles de usuario

| Rol | Qué puede hacer |
| --- | --- |
| `invitado` | Explorar comercios y registrarse |
| `comprador` | Ver perfiles, favoritar y conectar |
| `market` | Gestionar su negocio, productos y publicaciones |

---

## Journey de comerciante (5 etapas)

El onboarding del comerciante se completa en 5 pasos:

1. **Datos básicos del negocio**  
   Nombre del negocio, tipo de operación, documento y fotos opcionales.

2. **Actividad del negocio (Navegante CIIU)**  
   El comerciante escribe a qué se dedica y el sistema clasifica automáticamente su sector económico.  
   Actualmente se envía el código CIIU fijo como `"1"`.

3. **Ubicación**  
   Municipio y dirección del negocio.

4. **Información financiera**  
   Activos, ingresos y cantidad de empleados.

5. **Contacto y apoyo**  
   Teléfono, correo y si desea apoyo en ventas o financiamiento.

---

## Publicaciones con IA

En crear publicación existe el botón **"Mejorar descripción con IA"**:

- Se envía una imagen (jpg/png/etc.).
- Se puede enviar descripción opcional.
- La IA retorna una descripción mejorada.
- El texto del formulario se reemplaza automáticamente con esa versión.

---

## Endpoints clave que consume el frontend

- `POST /api/v1/auth/login`
- `POST /api/v1/public/buyers`
- `POST /api/v1/public/merchants`
- `GET /api/v1/public/merchants`
- `GET /api/v1/merchants/{id}`
- `POST /api/v1/merchant/classify-commerce`
- `POST /api/v1/merchant/posts/improve-description`
- `GET /api/v1/feed`

Base principal: `https://apihack.kodelabs.dev`

---

## Stack principal

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- TanStack Query
- Zustand
- Zod
- Leaflet

---

## Arquitectura (resumen)

El proyecto sigue una separación por capas:

1. `app/` y `components/` (UI)
2. `hooks/` (estado de servidor con TanStack Query)
3. `core/use-cases/` (reglas de negocio)
4. `core/services/` (llamadas HTTP)
5. `core/http/` (cliente HTTP centralizado)

---

## Referencia técnica completa

Para ver el detalle completo (arquitectura, stores, rutas, endpoints y flujos), revisa:

- `docs/documentacion.md`
