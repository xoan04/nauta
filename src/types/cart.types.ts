/** Línea del carrito (frontend). `productId` agrupa cantidad al añadir de nuevo. `price` en COP. */
export type CartLine = {
  productId: string;
  name: string;
  /** Precio unitario en pesos colombianos (COP). */
  price: number;
  quantity: number;
  imageUrl?: string;
  merchantId: string;
  merchantName: string;
  /** Teléfono del comercio (para WhatsApp por merchant). Opcional en líneas antiguas persistidas. */
  merchantPhone?: string | null;
};

export type CartItemInput = Omit<CartLine, "quantity"> & { quantity?: number };
