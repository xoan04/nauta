"use client";

import { useEffect, useId } from "react";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cartItemCount, cartTotal, formatPrice, groupCartLinesByMerchant } from "@/lib/cart.utils";
import {
  buildMerchantWhatsappOrderUrl,
  buildWhatsappOrderMessage,
  buildWhatsappOrderUrl,
} from "@/lib/whatsapp-order";
import { useCartStore } from "@/store/cart.store";
import { usePerlappRoleStore } from "@/store/perlapp-role.store";

export function CartDrawer() {
  const titleId = useId();
  const role = usePerlappRoleStore((s) => s.role);
  const items = useCartStore((s) => s.items);
  const isOpen = useCartStore((s) => s.isDrawerOpen);
  const closeDrawer = useCartStore((s) => s.closeDrawer);
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);
  const removeLine = useCartStore((s) => s.removeLine);
  const clearCart = useCartStore((s) => s.clearCart);

  const total = cartTotal(items);
  const count = cartItemCount(items);
  const isBuyerGrouped = role === "comprador";
  const merchantGroups = isBuyerGrouped ? groupCartLinesByMerchant(items) : [];
  const legacyWhatsappHref =
    items.length > 0 && !isBuyerGrouped ? buildWhatsappOrderUrl(buildWhatsappOrderMessage(items)) : "#";

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, closeDrawer]);

  if (!isOpen) return null;

  const renderLine = (line: (typeof items)[number]) => (
    <li
      key={line.productId}
      className="flex gap-perlapp-sm rounded-xl border border-perlapp-line/40 bg-perlapp-canvas/50 p-perlapp-sm"
    >
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-perlapp-surfaceVariant">
        {line.imageUrl ? (
          <Image src={line.imageUrl} alt={line.name} fill className="object-cover" sizes="80px" />
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        {!isBuyerGrouped ? (
          <p className="font-display text-perlapp-label-sm text-perlapp-inkMuted">{line.merchantName}</p>
        ) : null}
        <p className="font-display text-sm font-semibold leading-snug text-perlapp-ink">{line.name}</p>
        <p className="mt-1 font-display text-sm font-bold text-perlapp-orange">
          {formatPrice(line.price * line.quantity)}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <div className="inline-flex items-center rounded-lg border border-perlapp-line bg-perlapp-white">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-r-none"
              onClick={() => decrement(line.productId)}
              aria-label="Quitar una unidad"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="min-w-[2rem] text-center font-display text-sm font-semibold">{line.quantity}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-l-none"
              onClick={() => increment(line.productId)}
              aria-label="Añadir una unidad"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-perlapp-inkMuted hover:text-destructive"
            onClick={() => removeLine(line.productId)}
            aria-label={`Eliminar ${line.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </li>
  );

  return (
    <div className="fixed inset-0 z-[60] flex justify-end" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-perlapp-ink/40 backdrop-blur-[2px]"
        aria-label="Cerrar carrito"
        onClick={closeDrawer}
      />
      <aside
        className="relative flex h-full w-full max-w-md flex-col bg-perlapp-white shadow-2xl animate-in slide-in-from-right duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="flex items-center justify-between border-b border-perlapp-divider px-perlapp-md py-perlapp-sm">
          <div className="flex items-center gap-perlapp-sm">
            <ShoppingBag className="h-5 w-5 text-perlapp-orange" aria-hidden />
            <h2 id={titleId} className="font-display text-lg font-bold text-perlapp-ink">
              Tu carrito
            </h2>
            {count > 0 ? (
              <span className="rounded-full bg-perlapp-surfaceContainer px-2 py-0.5 font-display text-perlapp-label-sm text-perlapp-inkMuted">
                {count} {count === 1 ? "artículo" : "artículos"}
              </span>
            ) : null}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 text-perlapp-inkMuted hover:text-perlapp-ink"
            onClick={closeDrawer}
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </Button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-perlapp-md py-perlapp-sm">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-perlapp-md py-perlapp-lg text-center">
              <ShoppingBag className="h-14 w-14 text-perlapp-line" strokeWidth={1.25} />
              <p className="font-display text-perlapp-headline-md leading-8 text-perlapp-ink">
                El carrito está vacío
              </p>
              <p className="max-w-xs font-sans text-sm text-perlapp-inkMuted">
                Explora comercios o publicaciones y pulsa para añadir productos de ejemplo.
              </p>
              <Button type="button" variant="outline" onClick={closeDrawer}>
                Seguir comprando
              </Button>
            </div>
          ) : isBuyerGrouped ? (
            <div className="flex flex-col gap-perlapp-lg">
              {merchantGroups.map((group) => {
                const subtotal = cartTotal(group.lines);
                const msg = buildWhatsappOrderMessage(group.lines, group.merchantName);
                const waHref = buildMerchantWhatsappOrderUrl(msg, group.merchantPhone);

                return (
                  <section
                    key={group.merchantId}
                    className="rounded-2xl border border-perlapp-line/50 bg-perlapp-canvas/30 p-perlapp-sm shadow-sm"
                    aria-labelledby={`cart-merchant-${group.merchantId}`}
                  >
                    <div className="mb-perlapp-sm flex flex-col gap-1 border-b border-perlapp-line/40 pb-perlapp-sm">
                      <h3
                        id={`cart-merchant-${group.merchantId}`}
                        className="font-display text-base font-bold leading-tight text-perlapp-ink"
                      >
                        {group.merchantName}
                      </h3>
                      <p className="font-sans text-xs text-perlapp-inkMuted">
                        Pedido solo para productos de este comercio
                      </p>
                    </div>
                    <ul className="flex flex-col gap-perlapp-md">{group.lines.map((line) => renderLine(line))}</ul>
                    <div className="mt-perlapp-md flex items-center justify-between border-t border-perlapp-line/40 pt-perlapp-sm">
                      <span className="font-display text-sm text-perlapp-inkMuted">Subtotal</span>
                      <span className="font-display text-sm font-bold text-perlapp-ink">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="mt-3 flex flex-col gap-1.5">
                      {waHref ? (
                        <Button
                          type="button"
                          className="w-full gap-2 bg-[#25D366] font-display font-semibold text-white hover:bg-[#20bd5a]"
                          asChild
                        >
                          <a href={waHref} target="_blank" rel="noopener noreferrer" onClick={() => closeDrawer()}>
                            Enviar pedido por WhatsApp
                          </a>
                        </Button>
                      ) : (
                        <>
                          <Button
                            type="button"
                            disabled
                            className="w-full cursor-not-allowed gap-2 border-0 bg-[#25D366]/35 font-display font-semibold text-white/90 shadow-none hover:bg-[#25D366]/35"
                            aria-describedby={`cart-wa-hint-${group.merchantId}`}
                          >
                            Enviar pedido por WhatsApp
                          </Button>
                          <p
                            id={`cart-wa-hint-${group.merchantId}`}
                            className="text-center font-sans text-[11px] leading-snug text-perlapp-inkMuted"
                          >
                            Este comercio no tiene teléfono en Perlapp; el botón se activa cuando lo registre en su
                            perfil.
                          </p>
                        </>
                      )}
                    </div>
                  </section>
                );
              })}
            </div>
          ) : (
            <ul className="flex flex-col gap-perlapp-md">{items.map((line) => renderLine(line))}</ul>
          )}
        </div>

        {items.length > 0 ? (
          <footer className="border-t border-perlapp-divider bg-perlapp-white px-perlapp-md py-perlapp-md pb-[max(1rem,env(safe-area-inset-bottom))]">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-display text-sm text-perlapp-inkMuted">Total estimado</span>
              <span className="font-display text-xl font-bold text-perlapp-ink">{formatPrice(total)}</span>
            </div>
            <div className="flex flex-col gap-2">
              {!isBuyerGrouped ? (
                <Button
                  type="button"
                  className="flex-1 gap-2 bg-[#25D366] font-display font-semibold text-white hover:bg-[#20bd5a]"
                  asChild
                >
                  <a
                    href={legacyWhatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => closeDrawer()}
                  >
                    Enviar pedido por WhatsApp
                  </a>
                </Button>
              ) : (
                <p className="text-center font-sans text-xs text-perlapp-inkMuted">
                  Envía un mensaje por comercio con los botones verdes de cada sección.
                </p>
              )}
              <Button type="button" variant="outline" className="flex-1 font-display" onClick={clearCart}>
                Vaciar carrito
              </Button>
            </div>
          </footer>
        ) : null}
      </aside>
    </div>
  );
}
