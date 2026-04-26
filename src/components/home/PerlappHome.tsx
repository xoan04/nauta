"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { MerchantFeaturedConnectButton } from "@/components/perlapp/MerchantFeaturedConnectButton";
import { CartDrawer } from "@/components/cart/CartDrawer";
import type { PublicMerchantListItem } from "@/core/models/public-merchants-list.model";
import { MerchantPostFAB } from "@/components/merchant/MerchantPostFAB";
import { FeedPostCard } from "@/components/home/FeedPostCard";
import { usePublicMerchants } from "@/hooks/use-public-merchants";
import { useFeaturedMerchants } from "@/hooks/use-featured-merchants";
import { useNearbyMerchants } from "@/hooks/use-nearby-merchants";
import { useFeed } from "@/hooks/use-feed";
import { useMerchantGamification } from "@/hooks/use-merchant-gamification";
import { merchantProfilePath } from "@/lib/merchant-profile.mock";
import { TOP_MERCHANTS } from "@/lib/perlapp-home.constants";
import { usePerlappRoleStore } from "@/store/perlapp-role.store";
import { PerlappHomeBottomNav } from "./PerlappHomeBottomNav";
import { PerlappHomeHeader } from "./PerlappHomeHeader";

const FEATURED_GRADIENTS = TOP_MERCHANTS.map((m) => m.gradient);

function merchantProfileHref(m: PublicMerchantListItem): string {
  return merchantProfilePath(m.user.id);
}

