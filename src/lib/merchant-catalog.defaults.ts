import type { ProfileCatalogProduct } from "@/lib/merchant-catalog.types";

/** Catálogo inicial por `merchant.id` del mock (se copia al store persistido). */
export const DEFAULT_MERCHANT_CATALOGS: Record<string, ProfileCatalogProduct[]> = {
  "1": [
    {
      id: "prod-cafe-latte",
      name: "Latte mediano + croissant",
      price: 22_000,
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCTloLMqKKfztTgTK2tZ_hVAgLzl0oZp0wIWdNWYmayj8a4THcND6nmON-Wf1ni2kBiSosu59JrQsYtMbbhLjj4-ZSPTRZJExasy21hERxvPPWqKz5hs_WzPrj8sTIQuZ5eKorZYcZmTUzldlBCypDkdQ1lMPkAGxSHJ95sfhiEusHLRhTbtP86gn1UtCS8zKA9NslDQyG0zT5WgYUymv7XjAmhAYZ4WfZXtbD4nND_xKXzbVW19VorxS0uMvLQGwP6wOPBzrF6yDor",
    },
    {
      id: "prod-cafe-espresso",
      name: "Espresso doble",
      price: 12_000,
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCTloLMqKKfztTgTK2tZ_hVAgLzl0oZp0wIWdNWYmayj8a4THcND6nmON-Wf1ni2kBiSosu59JrQsYtMbbhLjj4-ZSPTRZJExasy21hERxvPPWqKz5hs_WzPrj8sTIQuZ5eKorZYcZmTUzldlBCypDkdQ1lMPkAGxSHJ95sfhiEusHLRhTbtP86gn1UtCS8zKA9NslDQyG0zT5WgYUymv7XjAmhAYZ4WfZXtbD4nND_xKXzbVW19VorxS0uMvLQGwP6wOPBzrF6yDor",
    },
  ],
  "2": [
    {
      id: "prod-verde-cesta",
      name: "Cesta pequeña de temporada",
      price: 85_000,
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC9IDhRwIf5-bLRwoILzfxB0HfoR45ebaARTX-Q998ixmAL3m7bAvZ2N7OrZA7105qlij7OpDaFRhRUS8PDEInkhBMNh6_gYOl34dMcFepJHlYJuinmIpl26oUIkPQemQxgXnxWQBcq7T15vGpexFi--hvlnC106ToPEP4aO-ilieBW3aRu5DgEA219hhqUhxhfo34sXoatmO0wAbjU-9sP4TNU4VOEync9kHGTY6cl6tpEJPNiNILYTletP7HtxcKliiGweop34_z0",
    },
    {
      id: "prod-verde-pack",
      name: "Pack productos locales (mediano)",
      price: 95_000,
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC9IDhRwIf5-bLRwoILzfxB0HfoR45ebaARTX-Q998ixmAL3m7bAvZ2N7OrZA7105qlij7OpDaFRhRUS8PDEInkhBMNh6_gYOl34dMcFepJHlYJuinmIpl26oUIkPQemQxgXnxWQBcq7T15vGpexFi--hvlnC106ToPEP4aO-ilieBW3aRu5DgEA219hhqUhxhfo34sXoatmO0wAbjU-9sP4TNU4VOEync9kHGTY6cl6tpEJPNiNILYTletP7HtxcKliiGweop34_z0",
    },
  ],
  "3": [
    {
      id: "prod-lumina-camiseta",
      name: "Camiseta básica algodón orgánico",
      price: 159_000,
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD1tXwsZ5sb8y4b1Vmlt36DokdribmL0xlVKBj7bLqfaH_PBDlWLTGF7i_18OL-CnJmgKpHrUtCNI7PT7EcZsDVN8j79oKcbokLGnd8bdmPQed-ghSUni_YH8cS_h6LHKOF0bZsbM--AXSN-5ywmLO2gPwauDXtATy2p3-LFLxfnaQ9Ap16BN07K1aSAQyO4rZJSsHFIWMTmsjI78DarGv6XiiGdGtX4QE6xqVv-3ge_aTNl3Sc-mimHdGplVQ-77zqQadtLhxCKCyZ",
    },
  ],
  "4": [
    {
      id: "prod-tostador-lote",
      name: "Lote Colombia Huila (250 g)",
      price: 42_000,
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAn6AE5OdxunC8ZKArGwHUd_ScF4oHCHuNXPaeR3yWP_Om3aEyB4fWqDL5kVIIAhrYGIttEZagIRY6BeuAOIEvP2mH_XZtP8dH2kmoGBBGTMUFNFBtorLeDHkPcM6-nGnEr65aG4FqGyZZcDNe-hrdLTcKR9xhHhma2HMkpvY6hDm19SkfMOP5sZF6q8XyJRHB036QJSAOgEy7pahu5Hk01ydoF1a9kfCrl6lrUND0gLmbQ2S1jJhHm75CPTZl0byc-gC6KRlMMi5tg",
    },
  ],
  ecovolt: [
    {
      id: "prod-ecovolt-auditoria",
      name: "Auditoría energética express",
      price: 890_000,
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuASx80IseKdicfcMFDpn6d2DheLCnbqYCF_rzfT129y8wPonZRPBp9lwmwlVAtrv81WnKjs61BVsby2UIjIdz6lH-5arWVsCXH6fp5fzB3wpLs2SwwdldI32FJ8vPeyerYJmzlqGhbFjExs6AQTTCSDCWlMhUHQauult7TbFIpI9CoxoAuVxYRVQO4EvqgfqAdJXJwSMPzRdlOFBOpnS3S39z0LuhASCxqR_ZHM9Qa_qvvBdcjy7JBiSpJfgVYfoTb_kzmACQVeBxs",
    },
  ],
  me: [
    {
      id: "prod-me-pack-inicio",
      name: "Pack bienvenida comercio",
      price: 0,
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuARN6rzeLKO5Iv0Wg4h88G6O1WaQ998V6kUzeBR-Cg1mMvve_Mc6eVYRT7B8ySKr7F4JmlA5AzHBMzvqdK4eEdA8wv8euv5zn-m5Fq2SM-cBaL_q7sZtDZ__fW7MihS9dvEtOlTuX8fZlIsaV9i3D1yKmHMSaDTy7XNBvb9sbeyweGGiFxTjqXHRVjCLsp3CN83qLi-rq_0Ky_E15Fm3bVMFahJ6vcfxgRJJMSytqOesKqCygPJ_oEKfHg0tX7yFvuG_V1N8TTKFUtd",
    },
  ],
};

function deepCloneCatalogs(): Record<string, ProfileCatalogProduct[]> {
  return JSON.parse(JSON.stringify(DEFAULT_MERCHANT_CATALOGS)) as Record<string, ProfileCatalogProduct[]>;
}

export function createInitialMerchantCatalogs(): Record<string, ProfileCatalogProduct[]> {
  return deepCloneCatalogs();
}
