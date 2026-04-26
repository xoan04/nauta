import type { CartLine } from "@/types/cart.types";
import { cartLineSubtotal, cartTotal, formatPrice } from "@/lib/cart.utils";

/** Número internacional sin + ni espacios (p. ej. 573001234567). */
export function normalizeWhatsappPhoneDigits(raw: string | null | undefined): string | undefined {
  if (!raw?.trim()) return undefined;
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 8) return undefined;
  if (digits.startsWith("57") && digits.length >= 12) return digits;
  if (digits.length === 10 && digits.startsWith("3")) return `57${digits}`;
  return digits;
}

/** Número internacional sin + ni espacios (p. ej. 34600111222). Opcional: si falta, el enlace abre WhatsApp para elegir contacto. */
function orderPhoneDigits(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_ORDER_NUMBER?.trim();
  if (!raw) return undefined;
  const digits = raw.replace(/\D/g, "");
  return digits.length >= 8 ? digits : undefined;
}

/**
 * Texto del pedido listo para pegar en WhatsApp (UTF-8; se codifica en la URL).
 * @param merchantLabel Si se pasa, el saludo nombra ese comercio (pedido por merchant).
 */
export function buildWhatsappOrderMessage(lines: CartLine[], merchantLabel?: string): string {
  const total = cartTotal(lines);
  const header = merchantLabel?.trim()
    ? `¡Hola! Quiero hacer un pedido en *${merchantLabel.trim()}* desde *Perlapp* (precios en COP):\n\n`
    : "¡Hola! Quiero hacer un pedido desde *Perlapp* (precios en COP):\n\n";

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

/**
 * Enlace `wa.me` al teléfono del comercio con el mensaje del pedido (solo líneas de ese merchant).
 * Devuelve `null` si no hay teléfono normalizable.
 */
export function buildMerchantWhatsappOrderUrl(
  message: string,
  merchantRawPhone: string | null | undefined
): string | null {
  const digits = normalizeWhatsappPhoneDigits(merchantRawPhone);
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
