import type { CartLine } from "@/types/cart.types";

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
