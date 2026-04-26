"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  BadgeCheck,
  Calendar,
  Edit2,
  Link as LinkIcon,
  Loader2,
  MapPin,
  MoreHorizontal,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { PerlappBottomNav } from "@/components/home/PerlappBottomNav";
import { PerlappHomeHeader } from "@/components/home/PerlappHomeHeader";
import { MerchantProfileCatalog } from "@/components/merchant/MerchantProfileCatalog";
import { MerchantPostFAB } from "@/components/merchant/MerchantPostFAB";
import { deleteMerchantPostUseCase } from "@/core/use-cases/merchant/delete-merchant-post.use-case";
import { updateMerchantPostUseCase } from "@/core/use-cases/merchant/update-merchant-post.use-case";
import { useMasterPublicationTypes } from "@/hooks/use-master-publication-types";
import type { MerchantProfileData } from "@/lib/merchant-profile.types";
import type { MerchantPost } from "@/lib/merchant-profile.types";
import { useAuthStore } from "@/store/auth.store";
import { useBuyerActivityStore } from "@/store/buyer-activity.store";
import { useMarketConnectionsStore } from "@/store/market-connections.store";
import { usePerlappRoleStore } from "@/store/perlapp-role.store";
import { DEFAULT_POST_CATEGORY_ID } from "@/lib/constants";

function pairKey(a: string, b: string): string {
  return [a, b].sort().join("|");
}

type MerchantProfileViewProps = {
  merchant: MerchantProfileData;
  onRefresh?: () => Promise<any>;
};

