import type { CartLine } from "@/types/cart.types";

/** Grupo de líneas del carrito por comercio (UI comprador). */
export type CartMerchantGroup = {
  merchantId: string;
  merchantName: string;
  merchantPhone?: string | null;
  lines: CartLine[];
};

export function groupCartLinesByMerchant(items: CartLine[]): CartMerchantGroup[] {
  const order: string[] = [];
  const byId = new Map<string, CartMerchantGroup>();
  for (const line of items) {
    let g = byId.get(line.merchantId);
    if (!g) {
      g = {
        merchantId: line.merchantId,
        merchantName: line.merchantName,
        merchantPhone: line.merchantPhone,
        lines: [],
      };
      byId.set(line.merchantId, g);
      order.push(line.merchantId);
    }
    g.lines.push(line);
    const p = line.merchantPhone?.trim();
    if (p && !g.merchantPhone?.trim()) g.merchantPhone = p;
  }
  return order.map((id) => byId.get(id)!);
}

const cop = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function formatScaled(value: number, divisor: number, suffix: string): string {
  const scaled = value / divisor;
  const digits = scaled >= 100 ? 0 : scaled >= 10 ? 1 : 2;
  const rounded = Number(scaled.toFixed(digits));
  const text = new Intl.NumberFormat("es-CO", {
    minimumFractionDigits: rounded % 1 === 0 ? 0 : digits,
    maximumFractionDigits: digits,
  }).format(rounded);
  return `$${text} ${suffix}`;
}

/** Precios en COP estandarizados: cientos, miles y millones. */
export function formatPrice(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return formatScaled(value, 1_000_000, "M");
  }
  if (Math.abs(value) >= 1_000) {
    return formatScaled(value, 1_000, "mil");
  }
  if (Math.abs(value) >= 100) {
    return `$${new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 }).format(value)}`;
  }
  return cop.format(value);
}

export function cartLineSubtotal(line: CartLine): number {
  return line.price * line.quantity;
}

export function cartTotal(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + cartLineSubtotal(line), 0);
}

export function cartItemCount(lines: CartLine[]): number {
  return lines.reduce((n, line) => n + line.quantity, 0);
}
