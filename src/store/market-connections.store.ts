"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type MarketConnectionStatus = "pendiente" | "aceptada" | "rechazada";

export type MarketConnectionRequest = {
  id: string;
  fromMerchantId: string;
  toMerchantId: string;
  status: MarketConnectionStatus;
  createdAt: number;
  updatedAt: number;
};

type MarketConnectionsState = {
  requests: MarketConnectionRequest[];
  sendRequest: (fromMerchantId: string, toMerchantId: string) => void;
  acceptRequest: (id: string) => void;
  rejectRequest: (id: string) => void;
};

function pairKey(a: string, b: string): string {
  return [a, b].sort().join("|");
}

export const useMarketConnectionsStore = create<MarketConnectionsState>()(
  persist(
    (set, get) => ({
      requests: [],

      sendRequest: (fromMerchantId, toMerchantId) => {
        if (!fromMerchantId || !toMerchantId || fromMerchantId === toMerchantId) return;
        const key = pairKey(fromMerchantId, toMerchantId);
        const hasOpen = get().requests.some(
          (r) => pairKey(r.fromMerchantId, r.toMerchantId) === key && r.status !== "rechazada"
        );
        if (hasOpen) return;
        const now = Date.now();
        set((s) => ({
          requests: [
            ...s.requests,
            {
              id: `${fromMerchantId}-${toMerchantId}-${now}`,
              fromMerchantId,
              toMerchantId,
              status: "pendiente",
              createdAt: now,
              updatedAt: now,
            },
          ],
        }));
      },

      acceptRequest: (id) =>
        set((s) => ({
          requests: s.requests.map((r) =>
            r.id === id ? { ...r, status: "aceptada", updatedAt: Date.now() } : r
          ),
        })),

      rejectRequest: (id) =>
        set((s) => ({
          requests: s.requests.map((r) =>
            r.id === id ? { ...r, status: "rechazada", updatedAt: Date.now() } : r
          ),
        })),
    }),
    { name: "perlapp-market-connections" }
  )
);

