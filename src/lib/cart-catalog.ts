/**
 * Catálogo mínimo para demo del carrito (comercios y publicaciones del home).
 * Sustituir por respuesta de API.
 */

export type CatalogProduct = {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  merchantId: string;
  merchantName: string;
};

export const MERCHANT_FEATURED: Record<string, CatalogProduct> = {
  "1": {
    productId: "prod-cafe-latte",
    name: "Latte mediano + croissant",
    price: 22000,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCTloLMqKKfztTgTK2tZ_hVAgLzl0oZp0wIWdNWYmayj8a4THcND6nmON-Wf1ni2kBiSosu59JrQsYtMbbhLjj4-ZSPTRZJExasy21hERxvPPWqKz5hs_WzPrj8sTIQuZ5eKorZYcZmTUzldlBCypDkdQ1lMPkAGxSHJ95sfhiEusHLRhTbtP86gn1UtCS8zKA9NslDQyG0zT5WgYUymv7XjAmhAYZ4WfZXtbD4nND_xKXzbVW19VorxS0uMvLQGwP6wOPBzrF6yDor",
    merchantId: "1",
    merchantName: "Café Aurora",
  },
  "2": {
    productId: "prod-verde-cesta",
    name: "Cesta pequeña de temporada",
    price: 85000,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC9IDhRwIf5-bLRwoILzfxB0HfoR45ebaARTX-Q998ixmAL3m7bAvZ2N7OrZA7105qlij7OpDaFRhRUS8PDEInkhBMNh6_gYOl34dMcFepJHlYJuinmIpl26oUIkPQemQxgXnxWQBcq7T15vGpexFi--hvlnC106ToPEP4aO-ilieBW3aRu5DgEA219hhqUhxhfo34sXoatmO0wAbjU-9sP4TNU4VOEync9kHGTY6cl6tpEJPNiNILYTletP7HtxcKliiGweop34_z0",
    merchantId: "2",
    merchantName: "Verde Market",
  },
  "3": {
    productId: "prod-lumina-camiseta",
    name: "Camiseta básica algodón orgánico",
    price: 159000,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD1tXwsZ5sb8y4b1Vmlt36DokdribmL0xlVKBj7bLqfaH_PBDlWLTGF7i_18OL-CnJmgKpHrUtCNI7PT7EcZsDVN8j79oKcbokLGnd8bdmPQed-ghSUni_YH8cS_h6LHKOF0bZsbM--AXSN-5ywmLO2gPwauDXtATy2p3-LFLxfnaQ9Ap16BN07K1aSAQyO4rZJSsHFIWMTmsjI78DarGv6XiiGdGtX4QE6xqVv-3ge_aTNl3Sc-mimHdGplVQ-77zqQadtLhxCKCyZ",
    merchantId: "3",
    merchantName: "Lumina Threads",
  },
};

export const POST_PRODUCTS: Record<string, CatalogProduct> = {
  "1": {
    productId: "prod-cafe-otoño",
    name: "Menú otoño — Latte de calabaza",
    price: 18000,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCTloLMqKKfztTgTK2tZ_hVAgLzl0oZp0wIWdNWYmayj8a4THcND6nmON-Wf1ni2kBiSosu59JrQsYtMbbhLjj4-ZSPTRZJExasy21hERxvPPWqKz5hs_WzPrj8sTIQuZ5eKorZYcZmTUzldlBCypDkdQ1lMPkAGxSHJ95sfhiEusHLRhTbtP86gn1UtCS8zKA9NslDQyG0zT5WgYUymv7XjAmhAYZ4WfZXtbD4nND_xKXzbVW19VorxS0uMvLQGwP6wOPBzrF6yDor",
    merchantId: "1",
    merchantName: "Café Aurora",
  },
  "2": {
    productId: "prod-verde-local",
    name: "Pack productos locales (mediano)",
    price: 95000,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC9IDhRwIf5-bLRwoILzfxB0HfoR45ebaARTX-Q998ixmAL3m7bAvZ2N7OrZA7105qlij7OpDaFRhRUS8PDEInkhBMNh6_gYOl34dMcFepJHlYJuinmIpl26oUIkPQemQxgXnxWQBcq7T15vGpexFi--hvlnC106ToPEP4aO-ilieBW3aRu5DgEA219hhqUhxhfo34sXoatmO0wAbjU-9sP4TNU4VOEync9kHGTY6cl6tpEJPNiNILYTletP7HtxcKliiGweop34_z0",
    merchantId: "2",
    merchantName: "Verde Market",
  },
};

export function getFeaturedProductForMerchant(merchantId: string): CatalogProduct | undefined {
  return MERCHANT_FEATURED[merchantId];
}

export function getProductForPost(postId: string): CatalogProduct | undefined {
  return POST_PRODUCTS[postId];
}
