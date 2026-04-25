import type { MerchantProfileData } from "@/lib/merchant-profile.types";

const MERCHANTS: Record<string, MerchantProfileData> = {
  me: {
    id: "me",
    slug: "mi-comercio",
    displayName: "Mi comercio (tú)",
    handle: "@mi_comercio",
    categoryLabel: "Tu perfil de comercio",
    bio: "Así ven los clientes tu perfil público en Perlapp. Completa horarios, productos y responde mensajes desde el panel.",
    bannerUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuATAiLTs6M4S0WIKEVpvuIlE7uRlo5r4LISJs0N71SeoF43rMQz5eZxbEhP6TyO9ntlXI5P-EvxFo3iFnYL5wNPWzpEAnwCcPcW8llSutx_0K-vrGaqEAieLFQ5wCg7WnNqkwBG1okV-sR84aCEOY8EniaVNPLTCnizbzj_mV5GXEd9oMANjdwZtG8sp3Y8bJvecdY-s0laqmyC4x-8v0jwJUcQMS2yrvJzd8hd7NybufFxnheV35qDWyaX5F7jVnS8Il33ng7gFhpj",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuARN6rzeLKO5Iv0Wg4h88G6O1WaQ998V6kUzeBR-Cg1mMvve_Mc6eVYRT7B8ySKr7F4JmlA5AzHBMzvqdK4eEdA8wv8euv5zn-m5Fq2SM-cBaL_q7sZtDZ__fW7MihS9dvEtOlTuX8fZlIsaV9i3D1yKmHMSaDTy7XNBvb9sbeyweGGiFxTjqXHRVjCLsp3CN83qLi-rq_0Ky_E15Fm3bVMFahJ6vcfxgRJJMSytqOesKqCygPJ_oEKfHg0tX7yFvuG_V1N8TTKFUtd",
    location: "Tu ciudad",
    websiteLabel: "perlapp.app",
    websiteHref: "https://perlapp.app",
    joinedLabel: "Desde siempre",
    followingCount: "48",
    followersCount: "320",
    verified: false,
    infoExtra:
      "Horario: L–V 9:00–18:00 · Envíos locales · Pagos con tarjeta y Bizum. Esta vista usa datos de demostración.",
    posts: [
      {
        id: "m1",
        body: "¡Bienvenidos a nuestro perfil! Aquí publicamos novedades, menús y promociones.",
        timeAgo: "3 h",
        stats: { comments: 2, reposts: 0, likes: 15, views: "210" },
      },
    ],
  },
  ecovolt: {
    id: "ecovolt",
    slug: "ecovoltsol",
    displayName: "EcoVolt Solutions",
    handle: "@ecovoltsol",
    categoryLabel: "Proveedor de Energía",
    bio: "Soluciones energéticas sostenibles para empresas modernas. Optimizando tu consumo con tecnología inteligente y fuentes renovables. ☀️🌊",
    bannerUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuATAiLTs6M4S0WIKEVpvuIlE7uRlo5r4LISJs0N71SeoF43rMQz5eZxbEhP6TyO9ntlXI5P-EvxFo3iFnYL5wNPWzpEAnwCcPcW8llSutx_0K-vrGaqEAieLFQ5wCg7WnNqkwBG1okV-sR84aCEOY8EniaVNPLTCnizbzj_mV5GXEd9oMANjdwZtG8sp3Y8bJvecdY-s0laqmyC4x-8v0jwJUcQMS2yrvJzd8hd7NybufFxnheV35qDWyaX5F7jVnS8Il33ng7gFhpj",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuARN6rzeLKO5Iv0Wg4h88G6O1WaQ998V6kUzeBR-Cg1mMvve_Mc6eVYRT7B8ySKr7F4JmlA5AzHBMzvqdK4eEdA8wv8euv5zn-m5Fq2SM-cBaL_q7sZtDZ__fW7MihS9dvEtOlTuX8fZlIsaV9i3D1yKmHMSaDTy7XNBvb9sbeyweGGiFxTjqXHRVjCLsp3CN83qLi-rq_0Ky_E15Fm3bVMFahJ6vcfxgRJJMSytqOesKqCygPJ_oEKfHg0tX7yFvuG_V1N8TTKFUtd",
    location: "Valencia, España",
    websiteLabel: "ecovolt.es",
    websiteHref: "https://ecovolt.es",
    joinedLabel: "Unido en Marzo 2021",
    followingCount: "1.2k",
    followersCount: "14.5k",
    verified: true,
    infoExtra:
      "Especialistas en auditorías energéticas, monitorización en tiempo real y contratos PPA para empresas medianas y grandes.",
    posts: [
      {
        id: "e1",
        body: "¡Nueva actualización de nuestra plataforma! 🚀 Ahora puedes monitorear tu consumo en tiempo real con una precisión del 99%. Revisa tu panel principal para ver los nuevos gráficos.",
        imageUrl:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuASx80IseKdicfcMFDpn6d2DheLCnbqYCF_rzfT129y8wPonZRPBp9lwmwlVAtrv81WnKjs61BVsby2UIjIdz6lH-5arWVsCXH6fp5fzB3wpLs2SwwdldI32FJ8vPeyerYJmzlqGhbFjEx4s6AQTTCSDCWlMhUHQauult7TbFIpI9CoxoAuVxYRVQO4EvqgfqAdJXJwSMPzRdlOFBOpnS3S39z0LuhASCxqR_ZHM9Qa_qvvBdcjy7JBiSpJfgVYfoTb_kzmACQVeBxs",
        imageAlt: "Panel con gráficos de consumo energético",
        timeAgo: "2 h",
        stats: { comments: 24, reposts: 5, likes: 142, views: "4.2k" },
      },
      {
        id: "e2",
        body: "¿Sabías que optimizar la climatización en tu oficina puede reducir los costos energéticos hasta un 20%? Descubre nuestros nuevos planes corporativos. 🌿🏢",
        timeAgo: "1 d",
        stats: { comments: 12, reposts: 2, likes: 89, views: "1.8k" },
      },
    ],
  },
  "1": {
    id: "1",
    slug: "cafe-aurora",
    displayName: "Café Aurora",
    handle: "@cafeaurora",
    categoryLabel: "Coffee & Bakery",
    bio: "Café de especialidad y pastelería artesanal en el barrio. Tostado propio y ingredientes locales.",
    bannerUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD1hvNc74IgGa5QVkSwy2X-xkmdxfQzkE9UlbFi7cQ8dT2c7kGfgtQjZrxaM8s9vaS5buyMeBlzYAaJQlRwbJuTUeBSjMxteLeG1eC6S6kAaGKzjCLglkt0C5qejLrILwPU2uwumy6WCbFg94w6YabztRu6EgqsX1lh7880iSsdHnk-FAdIinxwjm_jZaWLocSEHpTgEG2eCnqAOVvqTyjEYrlT_kHSvT0KU6bvpQ7M-gWNEsnD0BcH4ulZnJBk0FR7PuABno05mCFN",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuABv_K-Uym0OFG1M-AdF5BWNnufefVEpInxEob_vvoPzE0OG0ruPO791yJ0v-v5ZmJ9JWWOnQ13Urod8lKKMaNWT63YdG9EutUS8RLECDCcYsEqI1dbkLcxy_fA8LR_AtJn12ojbUGrhiAHxmp-ln4Hd1aRJLOzFaRxVAEVmfJMRWYJ-DEsu2SMiSL_DrACltdqytZp_4Gm_nkKilpos1zBxMUfKZwF3bh5f_cAalVorbVStwO-ziDkGJQ9MaO2_zQ-nQdxecr8RIyi",
    location: "Madrid, España",
    websiteLabel: "cafeaurora.es",
    websiteHref: "https://example.com",
    joinedLabel: "Unido en Enero 2023",
    followingCount: "120",
    followersCount: "3.4k",
    verified: true,
    posts: [
      {
        id: "c1",
        body: "¡Nuevo Menú de Otoño! 🍂 Ven y prueba nuestro Latte de Calabaza. 20% de descuento si muestras esta publicación en caja.",
        imageUrl:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCTloLMqKKfztTgTK2tZ_hVAgLzl0oZp0wIWdNWYmayj8a4THcND6nmON-Wf1ni2kBiSosu59JrQsYtMbbhLjj4-ZSPTRZJExasy21hERxvPPWqKz5hs_WzPrj8sTIQuZ5eKorZYcZmTUzldlBCypDkdQ1lMPkAGxSHJ95sfhiEusHLRhTbtP86gn1UtCS8zKA9NslDQyG0zT5WgYUymv7XjAmhAYZ4WfZXtbD4nND_xKXzbVW19VorxS0uMvLQGwP6wOPBzrF6yDor",
        imageAlt: "Latte art y croissant",
        timeAgo: "2 h",
        stats: { comments: 18, reposts: 4, likes: 96, views: "2.1k" },
      },
    ],
  },
  "2": {
    id: "2",
    slug: "verde-market",
    displayName: "Verde Market",
    handle: "@verdemarket",
    categoryLabel: "Fresh Groceries",
    bio: "Producto fresco, ecológico y de proximidad. Apoyamos a agricultores de la zona.",
    bannerUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDrpytgM2BgY_nUjzDUvl9vzS5jtJsZHSg3Z5BUtmtEkKMhBbWGZN5K3Pcu78qlIBkEBhrVoNFLvOO0YYQd3B0-Pqkqy4lfszzQHuor6GC5MdFCLTJK2K-CqZS9TaoY-oy9r3qmduwuoOTVak1_k4PfpMGhYfC4zapfbi0CfjJ9TBcra_Y9rSe_-8opUuxj545EqdQ18W-oevB3jjJ0mdHQkAcM_sZ7OzfqfaKPxPY-5UsNWutSXkfFxZou52Z-gTxAZtstO-UOBkZJ",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC4JiI9mqtYL9ypZO883JqAKfwLzdQEHXkXF77tcru_s0UXGcmcxgoUq9D8nJnWwWVnb6R9gQkRuezR8lGyplPD__lOXyrb-01kQfbbUkJ9NuhB1k4kbaUSWcW7O7ZFiY7pPvvZBLSfyJfxS4ftZunJ0iNDsX4EZSiPUdPuVXUSW3HXOpgQb1wjJuuN7qh1c5F-qhMP-jAVjoD3cOqFo2HYUxxpuwMwxbmDDpdZxt8ii_sf7ZGs8sOYq8-f47scx-FwHnI00Ul73823",
    location: "Barcelona, España",
    websiteLabel: "verdemarket.com",
    websiteHref: "https://example.com",
    joinedLabel: "Unido en Mayo 2022",
    followingCount: "89",
    followersCount: "8.1k",
    verified: false,
    posts: [
      {
        id: "v1",
        body: "Llegaron los productos locales 🍅 Tomates de herencia, lechugas hidropónicas y más.",
        imageUrl:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuC9IDhRwIf5-bLRwoILzfxB0HfoR45ebaARTX-Q998ixmAL3m7bAvZ2N7OrZA7105qlij7OpDaFRhRUS8PDEInkhBMNh6_gYOl34dMcFepJHlYJuinmIpl26oUIkPQemQxgXnxWQBcq7T15vGpexFi--hvlnC106ToPEP4aO-ilieBW3aRu5DgEA219hhqUhxhfo34sXoatmO0wAbjU-9sP4TNU4VOEync9kHGTY6cl6tpEJPNiNILYTletP7HtxcKliiGweop34_z0",
        imageAlt: "Verduras orgánicas",
        timeAgo: "1 d",
        stats: { comments: 9, reposts: 1, likes: 54, views: "980" },
      },
    ],
  },
  "4": {
    id: "4",
    slug: "tostador-local",
    displayName: "Tostador local",
    handle: "@tostadorlocal",
    categoryLabel: "Café en grano",
    bio: "Tueste artesanal y venta al por menor. Origen único y lotes pequeños.",
    bannerUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAn6AE5OdxunC8ZKArGwHUd_ScF4oHCHuNXPaeR3yWP_Om3aEyB4fWqDL5kVIIAhrYGIttEZagIRY6BeuAOIEvP2mH_XZtP8dH2kmoGBBGTMUFNFBtorLeDHkPcM6-nGnEr65aG4FqGyZZcDNe-hrdLTcKR9xhHhma2HMkpvY6hDm19SkfMOP5sZF6q8XyJRHB036QJSAOgEy7pahu5Hk01ydoF1a9kfCrl6lrUND0gLmbQ2S1jJhHm75CPTZl0byc-gC6KRlMMi5tg",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAn6AE5OdxunC8ZKArGwHUd_ScF4oHCHuNXPaeR3yWP_Om3aEyB4fWqDL5kVIIAhrYGIttEZagIRY6BeuAOIEvP2mH_XZtP8dH2kmoGBBGTMUFNFBtorLeDHkPcM6-nGnEr65aG4FqGyZZcDNe-hrdLTcKR9xhHhma2HMkpvY6hDm19SkfMOP5sZF6q8XyJRHB036QJSAOgEy7pahu5Hk01ydoF1a9kfCrl6lrUND0gLmbQ2S1jJhHm75CPTZl0byc-gC6KRlMMi5tg",
    location: "Valencia, España",
    websiteLabel: "instagram.com/tostador",
    websiteHref: "https://instagram.com",
    joinedLabel: "Unido en Febrero 2025",
    followingCount: "34",
    followersCount: "890",
    verified: false,
    posts: [
      {
        id: "t1",
        body: "Nuevo lote Colombia Huila — notas a chocolate y caramelo. Ya en tienda.",
        timeAgo: "6 h",
        stats: { comments: 4, reposts: 1, likes: 42, views: "560" },
      },
    ],
  },
  "3": {
    id: "3",
    slug: "lumina-threads",
    displayName: "Lumina Threads",
    handle: "@luminathreads",
    categoryLabel: "Apparel",
    bio: "Moda consciente y diseños atemporales. Telas orgánicas y producción ética.",
    bannerUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD1tXwsZ5sb8y4b1Vmlt36DokdribmL0xlVKBj7bLqfaH_PBDlWLTGF7i_18OL-CnJmgKpHrUtCNI7PT7EcZsDVN8j79oKcbokLGnd8bdmPQed-ghSUni_YH8cS_h6LHKOF0bZsbM--AXSN-5ywmLO2gPwauDXtATy2p3-LFLxfnaQ9Ap16BN07K1aSAQyO4rZJSsHFIWMTmsjI78DarGv6XiiGdGtX4QE6xqVv-3ge_aTNl3Sc-mimHdGplVQ-77zqQadtLhxCKCyZ",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD1tXwsZ5sb8y4b1Vmlt36DokdribmL0xlVKBj7bLqfaH_PBDlWLTGF7i_18OL-CnJmgKpHrUtCNI7PT7EcZsDVN8j79oKcbokLGnd8bdmPQed-ghSUni_YH8cS_h6LHKOF0bZsbM--AXSN-5ywmLO2gPwauDXtATy2p3-LFLxfnaQ9Ap16BN07K1aSAQyO4rZJSsHFIWMTmsjI78DarGv6XiiGdGtX4QE6xqVv-3ge_aTNl3Sc-mimHdGplVQ-77zqQadtLhxCKCyZ",
    location: "Sevilla, España",
    websiteLabel: "luminathreads.shop",
    websiteHref: "https://example.com",
    joinedLabel: "Unido en Septiembre 2024",
    followingCount: "210",
    followersCount: "1.2k",
    verified: false,
    posts: [
      {
        id: "l1",
        body: "Nueva colección cápsula: tonos tierra y cortes oversize. Disponible en tienda y envío 48h.",
        timeAgo: "4 h",
        stats: { comments: 6, reposts: 3, likes: 201, views: "3.4k" },
      },
    ],
  },
};

const ALIASES: Record<string, string> = {
  ecovoltsol: "ecovolt",
};

export function resolveMerchantProfileId(raw: string): string | undefined {
  const key = raw.trim().toLowerCase();
  const resolved = ALIASES[key] ?? key;
  return MERCHANTS[resolved] ? resolved : undefined;
}

export function getMerchantProfileById(rawId: string): MerchantProfileData | undefined {
  const id = resolveMerchantProfileId(rawId);
  if (!id) return undefined;
  return MERCHANTS[id];
}

export function listMerchantProfileIds(): string[] {
  return Object.keys(MERCHANTS);
}
