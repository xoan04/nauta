/** Línea del carrito (frontend). `productId` agrupa cantidad al añadir de nuevo. */
export type CartLine = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  merchantId: string;
  merchantName: string;
};

export type CartItemInput = Omit<CartLine, "quantity"> & { quantity?: number };
