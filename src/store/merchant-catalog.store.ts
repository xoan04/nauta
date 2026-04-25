import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProfileCatalogProduct } from "@/lib/merchant-catalog.types";
import { createInitialMerchantCatalogs } from "@/lib/merchant-catalog.defaults";

function mergeCatalogs(
  persisted: Record<string, ProfileCatalogProduct[]> | undefined
): Record<string, ProfileCatalogProduct[]> {
  const base = createInitialMerchantCatalogs();
  if (!persisted) return base;
  return { ...base, ...persisted };
}

type MerchantCatalogState = {
  byMerchant: Record<string, ProfileCatalogProduct[]>;
  addProduct: (merchantId: string, product: Omit<ProfileCatalogProduct, "id"> & { id?: string }) => void;
  updateProduct: (merchantId: string, productId: string, patch: Partial<Omit<ProfileCatalogProduct, "id">>) => void;
  deleteProduct: (merchantId: string, productId: string) => void;
};

export const useMerchantCatalogStore = create<MerchantCatalogState>()(
  persist(
    (set) => ({
      byMerchant: createInitialMerchantCatalogs(),

      addProduct: (merchantId, product) =>
        set((s) => {
          const incoming = product as ProfileCatalogProduct & { id?: string };
          const id = incoming.id ?? `prod-${merchantId}-${Date.now()}`;
          const list = s.byMerchant[merchantId] ?? [];
          const next: ProfileCatalogProduct = {
            id,
            name: incoming.name,
            price: incoming.price,
            imageUrl: incoming.imageUrl,
          };
          return {
            byMerchant: {
              ...s.byMerchant,
              [merchantId]: [...list, next],
            },
          };
        }),

      updateProduct: (merchantId, productId, patch) =>
        set((s) => {
          const list = s.byMerchant[merchantId] ?? [];
          return {
            byMerchant: {
              ...s.byMerchant,
              [merchantId]: list.map((p) => (p.id === productId ? { ...p, ...patch } : p)),
            },
          };
        }),

      deleteProduct: (merchantId, productId) =>
        set((s) => {
          const list = s.byMerchant[merchantId] ?? [];
          return {
            byMerchant: {
              ...s.byMerchant,
              [merchantId]: list.filter((p) => p.id !== productId),
            },
          };
        }),
    }),
    {
      name: "perlapp-merchant-catalog",
      merge: (persisted, current) => {
        const p = persisted as Partial<MerchantCatalogState> | undefined;
        return {
          ...current,
          byMerchant: mergeCatalogs(p?.byMerchant),
        };
      },
    }
  )
);
