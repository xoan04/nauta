"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { MerchantFeaturedConnectButton } from "@/components/perlapp/MerchantFeaturedConnectButton";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Button } from "@/components/ui/button";
import { getProductForPost } from "@/lib/cart-catalog";
import { merchantProfilePath } from "@/lib/merchant-profile.mock";
import {
  NEARBY_MERCHANTS,
  RECENT_POSTS,
  TOP_MERCHANTS,
} from "@/lib/perlapp-home.constants";
import { useBuyerActivityStore } from "@/store/buyer-activity.store";
import { useCartStore } from "@/store/cart.store";
import { usePerlappRoleStore } from "@/store/perlapp-role.store";
import { PerlappHomeBottomNav } from "./PerlappHomeBottomNav";
import { PerlappHomeHeader } from "./PerlappHomeHeader";

export function PerlappHome() {
  const role = usePerlappRoleStore((s) => s.role);
  const registerPostInteraction = useBuyerActivityStore((s) => s.registerPostInteraction);
  const addItem = useCartStore((s) => s.addItem);

  const addFromPost = (postId: string) => {
    const p = getProductForPost(postId);
    if (!p) return;
    addItem({
      productId: p.productId,
      name: p.name,
      price: p.price,
      imageUrl: p.imageUrl,
      merchantId: p.merchantId,
      merchantName: p.merchantName,
      quantity: 1,
    });
    if (role === "comprador") {
      registerPostInteraction(postId);
    }
  };

  return (
    <div className="min-h-screen bg-perlapp-canvas text-perlapp-ink antialiased selection:bg-perlapp-orange/20 selection:text-perlapp-ink">
      <PerlappHomeHeader />

      <main className="mx-auto flex w-full max-w-2xl flex-col gap-perlapp-lg pb-28 pt-20 md:pb-12">
        {/* Comercios destacados */}
        <section className="w-full" aria-labelledby="top-merchants-heading">
          <div className="mb-perlapp-sm px-perlapp-margin-mobile md:px-perlapp-margin-desktop">
            <h2
              id="top-merchants-heading"
              className="font-display text-perlapp-headline-md leading-8 text-perlapp-ink"
            >
              Comercios destacados
            </h2>
          </div>
          <div className="no-scrollbar flex snap-x snap-mandatory gap-perlapp-sm overflow-x-auto px-perlapp-margin-mobile pb-perlapp-sm md:px-perlapp-margin-desktop">
            {TOP_MERCHANTS.map((m) => (
              <div
                key={m.id}
                className="relative h-40 w-[min(280px,85vw)] shrink-0 snap-center"
              >
                <Link
                  href={merchantProfilePath(m.id)}
                  className="group relative block h-full w-full overflow-hidden rounded-xl shadow-perlapp-float outline-none ring-perlapp-orange focus-visible:ring-2"
                  aria-label={`Ver perfil de ${m.title}`}
                >
                  <Image
                    src={m.image}
                    alt={m.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="280px"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${m.gradient}`}
                    aria-hidden
                  />
                  <div className="absolute bottom-0 left-0 w-full p-perlapp-md">
                    <span className="mb-perlapp-xs inline-block rounded-md border border-white/30 bg-white/20 px-2 py-1 font-display text-perlapp-label-sm leading-4 text-white backdrop-blur-md">
                      {m.category}
                    </span>
                    <h3 className="font-display text-[20px] font-bold leading-tight text-white">
                      {m.title}
                    </h3>
                  </div>
                </Link>
                <MerchantFeaturedConnectButton merchantId={m.id} merchantTitle={m.title} />
              </div>
            ))}
          </div>
        </section>

        {/* Comerciantes cercanos */}
        <section className="w-full" aria-labelledby="nearby-heading">
          <div className="mb-perlapp-sm px-perlapp-margin-mobile md:px-perlapp-margin-desktop">
            <h2
              id="nearby-heading"
              className="font-display text-[20px] font-semibold text-perlapp-ink"
            >
              Comerciantes cercanos
            </h2>
          </div>
          <div className="no-scrollbar flex items-start gap-perlapp-md overflow-x-auto px-perlapp-margin-mobile pb-perlapp-sm md:px-perlapp-margin-desktop">
            {NEARBY_MERCHANTS.map((item) => (
              <Link
                key={item.merchantProfileId}
                href={merchantProfilePath(item.merchantProfileId)}
                className="flex w-[72px] shrink-0 flex-col items-center gap-perlapp-xs rounded-xl outline-none ring-perlapp-orange transition-opacity hover:opacity-90 focus-visible:ring-2"
                aria-label={`Ver perfil: ${item.label}`}
              >
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-full p-0.5 ${
                    item.ring === "gradient"
                      ? "bg-gradient-to-br from-perlapp-orange to-perlapp-tertiary"
                      : "bg-perlapp-line"
                  }`}
                >
                  <Image
                    src={item.image}
                    alt={item.alt}
                    width={60}
                    height={60}
                    className="rounded-full border-2 border-perlapp-white object-cover"
                    sizes="60px"
                  />
                </div>
                <span className="w-full truncate text-center font-display text-perlapp-label-sm leading-4 text-perlapp-inkMuted">
                  {item.label}
                </span>
              </Link>
            ))}
            <Link
              href="/explorar"
              className="flex w-[72px] shrink-0 flex-col items-center gap-perlapp-xs"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-perlapp-line bg-perlapp-surfaceContainer text-perlapp-orange transition-colors hover:bg-perlapp-surfaceVariant">
                <Plus className="h-6 w-6" strokeWidth={2} />
              </div>
              <span className="w-full truncate text-center font-display text-perlapp-label-sm font-medium leading-4 text-perlapp-orange">
                Ver más
              </span>
            </Link>
          </div>
        </section>

        {/* Publicaciones */}
        <section
          className="w-full px-perlapp-margin-mobile md:px-perlapp-margin-desktop"
          aria-labelledby="posts-heading"
        >
          <div className="mb-perlapp-md">
            <h2
              id="posts-heading"
              className="font-display text-perlapp-headline-md leading-8 text-perlapp-ink"
            >
              Publicaciones recientes
            </h2>
          </div>
          <div className="flex flex-col gap-perlapp-md">
            {RECENT_POSTS.map((post) => (
              <article
                key={post.id}
                className="flex flex-col gap-perlapp-sm rounded-xl border border-perlapp-line/30 bg-perlapp-white p-perlapp-md shadow-perlapp-float"
              >
                <div className="flex items-center gap-perlapp-sm">
                  <Link
                    href={merchantProfilePath(post.merchantId)}
                    className="relative block h-10 w-10 shrink-0 overflow-hidden rounded-full outline-none ring-perlapp-orange ring-offset-2 ring-offset-perlapp-white transition-opacity hover:opacity-90 focus-visible:ring-2"
                    aria-label={`Ver perfil de ${post.author}`}
                  >
                    <Image
                      src={post.authorAvatar}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </Link>
                  <div className="min-w-0">
                    <Link
                      href={merchantProfilePath(post.merchantId)}
                      className="block rounded-md outline-none ring-perlapp-orange focus-visible:ring-2"
                    >
                      <h4 className="font-display text-perlapp-label-md leading-5 text-perlapp-ink hover:underline">
                        {post.author}
                      </h4>
                      <p className="font-display text-[11px] text-perlapp-inkMuted">{post.time}</p>
                    </Link>
                  </div>
                </div>

                <div className="relative h-48 w-full overflow-hidden rounded-lg">
                  <Image
                    src={post.image}
                    alt={post.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 672px) 100vw, 672px"
                    priority={post.id === "1"}
                  />
                  {post.badge ? (
                    <div className="absolute right-perlapp-sm top-perlapp-sm rounded-full bg-perlapp-orange/90 px-2 py-1 font-display text-[10px] font-medium uppercase tracking-wider text-white backdrop-blur-sm">
                      {post.badge}
                    </div>
                  ) : null}
                </div>

                <div>
                  <h3 className="mb-1 font-display text-[18px] font-semibold leading-snug text-perlapp-ink">
                    {post.title}
                  </h3>
                  <p className="line-clamp-2 font-sans text-base leading-6 text-perlapp-inkMuted">
                    {post.body}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-perlapp-line font-display text-perlapp-ink hover:bg-perlapp-surfaceContainer"
                  onClick={() => addFromPost(post.id)}
                >
                  Añadir al carrito
                </Button>
              </article>
            ))}
          </div>
        </section>
      </main>

      <PerlappHomeBottomNav />

      <CartDrawer />
    </div>
  );
}
