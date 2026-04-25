/** Contenido estático del home Perlapp (Stitch) — sustituir por datos de API cuando exista. */

export const TOP_MERCHANTS = [
  {
    id: "1",
    title: "Café Aurora",
    category: "Café y panadería",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD1hvNc74IgGa5QVkSwy2X-xkmdxfQzkE9UlbFi7cQ8dT2c7kGfgtQjZrxaM8s9vaS5buyMeBlzYAaJQlRwbJuTUeBSjMxteLeG1eC6S6kAaGKzjCLglkt0C5qejLrILwPU2uwumy6WCbFg94w6YabztRu6EgqsX1lh7880iSsdHnk-FAdIinxwjm_jZaWLocSEHpTgEG2eCnqAOVvqTyjEYrlT_kHSvT0KU6bvpQ7M-gWNEsnD0BcH4ulZnJBk0FR7PuABno05mCFN",
    alt: "Interior de cafetería orgánica rústica con iluminación cálida y mostradores de madera",
    gradient: "from-perlapp-ink/80 via-perlapp-ink/20 to-transparent" as const,
  },
  {
    id: "2",
    title: "Verde Market",
    category: "Frescos y abarrotes",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDrpytgM2BgY_nUjzDUvl9vzS5jtJsZHSg3Z5BUtmtEkKMhBbWGZN5K3Pcu78qlIBkEBhrVoNFLvOO0YYQd3B0-Pqkqy4lfszzQHuor6GC5MdFCLTJK2K-CqZS9TaoY-oy9r3qmduwuoOTVak1_k4PfpMGhYfC4zapfbi0CfjJ9TBcra_Y9rSe_-8opUuxj545EqdQ18W-oevB3jjJ0mdHQkAcM_sZ7OzfqfaKPxPY-5UsNWutSXkfFxZou52Z-gTxAZtstO-UOBkZJ",
    alt: "Producto fresco vibrante en un mercado orgánico moderno",
    gradient: "from-perlapp-tertiary/90 via-perlapp-tertiary/30 to-transparent" as const,
  },
  {
    id: "3",
    title: "Lumina Threads",
    category: "Ropa",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD1tXwsZ5sb8y4b1Vmlt36DokdribmL0xlVKBj7bLqfaH_PBDlWLTGF7i_18OL-CnJmgKpHrUtCNI7PT7EcZsDVN8j79oKcbokLGnd8bdmPQed-ghSUni_YH8cS_h6LHKOF0bZsbM--AXSN-5ywmLO2gPwauDXtATy2p3-LFLxfnaQ9Ap16BN07K1aSAQyO4rZJSsHFIWMTmsjI78DarGv6XiiGdGtX4QE6xqVv-3ge_aTNl3Sc-mimHdGplVQ-77zqQadtLhxCKCyZ",
    alt: "Boutique de ropa con prendas curadas",
    gradient: "from-perlapp-orange/90 via-perlapp-orange/30 to-transparent" as const,
  },
] as const;

/** `merchantProfileId` = ruta `/merchant/[id]` del comercio. */
export const NEARBY_MERCHANTS = [
  {
    merchantProfileId: "1",
    label: "Panadería",
    ring: "gradient" as const,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA3lZhyNV3VRXUW87aJyShzbneTpkcjWELTwn1Lusjo6-vJ-ac1Nr8TC4szygSHKKX1NT3CNlXprvOx_AQ7cjOF89glSdV9YbrzAcKXQ2IcmM0W7gWvVGEe5zDifL-F7WaM_3biuPXPqNxZ_WLAenzukHp0Ypu7XoY1UqG-XUieicypT4ChGBLjoAc6qULwJAeVrXpGma43xyzweaGO0jtiDfRLcleq4Cfk0qTjIa0jTAXgZyzSMJ6pKVm3n_cKj1bQ2W54uGqHyvUk",
    alt: "Logo de panadería local con croissant estilizado",
  },
  {
    merchantProfileId: "2",
    label: "Botánica",
    ring: "gradient" as const,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBvotKXXM0icfa5KWKIdM5C__VSU0jEo5JUi8szhuCIeqryyBqkvNGB9K4nTNJm-eOdA55RycmTE3iWRg3JUSi5z5yNBbAROhpub1QyGRPR401XGe_CHeuVD4AT4M4cd2NjJu5NpS4vz0ufHLlIu9P1Wqm1FCIl5zJnidHj2w06liJKyHq7_bA-W47Er_QL0zKOOXQUBOf4-wDYt5NjqpvoeYf5wh5oHsRXC9rZUCQlrpbXsNQ87kc2MfrK4XT4MAUp8m7XsfhiHjbk",
    alt: "Logo de vivero con hoja verde",
  },
  {
    merchantProfileId: "3",
    label: "Regalos",
    ring: "muted" as const,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD_I4Xuo8RZWSL1DusvkEANNFKA3Jyrt4pw9L1-mgJmrsCiUzxOg_u4c44IG7_20zbO8Qq5jyRIXe5bDscIh19EIuLCdqmAS1F_8Jup6o9Cfd197hn5EbXIwM7rSm81JKG8eRQ7bYTfwbsrEwgVChmulklYQFX-GgLpz-rToliwSvWKoulIG-dYbrv5vc4bd5cZBLTAjFZTq9nliwqtJqFql45mCoWmaYNifg3Jrpb4wY9RDRoehgCwYmO6gFJkAQP3JGKc6RE2eN2V",
    alt: "Icono de caja de regalo para tienda artesanal",
  },
  {
    merchantProfileId: "4",
    label: "Tostador",
    ring: "muted" as const,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAn6AE5OdxunC8ZKArGwHUd_ScF4oHCHuNXPaeR3yWP_Om3aEyB4fWqDL5kVIIAhrYGIttEZagIRY6BeuAOIEvP2mH_XZtP8dH2kmoGBBGTMUFNFBtorLeDHkPcM6-nGnEr65aG4FqGyZZcDNe-hrdLTcKR9xhHhma2HMkpvY6hDm19SkfMOP5sZF6q8XyJRHB036QJSAOgEy7pahu5Hk01ydoF1a9kfCrl6lrUND0gLmbQ2S1jJhHm75CPTZl0byc-gC6KRlMMi5tg",
    alt: "Taza de café para tostaduría local",
  },
] as const;