export function MerchantProfileView({ merchant, onRefresh }: MerchantProfileViewProps) {
  const role = usePerlappRoleStore((s) => s.role);
  const activeMarketId = usePerlappRoleStore((s) => s.activeMarketId);
  const token = useAuthStore((s) => s.token);
  const favoriteMerchantIds = useBuyerActivityStore((s) => s.favoriteMerchantIds);
  const toggleFavoriteMerchant = useBuyerActivityStore((s) => s.toggleFavoriteMerchant);
  const requests = useMarketConnectionsStore((s) => s.requests);
  const sendRequest = useMarketConnectionsStore((s) => s.sendRequest);

  const [tab, setTab] = useState<"posts" | "catalog">("posts");
  const [posts, setPosts] = useState<MerchantPost[]>(merchant.posts);
  const [postActionError, setPostActionError] = useState("");
  const [editingPost, setEditingPost] = useState<MerchantPost | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [editingPhotos, setEditingPhotos] = useState<File[]>([]);
  const [editingPreviewUrl, setEditingPreviewUrl] = useState<string | null>(null);
  const [removeExistingPhoto, setRemoveExistingPhoto] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);
  const [menuOpenPostId, setMenuOpenPostId] = useState<string | null>(null);
  const PULL_THRESHOLD = 80;

  const isCatalogOwner =
    role === "market" && (merchant.id === "me" || merchant.id === activeMarketId);
  const isPostsOwner = role === "market" && merchant.id === activeMarketId;
  const isBuyerFavorite = role === "comprador" && merchant.id !== "me";
  const isFavorite = favoriteMerchantIds.includes(merchant.id);
  const hasProfileActions = isBuyerFavorite;
  useEffect(() => {
    setPosts(merchant.posts);
  }, [merchant.posts]);

  const { mutateAsync: updatePost, isPending: isUpdatingPost } = useMutation({
    mutationFn: async ({
      postId,
      content,
      photos,
    }: {
      postId: string;
      content: string;
      photos: File[];
    }) => {
      if (!token) throw new Error("Tu sesión expiró. Inicia sesión de nuevo.");
      await updateMerchantPostUseCase(token, postId, {
        content,
        publication_type_id: DEFAULT_POST_CATEGORY_ID,
        photos,
      });
    },
  });
  const { mutateAsync: deletePost, isPending: isDeletingPost } = useMutation({
    mutationFn: async (postId: string) => {
      if (!token) throw new Error("Tu sesión expiró. Inicia sesión de nuevo.");
      await deleteMerchantPostUseCase(token, postId);
    },
  });

  const handleEditPost = async (post: MerchantPost) => {
    if (!isPostsOwner) return;
    setPostActionError("");
    setEditingPost(post);
    setEditingContent(post.body);
    setEditingPhotos([]);
    setEditingPreviewUrl(post.imageUrl || null);
    setRemoveExistingPhoto(false);
  };

  const closeEditModal = () => {
    if (isUpdatingPost) return;
    setEditingPost(null);
    setEditingContent("");
    setEditingPhotos([]);
    setEditingPreviewUrl(null);
    setRemoveExistingPhoto(false);
  };

  const saveEditedPost = async () => {
    if (!editingPost) return;
    const trimmed = editingContent.trim();
    if (!trimmed) {
      setPostActionError("El contenido no puede quedar vacío.");
      return;
    }
    try {
      setPostActionError("");
      await updatePost({
        postId: editingPost.id,
        content: trimmed,
        photos: editingPhotos,
      });
      // Update UI optimistically
      setPosts((prev) => prev.map((p) => {
        if (p.id !== editingPost.id) return p;
        const newImageUrl = editingPhotos.length > 0 && editingPreviewUrl 
          ? editingPreviewUrl 
          : (removeExistingPhoto ? undefined : p.imageUrl);
        return { ...p, body: trimmed, imageUrl: newImageUrl };
      }));
      closeEditModal();
    } catch (e) {
      setPostActionError(e instanceof Error && e.message ? e.message : "No se pudo actualizar la publicación.");
    }
  };

  const handleDeletePost = async (post: MerchantPost) => {
    if (!isPostsOwner) return;
    const accepted = window.confirm("¿Eliminar esta publicación? Esta acción no se puede deshacer.");
    if (!accepted) return;
    try {
      setPostActionError("");
      await deletePost(post.id);
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
    } catch (e) {
      setPostActionError(e instanceof Error && e.message ? e.message : "No se pudo eliminar la publicación.");
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY === 0 || window.scrollY > 0) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    if (diff > 0) {
      // Resistance effect
      setPullDistance(Math.min(diff * 0.4, 120));
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance > PULL_THRESHOLD && onRefresh && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
    setStartY(0);
  };

  const togglePostMenu = (postId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpenPostId((prev) => (prev === postId ? null : postId));
  };

  return (
    <div
      className="relative min-h-screen bg-perlapp-canvas pb-28 text-perlapp-ink antialiased selection:bg-perlapp-orange/20 selection:text-perlapp-ink md:pb-0"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="pointer-events-none absolute left-0 right-0 top-16 z-30 flex items-center justify-center overflow-hidden transition-all duration-200 ease-out"
        style={{ height: pullDistance, opacity: pullDistance / PULL_THRESHOLD }}
      >
        <div className="flex flex-col items-center gap-2 rounded-full bg-white/80 p-2 shadow-sm backdrop-blur-sm">
          <Loader2
            className={`h-6 w-6 text-perlapp-orange ${isRefreshing || pullDistance > PULL_THRESHOLD ? "animate-spin" : ""}`}
          />
        </div>
      </div>
      <PerlappHomeHeader position="sticky" showDesktopNav={false} />

      <main 
        className="mx-auto min-h-screen w-full max-w-2xl border-x border-perlapp-line/30 bg-perlapp-white transition-transform duration-200 ease-out"
        style={{ transform: `translateY(${pullDistance}px)` }}
      >
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
              {merchant.websiteHref && merchant.websiteLabel ? (
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
              ) : null}
              <div className="flex items-center gap-1">
                <Calendar className="h-[18px] w-[18px] shrink-0" aria-hidden />
                <span>{merchant.joinedLabel}</span>
              </div>
            </div>

            {(merchant.followingCount || merchant.followersCount) ? (
              <div className="mt-perlapp-sm flex gap-4">
                {role === "invitado" ? (
                  <>
                    {merchant.followingCount ? (
                      <div>
                        <span className="font-bold text-perlapp-ink">{merchant.followingCount}</span>{" "}
                        <span className="text-perlapp-inkMuted">Siguiendo</span>
                      </div>
                    ) : null}
                    {merchant.followersCount ? (
                      <div>
                        <span className="font-bold text-perlapp-ink">{merchant.followersCount}</span>{" "}
                        <span className="text-perlapp-inkMuted">Seguidores</span>
                      </div>
                    ) : null}
                  </>
                ) : (
                  <>
                    {merchant.followingCount ? (
                      <button type="button" className="cursor-pointer hover:underline">
                        <span className="font-bold text-perlapp-ink">{merchant.followingCount}</span>{" "}
                        <span className="text-perlapp-inkMuted">Siguiendo</span>
                      </button>
                    ) : null}
                    {merchant.followersCount ? (
                      <button type="button" className="cursor-pointer hover:underline">
                        <span className="font-bold text-perlapp-ink">{merchant.followersCount}</span>{" "}
                        <span className="text-perlapp-inkMuted">Seguidores</span>
                      </button>
                    ) : null}
                  </>
                )}
              </div>
            ) : null}
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
        </div>

        {tab === "catalog" ? (
          <MerchantProfileCatalog
            merchantId={merchant.id}
            merchantName={merchant.displayName}
            isOwner={isCatalogOwner}
            products={merchant.products}
          />
        ) : (
          <div className="flex flex-col bg-perlapp-canvas/20">
            {postActionError ? <p className="px-4 pt-4 text-sm text-red-600 font-medium">{postActionError}</p> : null}
            {posts.map((post) => (
              <article
                key={post.id}
                className="border-b border-perlapp-line/20 bg-perlapp-white p-4 transition-colors hover:bg-perlapp-surfaceContainerLow/30"
              >
                <div className="flex gap-3">
                  <div className="relative h-12 w-12 shrink-0">
                    <Image
                      src={merchant.avatarUrl}
                      alt=""
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-full border border-perlapp-line/20 object-cover shadow-sm"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <span className="font-display text-[16px] font-extrabold text-perlapp-ink">
                            {merchant.displayName}
                          </span>
                          {merchant.verified && (
                            <BadgeCheck className="h-4 w-4 text-perlapp-tertiary" />
                          )}
                        </div>
                        <div className="flex items-center gap-1 font-sans text-[14px] font-normal text-perlapp-inkMuted/80">
                          <span>{merchant.handle}</span>
                          <span>·</span>
                          <span>{post.timeAgo}</span>
                        </div>
                      </div>
                      
                      {isPostsOwner && (
                        <div className="relative">
                          <button
                            type="button"
                            onClick={(e) => togglePostMenu(post.id, e)}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-perlapp-inkMuted/60 transition-colors hover:bg-perlapp-orange/10 hover:text-perlapp-orange"
                            aria-label="Más opciones"
                          >
                            <MoreHorizontal className="h-5 w-5" />
                          </button>
                          
                          {menuOpenPostId === post.id && (
                            <>
                              <div 
                                className="fixed inset-0 z-[50]" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMenuOpenPostId(null);
                                }} 
                                aria-hidden="true" 
                              />
                              <div className="absolute right-0 top-10 z-[60] w-44 overflow-hidden rounded-xl border border-perlapp-line/60 bg-perlapp-white py-1.5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditPost(post);
                                    setMenuOpenPostId(null);
                                  }}
                                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left font-display text-[14px] font-semibold text-perlapp-ink transition-colors hover:bg-perlapp-surfaceContainer"
                                >
                                  <Edit2 className="h-4 w-4 text-perlapp-tertiary" strokeWidth={2.5} />
                                  Editar publicación
                                </button>
                                <div className="mx-2 my-1 border-t border-perlapp-line/20" />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeletePost(post);
                                    setMenuOpenPostId(null);
                                  }}
                                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left font-display text-[14px] font-semibold text-red-600 transition-colors hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" strokeWidth={2.5} />
                                  Eliminar publicación
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-2">
                       <p className="font-sans text-[17px] leading-[1.4] tracking-[-0.01em] text-perlapp-ink whitespace-pre-wrap">
                        {post.body}
                      </p>
                    </div>

                    {post.imageUrl ? (
                      <div className="mt-3 overflow-hidden rounded-2xl border border-perlapp-line/20 shadow-sm">
                        <div className="relative w-full">
                          <Image
                            src={post.imageUrl}
                            alt={post.imageAlt ?? ""}
                            width={800}
                            height={500}
                            className="h-auto w-full object-cover"
                            sizes="(max-width: 768px) 100vw, 672px"
                            priority={false}
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <PerlappBottomNav activeTab="profile" />
      <CartDrawer />
      {editingPost ? (
        <div className="fixed inset-0 z-[70] flex items-end justify-center p-4 sm:items-center" role="presentation">
          <button
            type="button"
            className="absolute inset-0 bg-perlapp-ink/50 backdrop-blur-[2px]"
            aria-label="Cerrar"
            onClick={closeEditModal}
          />
          <div
            className="relative z-10 w-full max-w-md rounded-2xl border border-perlapp-line/50 bg-perlapp-white p-5 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-post-title"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <h2 id="edit-post-title" className="font-display text-perlapp-headline-md font-bold text-perlapp-ink">
                Editar publicación
              </h2>
              <button
                type="button"
                onClick={closeEditModal}
                className="rounded-full p-2 text-perlapp-inkMuted hover:bg-perlapp-surfaceContainer"
                aria-label="Cerrar"
                disabled={isUpdatingPost}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <label className="flex flex-col gap-1">
                <span className="font-display text-perlapp-label-sm font-semibold text-perlapp-inkMuted">
                  Contenido
                </span>
                <textarea
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  className="min-h-28 rounded-xl border border-perlapp-line bg-perlapp-white px-3 py-2.5 font-sans text-sm text-perlapp-ink outline-none ring-perlapp-orange focus:ring-2"
                  placeholder="Escribe el contenido de la publicación"
                  maxLength={1200}
                />
              </label>
              
              <div className="flex flex-col gap-1">
                <span className="font-display text-perlapp-label-sm font-semibold text-perlapp-inkMuted">
                  Fotos <span className="font-normal text-perlapp-inkMuted/80">(opcional)</span>
                </span>
                
                {editingPreviewUrl ? (
                  <div className="relative mt-1 max-h-48 w-full overflow-hidden rounded-xl border border-perlapp-line/50">
                    <Image
                      src={editingPreviewUrl}
                      alt="Vista previa"
                      width={400}
                      height={300}
                      className="h-auto w-full object-cover max-h-48"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPreviewUrl(null);
                        setEditingPhotos([]);
                        setRemoveExistingPhoto(true);
                      }}
                      className="absolute right-2 top-2 rounded-full bg-perlapp-ink/70 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-perlapp-ink"
                      aria-label="Eliminar foto"
                    >
                      <X className="h-4 w-4" strokeWidth={3} />
                    </button>
                  </div>
                ) : (
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files ?? []);
                      setEditingPhotos(files);
                      if (files.length > 0) {
                        setEditingPreviewUrl(URL.createObjectURL(files[0]));
                        setRemoveExistingPhoto(false);
                      }
                    }}
                    className="block w-full text-sm text-perlapp-inkMuted file:mr-3 file:rounded-md file:border file:border-perlapp-line file:cursor-pointer file:bg-perlapp-surfaceContainer file:px-4 file:py-2 file:font-display file:text-[13px] file:font-semibold file:text-perlapp-ink hover:file:bg-perlapp-surfaceVariant"
                  />
                )}
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeEditModal}
                className="rounded-full px-4 py-2 font-display text-perlapp-label-md font-semibold text-perlapp-inkMuted hover:bg-perlapp-surfaceContainer"
                disabled={isUpdatingPost}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => void saveEditedPost()}
                disabled={isUpdatingPost}
                className="rounded-full bg-perlapp-orange px-5 py-2 font-display text-perlapp-label-md font-semibold text-white shadow-sm hover:bg-perlapp-orange/90 disabled:opacity-70"
              >
                {isUpdatingPost ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isPostsOwner && tab === "posts" && <MerchantPostFAB />}
    </div>
  );
}
