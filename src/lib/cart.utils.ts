import type { CartLine } from "@/types/cart.types";

const eur = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
});

export function formatPrice(value: number): string {
  return eur.format(value);
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