export const RECENT_POSTS = [
  {
    id: "1",
    merchantId: "1",
    author: "Café Aurora",
    authorAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuABv_K-Uym0OFG1M-AdF5BWNnufefVEpInxEob_vvoPzE0OG0ruPO791yJ0v-v5ZmJ9JWWOnQ13Urod8lKKMaNWT63YdG9EutUS8RLECDCcYsEqI1dbkLcxy_fA8LR_AtJn12ojbUGrhiAHxmp-ln4Hd1aRJLOzFaRxVAEVmfJMRWYJ-DEsu2SMiSL_DrACltdqytZp_4Gm_nkKilpos1zBxMUfKZwF3bh5f_cAalVorbVStwO-ziDkGJQ9MaO2_zQ-nQdxecr8RIyi",
    time: "Hace 2 horas",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCTloLMqKKfztTgTK2tZ_hVAgLzl0oZp0wIWdNWYmayj8a4THcND6nmON-Wf1ni2kBiSosu59JrQsYtMbbhLjj4-ZSPTRZJExasy21hERxvPPWqKz5hs_WzPrj8sTIQuZ5eKorZYcZmTUzldlBCypDkdQ1lMPkAGxSHJ95sfhiEusHLRhTbtP86gn1UtCS8zKA9NslDQyG0zT5WgYUymv7XjAmhAYZ4WfZXtbD4nND_xKXzbVW19VorxS0uMvLQGwP6wOPBzrF6yDor",
    alt: "Latte art recién servido con croissant sobre mesa de madera",
    title: "¡Nuevo Menú de Otoño! 🍂",
    body: "Ven y prueba nuestro nuevo Latte de Calabaza y especias. Perfecto para las tardes frescas. 20% de descuento si muestras esta publicación en caja.",
    badge: "Promoción" as const,
  },
  {
    id: "2",
    merchantId: "2",
    author: "Verde Market",
    authorAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC4JiI9mqtYL9ypZO883JqAKfwLzdQEHXkXF77tcru_s0UXGcmcxgoUq9D8nJnWwWVnb6R9gQkRuezR8lGyplPD__lOXyrb-01kQfbbUkJ9NuhB1k4kbaUSWcW7O7ZFiY7pPvvZBLSfyJfxS4ftZunJ0iNDsX4EZSiPUdPuVXUSW3HXOpgQb1wjJuuN7qh1c5F-qhMP-jAVjoD3cOqFo2HYUxxpuwMwxbmDDpdZxt8ii_sf7ZGs8sOYq8-f47scx-FwHnI00Ul73823",
    time: "Ayer a las 15:30",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC9IDhRwIf5-bLRwoILzfxB0HfoR45ebaARTX-Q998ixmAL3m7bAvZ2N7OrZA7105qlij7OpDaFRhRUS8PDEInkhBMNh6_gYOl34dMcFepJHlYJuinmIpl26oUIkPQemQxgXnxWQBcq7T15vGpexFi--hvlnC106ToPEP4aO-ilieBW3aRu5DgEA219hhqUhxhfo34sXoatmO0wAbjU-9sP4TNU4VOEync9kHGTY6cl6tpEJPNiNILYTletP7HtxcKliiGweop34_z0",
    alt: "Canasta llena de verduras orgánicas locales",
    title: "Llegaron los productos locales 🍅",
    body: "Apoyemos a nuestros agricultores de la zona. Ya tenemos disponibles tomates de herencia, lechugas hidropónicas y mucho más.",
    badge: null,
  },
] as const;
