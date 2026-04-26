import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItemInput, CartLine } from "@/types/cart.types";

type CartState = {
  items: CartLine[];
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  addItem: (input: CartItemInput) => void;
  removeLine: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  clearCart: () => void;
};

function mergeAdd(items: CartLine[], input: CartItemInput): CartLine[] {
  const qty = input.quantity ?? 1;
  const idx = items.findIndex((l) => l.productId === input.productId);
  if (idx === -1) {
    return [
      ...items,
      {
        productId: input.productId,
        name: input.name,
        price: input.price,
        imageUrl: input.imageUrl,
        merchantId: input.merchantId,
        merchantName: input.merchantName,
        merchantPhone: input.merchantPhone,
        quantity: qty,
      },
    ];
  }
  const next = [...items];
  const cur = next[idx]!;
  next[idx] = {
    ...cur,
    quantity: cur.quantity + qty,
    merchantPhone: input.merchantPhone ?? cur.merchantPhone,
  };
  return next;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isDrawerOpen: false,

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((s) => ({ isDrawerOpen: !s.isDrawerOpen })),

      addItem: (input) =>
        set((s) => ({
          items: mergeAdd(s.items, input),
          isDrawerOpen: true,
        })),

      removeLine: (productId) =>
        set((s) => ({
          items: s.items.filter((l) => l.productId !== productId),
        })),

      setQuantity: (productId, quantity) =>
        set((s) => {
          if (quantity < 1) {
            return { items: s.items.filter((l) => l.productId !== productId) };
          }
          return {
            items: s.items.map((l) =>
              l.productId === productId ? { ...l, quantity } : l
            ),
          };
        }),

      increment: (productId) =>
        set((s) => ({
          items: s.items.map((l) =>
            l.productId === productId ? { ...l, quantity: l.quantity + 1 } : l
          ),
        })),

      decrement: (productId) =>
        set((s) => {
          const line = s.items.find((l) => l.productId === productId);
          if (!line) return s;
          if (line.quantity <= 1) {
            return { items: s.items.filter((l) => l.productId !== productId) };
          }
          return {
            items: s.items.map((l) =>
              l.productId === productId ? { ...l, quantity: l.quantity - 1 } : l
            ),
          };
        }),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "perlapp-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
