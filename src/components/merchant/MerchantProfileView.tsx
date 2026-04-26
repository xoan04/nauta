"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  BarChart2,
  BadgeCheck,
  Calendar,
  Heart,
  Link as LinkIcon,
  Loader2,
  MapPin,
  MessageCircle,
  Repeat2,
  Star,
} from "lucide-react";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { PerlappBottomNav } from "@/components/home/PerlappBottomNav";
import { PerlappHomeHeader } from "@/components/home/PerlappHomeHeader";
import { MerchantProfileCatalog } from "@/components/merchant/MerchantProfileCatalog";
import type { MerchantProfileData } from "@/lib/merchant-profile.types";
import { useBuyerActivityStore } from "@/store/buyer-activity.store";
import { useMarketConnectionsStore } from "@/store/market-connections.store";
import { usePerlappRoleStore } from "@/store/perlapp-role.store";

function pairKey(a: string, b: string): string {
  return [a, b].sort().join("|");
}

type MerchantProfileViewProps = {
  merchant: MerchantProfileData;
};

export function MerchantProfileView({ merchant }: MerchantProfileViewProps) {
  const role = usePerlappRoleStore((s) => s.role);
  const activeMarketId = usePerlappRoleStore((s) => s.activeMarketId);
  const favoriteMerchantIds = useBuyerActivityStore((s) => s.favoriteMerchantIds);
  const toggleFavoriteMerchant = useBuyerActivityStore((s) => s.toggleFavoriteMerchant);
  const requests = useMarketConnectionsStore((s) => s.requests);
  const sendRequest = useMarketConnectionsStore((s) => s.sendRequest);

  const [tab, setTab] = useState<"posts" | "catalog" | "info">("posts");

  const isCatalogOwner =
    role === "market" && (merchant.id === "me" || merchant.id === activeMarketId);

  const isBuyerFavorite = role === "comprador" && merchant.id !== "me";
  const isFavorite = favoriteMerchantIds.includes(merchant.id);
  /** Otro comercio y no el comercio activo (no conectar contigo mismo). */
  const showB2bConnect =
    role === "market" && merchant.id !== "me" && merchant.id !== activeMarketId;
  const key =
    activeMarketId && merchant.id !== "me" ? pairKey(activeMarketId, merchant.id) : "";
  const pairMatches = requests.filter(
    (r) => pairKey(r.fromMerchantId, r.toMerchantId) === key
  );
  const hasAccepted = pairMatches.some((r) => r.status === "aceptada");
  const hasPending = pairMatches.some((r) => r.status === "pendiente");
  const canSendB2b = Boolean(activeMarketId) && !hasAccepted && !hasPending;

  const hasProfileActions = isBuyerFavorite || showB2bConnect;

  return (
    <div className="min-h-screen bg-perlapp-canvas pb-28 text-perlapp-ink antialiased selection:bg-perlapp-orange/20 selection:text-perlapp-ink md:pb-0">
      <PerlappHomeHeader position="sticky" showDesktopNav={false} />

      <main className="mx-auto min-h-screen w-full max-w-2xl border-x border-perlapp-line/30 bg-perlapp-white">
        <div className="relative bg-perlapp-white">
          <div className="relative h-32 w-full overflow-hidden bg-perlapp-surfaceVariant md:h-48">
            <Image
              src={merchant.bannerUrl}
              alt=""
              fill
              className="object-cover opacity-90 mix-blend-multiply"
              sizes="(max-width: 672px) 100vw, 672px"
              priority
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-perlapp-canvas/50 to-transparent"
              aria-hidden
            />
          </div>

          <div
            className={`relative -mt-10 flex items-end px-4 md:-mt-12 ${hasProfileActions ? "justify-between" : ""}`}
          >
            <div className="relative z-10 h-20 w-20 shrink-0 overflow-hidden rounded-full border-4 border-perlapp-white bg-perlapp-canvas shadow-perlapp-float md:h-24 md:w-24">
              <Image
                src={merchant.avatarUrl}
                alt={merchant.displayName}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
            <div className="mb-2 flex flex-col items-end gap-2 sm:flex-row sm:items-center md:mb-4">
              <div className="flex flex-wrap items-center justify-end gap-2">
                {isBuyerFavorite ? (
                  <button
                    type="button"
                    onClick={() => toggleFavoriteMerchant(merchant.id)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-perlapp-line bg-perlapp-white text-perlapp-inkMuted transition-colors hover:bg-perlapp-surfaceContainer"
                    aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
                  >
                    <Star
                      className={`h-5 w-5 ${isFavorite ? "fill-perlapp-orange text-perlapp-orange" : ""}`}
                      strokeWidth={2}
                    />
                  </button>
                ) : null}
                {showB2bConnect ? (
                  <button
                    type="button"
                    disabled={!canSendB2b}
                    title={
                      !activeMarketId
                        ? "Elige tu comercio activo para enviar la solicitud."
                        : hasAccepted
                          ? "Conexión B2B activa con este comercio."
                          : hasPending
                            ? "Solicitud enviada. Revisa notificaciones para ver la respuesta."
                            : "Enviar solicitud de conexión B2B"
                    }
                    onClick={() => {
                      if (!activeMarketId || !canSendB2b) return;
                      sendRequest(activeMarketId, merchant.id);
                    }}
                    className={`rounded-full px-6 py-2 font-display text-perlapp-label-md transition-all active:scale-95 ${
                      hasAccepted
                        ? "border border-emerald-400/60 bg-emerald-50 text-emerald-950 shadow-none hover:bg-emerald-100/90"
                        : hasPending
                          ? "border border-amber-400/70 bg-amber-50 text-amber-950 shadow-none hover:bg-amber-100/90"
                          : canSendB2b
                            ? "bg-perlapp-orange text-white shadow-[0_2px_0_0_#862300] hover:bg-perlapp-orange/90 hover:translate-y-px hover:shadow-none"
                            : "cursor-not-allowed border border-perlapp-line bg-perlapp-surfaceVariant text-perlapp-inkMuted shadow-none"
                    }`}
                  >
                    {hasAccepted ? "Conectado" : hasPending ? "Pendiente" : "Conectar"}
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          <div className="px-4 pb-4 pt-3">
            <h1 className="font-display text-perlapp-headline-md font-bold leading-8 tracking-tight text-[#2c6956] md:text-[32px] md:leading-10">
              {merchant.displayName}
            </h1>
            <p className="mt-1 font-sans text-base leading-6 text-perlapp-inkMuted">
              {merchant.handle} · {merchant.categoryLabel}
            </p>
            <p className="mt-perlapp-sm font-sans text-base leading-6 text-perlapp-ink">{merchant.bio}</p>

            <div className="mt-perlapp-md flex flex-wrap gap-x-4 gap-y-2 font-sans text-base leading-6 text-perlapp-inkMuted">
              <div className="flex items-center gap-1">
                <MapPin className="h-[18px] w-[18px] shrink-0" aria-hidden />
                <span>{merchant.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <LinkIcon className="h-[18px] w-[18px] shrink-0" aria-hidden />
                <Link
                  href={merchant.websiteHref}
                  className="text-perlapp-tertiary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {merchant.websiteLabel}
                </Link>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-[18px] w-[18px] shrink-0" aria-hidden />
                <span>{merchant.joinedLabel}</span>
              </div>
            </div>

            <div className="mt-perlapp-sm flex gap-4">
              {role === "invitado" ? (
                <>
                  <div>
                    <span className="font-bold text-perlapp-ink">{merchant.followingCount}</span>{" "}
                    <span className="text-perlapp-inkMuted">Siguiendo</span>
                  </div>
                  <div>
                    <span className="font-bold text-perlapp-ink">{merchant.followersCount}</span>{" "}
                    <span className="text-perlapp-inkMuted">Seguidores</span>
                  </div>
                </>
              ) : (
                <>
                  <button type="button" className="cursor-pointer hover:underline">
                    <span className="font-bold text-perlapp-ink">{merchant.followingCount}</span>{" "}
                    <span className="text-perlapp-inkMuted">Siguiendo</span>
                  </button>
                  <button type="button" className="cursor-pointer hover:underline">
                    <span className="font-bold text-perlapp-ink">{merchant.followersCount}</span>{" "}
                    <span className="text-perlapp-inkMuted">Seguidores</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="sticky top-16 z-30 flex border-b border-perlapp-line/50 bg-perlapp-white/90 backdrop-blur-md">
          <button
            type="button"
            className="group relative flex min-w-0 flex-1 justify-center px-1 py-3 text-center transition-colors hover:bg-perlapp-surfaceVariant/30 sm:py-4"
            onClick={() => setTab("posts")}
          >
            <span
              className={`truncate font-display text-[13px] font-medium sm:text-perlapp-label-md ${
                tab === "posts" ? "font-bold text-perlapp-orange" : "text-perlapp-inkMuted group-hover:text-perlapp-ink"
              }`}
            >
              Publicaciones
            </span>
            {tab === "posts" ? (
              <span className="absolute bottom-0 left-1/2 h-1 w-8 -translate-x-1/2 rounded-t-full bg-perlapp-orange sm:w-12" />
            ) : null}
          </button>
          <button
            type="button"
            className="group relative flex min-w-0 flex-1 justify-center px-1 py-3 text-center transition-colors hover:bg-perlapp-surfaceVariant/30 sm:py-4"
            onClick={() => setTab("catalog")}
          >
            <span
              className={`truncate font-display text-[13px] font-medium sm:text-perlapp-label-md ${
                tab === "catalog"
                  ? "font-bold text-perlapp-orange"
                  : "text-perlapp-inkMuted group-hover:text-perlapp-ink"
              }`}
            >
              Catálogo
            </span>
            {tab === "catalog" ? (
              <span className="absolute bottom-0 left-1/2 h-1 w-8 -translate-x-1/2 rounded-t-full bg-perlapp-orange sm:w-12" />
            ) : null}
          </button>
          <button
            type="button"
            className="group relative flex min-w-0 flex-1 justify-center px-1 py-3 text-center transition-colors hover:bg-perlapp-surfaceVariant/30 sm:py-4"
            onClick={() => setTab("info")}
          >
            <span
              className={`truncate font-display text-[13px] font-medium sm:text-perlapp-label-md ${
                tab === "info" ? "font-bold text-perlapp-orange" : "text-perlapp-inkMuted group-hover:text-perlapp-ink"
              }`}
            >
              Información
            </span>
            {tab === "info" ? (
              <span className="absolute bottom-0 left-1/2 h-1 w-8 -translate-x-1/2 rounded-t-full bg-perlapp-orange sm:w-12" />
            ) : null}
          </button>
        </div>

        {tab === "catalog" ? (
          <MerchantProfileCatalog
            merchantId={merchant.id}
            merchantName={merchant.displayName}
            isOwner={isCatalogOwner}
          />
        ) : tab === "posts" ? (
          <div className="flex flex-col">
            {merchant.posts.map((post) => (
              <article
                key={post.id}
                className={`border-b border-perlapp-line/30 p-4 transition-colors ${
                  role === "invitado"
                    ? "cursor-default"
                    : "cursor-pointer hover:bg-perlapp-canvas/50"
                }`}
              >
                <div className="flex gap-3">
                  <Image
                    src={merchant.avatarUrl}
                    alt=""
                    width={40}
                    height={40}
                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1 font-display text-perlapp-label-md">
                      <span className="font-bold text-perlapp-ink">{merchant.displayName}</span>
                      {merchant.verified ? (
                        <BadgeCheck
                          className="h-4 w-4 shrink-0 text-perlapp-tertiary"
                          aria-label="Verificado"
                          strokeWidth={2}
                        />
                      ) : null}
                      <span className="font-normal text-perlapp-inkMuted">{merchant.handle}</span>
                      <span className="font-normal text-perlapp-inkMuted">· {post.timeAgo}</span>
                    </div>
                    <p className="mt-1 font-sans text-base leading-6 text-perlapp-ink">{post.body}</p>
                    {post.imageUrl ? (
                      <div className="mt-3 overflow-hidden rounded-xl border border-perlapp-line/30 shadow-perlapp-float">
                        <div className="relative max-h-64 w-full">
                          <Image
                            src={post.imageUrl}
                            alt={post.imageAlt ?? ""}
                            width={800}
                            height={400}
                            className="h-auto max-h-64 w-full object-cover"
                            sizes="(max-width: 672px) 100vw, 672px"
                          />
                        </div>
                      </div>
                    ) : null}
                    {role === "invitado" ? (
                      <div
                        className="mt-3 flex max-w-md justify-between text-perlapp-inkMuted/75"
                        aria-label="Métricas de la publicación (solo lectura)"
                      >
                        <div className="flex items-center gap-2">
                          <MessageCircle className="h-[18px] w-[18px]" />
                          <span className="font-display text-perlapp-label-sm">{post.stats.comments}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Repeat2 className="h-[18px] w-[18px]" />
                          <span className="font-display text-perlapp-label-sm">{post.stats.reposts}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart className="h-[18px] w-[18px]" />
                          <span className="font-display text-perlapp-label-sm">{post.stats.likes}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BarChart2 className="h-[18px] w-[18px]" />
                          <span className="font-display text-perlapp-label-sm">{post.stats.views}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 flex max-w-md justify-between text-perlapp-inkMuted">
                        <button
                          type="button"
                          className="group flex items-center gap-2 transition-colors hover:text-perlapp-tertiary"
                        >
                          <MessageCircle className="h-[18px] w-[18px] rounded-full p-1.5 transition-colors group-hover:bg-perlapp-tertiary/10" />
                          <span className="font-display text-perlapp-label-sm">{post.stats.comments}</span>
                        </button>
                        <button
                          type="button"
                          className="group flex items-center gap-2 transition-colors hover:text-[#2c6956]"
                        >
                          <Repeat2 className="h-[18px] w-[18px] rounded-full p-1.5 transition-colors group-hover:bg-[#2c6956]/10" />
                          <span className="font-display text-perlapp-label-sm">{post.stats.reposts}</span>
                        </button>
                        <button
                          type="button"
                          className="group flex items-center gap-2 transition-colors hover:text-perlapp-orange"
                        >
                          <Heart className="h-[18px] w-[18px] rounded-full p-1.5 transition-colors group-hover:bg-perlapp-orange/10" />
                          <span className="font-display text-perlapp-label-sm">{post.stats.likes}</span>
                        </button>
                        <button
                          type="button"
                          className="group flex items-center gap-2 transition-colors hover:text-perlapp-tertiary"
                        >
                          <BarChart2 className="h-[18px] w-[18px] rounded-full p-1.5 transition-colors group-hover:bg-perlapp-tertiary/10" />
                          <span className="font-display text-perlapp-label-sm">{post.stats.views}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
            <div className="flex items-center justify-center py-8 text-perlapp-orange">
              <Loader2 className="h-8 w-8 animate-spin" aria-hidden />
            </div>
          </div>
        ) : (
          <div className="space-y-4 p-4 font-sans text-base leading-6 text-perlapp-ink">
            <p className="text-perlapp-inkMuted">{merchant.bio}</p>
            {merchant.infoExtra ? <p>{merchant.infoExtra}</p> : null}
            <ul className="list-inside list-disc space-y-2 text-perlapp-inkMuted">
              <li>
                Web:{" "}
                <Link href={merchant.websiteHref} className="text-perlapp-tertiary hover:underline" target="_blank" rel="noopener noreferrer">
                  {merchant.websiteLabel}
                </Link>
              </li>
              <li>Ubicación: {merchant.location}</li>
              <li>{merchant.joinedLabel}</li>
            </ul>
          </div>
        )}
      </main>

      <PerlappBottomNav activeTab="profile" />
      <CartDrawer />
    </div>
  );
}