function merchantConnectId(m: PublicMerchantListItem): string {
  return m.profile_merchant?.id ?? m.user.id;
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function PerlappHome() {
  const { data: merchantsData, isPending, isError } = usePublicMerchants();
  const merchants = merchantsData?.merchants ?? [];

  const {
    data: featuredData,
    isPending: isFeaturedPending,
    isError: isFeaturedError,
    refetch: refetchFeatured,
    isFetching: isFeaturedFetching,
  } = useFeaturedMerchants();
  const featuredMerchants = featuredData?.merchants ?? [];

  const role = usePerlappRoleStore((s) => s.role);

  const {
    geo,
    data: nearbyData,
    isPending: isNearbyPending,
  } = useNearbyMerchants();
  const nearbyMerchants = nearbyData?.merchants ?? [];

  const { data: gamification } = useMerchantGamification();
  const currentStage = gamification?.current_stage ?? 1;

  const {
    data: feedPages,
    isPending: isFeedPending,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useFeed();
  const feedPosts = feedPages?.pages.flatMap((p) => p.posts) ?? [];

  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: "0px 0px 600px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);



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

          {role === "invitado" ? (
            <div className="mx-perlapp-margin-mobile overflow-hidden rounded-2xl bg-gradient-to-br from-perlapp-orange/90 to-perlapp-tertiary p-perlapp-md shadow-perlapp-float md:mx-perlapp-margin-desktop">
              <p className="mb-1 font-display text-[11px] font-semibold uppercase tracking-widest text-white/70">
                Comunidad Perlapp
              </p>
              <h3 className="mb-perlapp-sm font-display text-[22px] font-bold leading-snug text-white">
                Descubre los comercios más activos cerca de ti
              </h3>
              <p className="mb-perlapp-md font-sans text-sm leading-5 text-white/80">
                Regístrate gratis y accede a ofertas exclusivas, productos locales y comerciantes verificados de tu comunidad.
              </p>
              <div className="flex flex-wrap gap-perlapp-sm">
                <Link
                  href="/registro"
                  className="rounded-xl bg-white px-5 py-2.5 font-display text-sm font-semibold text-perlapp-orange shadow transition hover:bg-white/90 active:scale-95"
                >
                  Crear cuenta gratis
                </Link>
                <Link
                  href="/login"
                  className="rounded-xl border border-white/40 bg-white/10 px-5 py-2.5 font-display text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 active:scale-95"
                >
                  Iniciar sesión
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="no-scrollbar flex snap-x snap-mandatory gap-perlapp-sm overflow-x-auto px-perlapp-margin-mobile pb-perlapp-sm md:px-perlapp-margin-desktop">
                {isFeaturedPending ? (
                  <>
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="relative h-40 w-[min(280px,85vw)] shrink-0 snap-center animate-pulse rounded-xl bg-perlapp-line/40"
                      />
                    ))}
                  </>
                ) : isFeaturedError ? (
                  <div className="w-full min-w-0 rounded-xl border border-perlapp-line/60 bg-perlapp-white px-perlapp-md py-perlapp-md text-center shadow-perlapp-float">
                    <p className="font-display text-sm text-perlapp-inkMuted">
                      No se pudieron cargar los comercios destacados.
                    </p>
                    <button
                      type="button"
                      className="mt-3 rounded-full border border-perlapp-line bg-perlapp-white px-4 py-1.5 font-display text-sm font-semibold text-perlapp-ink shadow-sm transition hover:bg-perlapp-surfaceContainer disabled:opacity-60"
                      onClick={() => void refetchFeatured()}
                      disabled={isFeaturedFetching}
                    >
                      {isFeaturedFetching ? "Reintentando…" : "Reintentar"}
                    </button>
                  </div>
                ) : featuredMerchants.length === 0 ? (
                  <p className="px-perlapp-sm font-display text-sm text-perlapp-inkMuted">
                    Aún no hay comercios destacados para mostrar.
                  </p>
                ) : (
                  featuredMerchants.map((m, index) => {
                    const gradient = FEATURED_GRADIENTS[index % FEATURED_GRADIENTS.length];
                    const bannerUrl =
                      m.businesses[0]?.business.banner_photo_url ??
                      m.profile_merchant?.photo_banner ??
                      m.user.photo_banner ??
                      null;
                    const categoryName = m.businesses[0]?.business_category?.name ?? "Comercio";
                    const businessName =
                      m.businesses[0]?.business.business_name ?? m.user.name;
                    return (
                      <div
                        key={m.user.id}
                        className="relative h-40 w-[min(280px,85vw)] shrink-0 snap-center"
                      >
                        <Link
                          href={merchantProfileHref(m)}
                          className="group relative block h-full w-full overflow-hidden rounded-xl shadow-perlapp-float outline-none ring-perlapp-orange focus-visible:ring-2"
                          aria-label={`Ver perfil de ${m.user.name}`}
                        >
                          {bannerUrl ? (
                            <Image
                              src={bannerUrl}
                              alt=""
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="280px"
                            />
                          ) : (
                            <>
                              <div
                                className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
                                aria-hidden
                              />
                              <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                                <span className="font-display text-5xl font-bold text-white/25">
                                  {initialsFromName(m.user.name)}
                                </span>
                              </div>
                            </>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-perlapp-ink/85 via-perlapp-ink/25 to-transparent" aria-hidden />
                          <div className="absolute bottom-0 left-0 w-full p-perlapp-md">
                            <span className="mb-perlapp-xs inline-block rounded-md border border-white/30 bg-white/20 px-2 py-1 font-display text-perlapp-label-sm leading-4 text-white backdrop-blur-md">
                              {categoryName}
                            </span>
                            <h3 className="font-display text-[20px] font-bold leading-tight text-white">
                              {businessName}
                            </h3>
                          </div>
                        </Link>
                        <MerchantFeaturedConnectButton
                          merchantId={merchantConnectId(m)}
                          merchantTitle={m.user.name}
                        />
                      </div>
                    );
                  })
                )}
              </div>
              {role === "market" && currentStage <= 2 ? (
                <Link
                  href="/merchant/journey"
                  className="mt-2 block px-perlapp-margin-mobile font-display text-base font-semibold text-perlapp-orange underline underline-offset-2 transition md:px-perlapp-margin-desktop"
                >
                  ¿Quieres ser parte de este grupo?
                </Link>
              ) : null}
              {role === "market" && currentStage === 3 ? (
                <Link
                  href="/merchant/journey"
                  className="mx-perlapp-margin-mobile mt-3 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 transition hover:bg-emerald-100 md:mx-perlapp-margin-desktop"
                >
                  <span className="text-2xl">📍</span>
                  <div className="min-w-0">
                    <p className="font-display text-sm font-semibold text-emerald-800">
                      ¿Quieres aparecer destacado en el mapa?
                    </p>
                    <p className="font-display text-xs text-emerald-600">
                      Un paso más y los compradores te encontrarán fácil →
                    </p>
                  </div>
                </Link>
              ) : null}
              {role === "market" && currentStage === 4 ? (
                <Link
                  href="/merchant/journey"
                  className="mx-perlapp-margin-mobile mt-3 flex items-center gap-3 rounded-2xl border border-purple-200 bg-purple-50 px-4 py-3 transition hover:bg-purple-100 md:mx-perlapp-margin-desktop"
                >
                  <span className="text-2xl">💰</span>
                  <div className="min-w-0">
                    <p className="font-display text-sm font-semibold text-purple-800">
                      Accede a financiamiento para tu negocio
                    </p>
                    <p className="font-display text-xs text-purple-600">
                      Completa tu perfil y conecta con líneas de crédito →
                    </p>
                  </div>
                </Link>
              ) : null}
              {role === "market" && currentStage === 5 ? (
                <Link
                  href="/merchant/journey"
                  className="mx-perlapp-margin-mobile mt-3 flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 transition hover:bg-rose-100 md:mx-perlapp-margin-desktop"
                >
                  <span className="text-2xl">🤝</span>
                  <div className="min-w-0">
                    <p className="font-display text-sm font-semibold text-rose-800">
                      Conecta directo con tus clientes
                    </p>
                    <p className="font-display text-xs text-rose-600">
                      Último paso para completar tu perfil →
                    </p>
                  </div>
                </Link>
              ) : null}
            </>
          )}
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
            {role === "invitado" || geo.status === "denied" || geo.status === "unavailable" ? null
              : isNearbyPending || geo.status === "pending" || geo.status === "idle" ? (
                <>
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="flex w-[72px] shrink-0 flex-col items-center gap-perlapp-xs">
                      <div className="h-16 w-16 animate-pulse rounded-full bg-perlapp-line/50" />
                      <div className="h-3 w-12 animate-pulse rounded bg-perlapp-line/50" />
                    </div>
                  ))}
                </>
              ) : (
                nearbyMerchants.map((m, index) => {
                  const ringGradient = index % 2 === 0;
                  const avatarUrl =
                    m.businesses[0]?.business.profile_photo_url ??
                    m.profile_merchant?.photo ??
                    m.user.photo ??
                    null;
                  return (
                    <Link
                      key={m.user.id}
                      href={merchantProfileHref(m)}
                      className="flex w-[72px] shrink-0 flex-col items-center gap-perlapp-xs rounded-xl outline-none ring-perlapp-orange transition-opacity hover:opacity-90 focus-visible:ring-2"
                      aria-label={`Ver perfil: ${m.user.name}`}
                    >
                      <div
                        className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full p-0.5 ${
                          ringGradient
                            ? "bg-gradient-to-br from-perlapp-orange to-perlapp-tertiary"
                            : "bg-perlapp-line"
                        }`}
                      >
                        {avatarUrl ? (
                          <div className="relative h-[60px] w-[60px] overflow-hidden rounded-full border-2 border-perlapp-white">
                            <Image
                              src={avatarUrl}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="60px"
                            />
                          </div>
                        ) : (
                          <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full border-2 border-perlapp-white bg-perlapp-surfaceContainer font-display text-sm font-bold text-perlapp-teal">
                            {initialsFromName(m.user.name)}
                          </div>
                        )}
                      </div>
                      <span className="w-full truncate text-center font-display text-perlapp-label-sm leading-4 text-perlapp-inkMuted">
                        {m.businesses[0]?.business.business_name ?? m.user.name}
                      </span>
                    </Link>
                  );
                })
              )}
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

        {/* Publicaciones recientes */}
        <section className="w-full" aria-labelledby="posts-heading">
          <div className="mb-perlapp-sm px-perlapp-margin-mobile md:px-perlapp-margin-desktop">
            <h2
              id="posts-heading"
              className="font-display text-perlapp-headline-md leading-8 text-perlapp-ink"
            >
              Publicaciones recientes
            </h2>
          </div>

          <div className="flex flex-col bg-perlapp-canvas/20">
            {isFeedPending ? (
              <>
                {[0, 1, 2].map((i) => (
                  <div key={i} className="border-b border-perlapp-line/20 bg-perlapp-white p-4">
                    <div className="flex gap-3">
                      <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-perlapp-line/40" />
                      <div className="flex-1 space-y-2 pt-1">
                        <div className="h-3 w-32 animate-pulse rounded bg-perlapp-line/40" />
                        <div className="h-3 w-20 animate-pulse rounded bg-perlapp-line/30" />
                        <div className="mt-2 h-4 w-full animate-pulse rounded bg-perlapp-line/30" />
                        <div className="h-4 w-4/5 animate-pulse rounded bg-perlapp-line/30" />
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : feedPosts.length === 0 ? (
              <p className="px-perlapp-margin-mobile py-perlapp-md font-display text-sm text-perlapp-inkMuted">
                Aún no hay publicaciones para mostrar.
              </p>
            ) : (
              <>
                {feedPosts.map((post) => (
                  <FeedPostCard
                    key={post.id}
                    post={post}
                    merchantHref={merchantProfilePath(post.user_id)}
                  />
                ))}
                <div ref={sentinelRef} aria-hidden />
                {isFetchingNextPage ? (
                  <div className="flex justify-center py-perlapp-md">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-perlapp-line border-t-perlapp-orange" />
                  </div>
                ) : null}
              </>
            )}
          </div>
        </section>
      </main>

      <PerlappHomeBottomNav />

      <CartDrawer />
      <MerchantPostFAB />
    </div>
  );
}
