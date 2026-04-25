import type { CartLine } from "@/types/cart.types";
import { cartLineSubtotal, cartTotal, formatPrice } from "@/lib/cart.utils";

/** Número internacional sin + ni espacios (p. ej. 34600111222). Opcional: si falta, el enlace abre WhatsApp para elegir contacto. */
function orderPhoneDigits(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_ORDER_NUMBER?.trim();
  if (!raw) return undefined;
  const digits = raw.replace(/\D/g, "");
  return digits.length >= 8 ? digits : undefined;
}

/**
 * Texto del pedido listo para pegar en WhatsApp (UTF-8; se codifica en la URL).
 */
export function buildWhatsappOrderMessage(lines: CartLine[]): string {
  const total = cartTotal(lines);
  const header = "¡Hola! Quiero hacer un pedido desde *Perlapp* (precios en COP):\n\n";

  const body = lines
    .map((line) => {
      const sub = cartLineSubtotal(line);
      const unit = formatPrice(line.price);
      const lineTotal = formatPrice(sub);
      return `• *${line.quantity}×* ${line.name}\n  _${line.merchantName}_ — ${unit} c/u → *${lineTotal}*`;
    })
    .join("\n\n");

  const footer = `\n\n──────────\n*Total estimado:* ${formatPrice(total)}\n\nGracias.`;

  return `${header}${body}${footer}`;
}

/**
 * Enlace de WhatsApp con el mensaje pre-rellenado.
 * Si existe `NEXT_PUBLIC_WHATSAPP_ORDER_NUMBER`, abre chat con ese número.
 */
export function buildWhatsappOrderUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  const phone = orderPhoneDigits();
  if (phone) {
    return `https://wa.me/${phone}?text=${encoded}`;
  }
  return `https://api.whatsapp.com/send?text=${encoded}`;
}
