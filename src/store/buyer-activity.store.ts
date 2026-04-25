import { create } from "zustand";
import { persist } from "zustand/middleware";

export type MerchantConnectionPair = {
  key: string;
  merchantIdA: string;
  merchantIdB: string;
  createdAt: number;
};

type BuyerActivityState = {
  favoriteMerchantIds: string[];
  interactedPostIds: string[];
  /** Conexiones B2B entre dos markets (solo el rol `market` puede crearlas en UI). */
  connectionPairs: MerchantConnectionPair[];
  toggleFavoriteMerchant: (merchantId: string) => void;
  connectMerchantPair: (merchantIdA: string, merchantIdB: string) => void;
  registerPostInteraction: (postId: string) => void;
};

function pairKey(a: string, b: string): string {
  return [a, b].sort().join("|");
}

export const useBuyerActivityStore = create<BuyerActivityState>()(
  persist(
    (set, get) => ({
      favoriteMerchantIds: [],
      interactedPostIds: [],
      connectionPairs: [],

      toggleFavoriteMerchant: (merchantId) =>
        set((s) => {
          const has = s.favoriteMerchantIds.includes(merchantId);
          return {
            favoriteMerchantIds: has
              ? s.favoriteMerchantIds.filter((id) => id !== merchantId)
              : [...s.favoriteMerchantIds, merchantId],
          };
        }),

      connectMerchantPair: (merchantIdA, merchantIdB) => {
        if (merchantIdA === merchantIdB) return;
        const key = pairKey(merchantIdA, merchantIdB);
        if (get().connectionPairs.some((p) => p.key === key)) return;
        set((s) => ({
          connectionPairs: [
            ...s.connectionPairs,
            {
              key,
              merchantIdA,
              merchantIdB,
              createdAt: Date.now(),
            },
          ],
        }));
      },

      registerPostInteraction: (postId) =>
        set((s) => {
          if (s.interactedPostIds.includes(postId)) return s;
          return { interactedPostIds: [...s.interactedPostIds, postId] };
        }),
    }),
    { name: "perlapp-buyer-activity" }
  )
);
