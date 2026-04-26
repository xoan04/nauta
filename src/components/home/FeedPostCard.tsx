"use client";

import Image from "next/image";
import Link from "next/link";
import type { FeedPost } from "@/core/models/feed.model";
import { SharePostButton } from "@/components/shared/SharePostButton";

type Props = {
  post: FeedPost;
  merchantHref: string;
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "short" });
}

export function FeedPostCard({ post, merchantHref }: Props) {
  const avatarUrl = post.merchant.photo ?? post.business.photo;
  const firstPhoto = post.photos[0]?.url ?? null;
  const isPromotion = post.publication_type_code === "promotion";

  return (
    <article className="border-b border-perlapp-line/20 bg-perlapp-white p-4 transition-colors hover:bg-perlapp-surfaceContainerLow/30">
      <div className="flex gap-3">
        {/* Avatar */}
        <Link
          href={merchantHref}
          className="shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-perlapp-orange focus-visible:ring-offset-2 rounded-full"
          aria-label={`Ver perfil de ${post.merchant.name}`}
          tabIndex={-1}
        >
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 rounded-full border border-perlapp-line/20 object-cover shadow-sm"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-perlapp-line/20 bg-perlapp-surfaceContainer font-display text-sm font-bold text-perlapp-teal">
              {post.merchant.name.slice(0, 2).toUpperCase()}
            </div>
          )}
        </Link>

        <div className="min-w-0 flex-1">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <Link
              href={merchantHref}
              className="min-w-0 outline-none focus-visible:ring-2 focus-visible:ring-perlapp-orange rounded"
            >
              <div className="flex flex-wrap items-center gap-1">
                <span className="font-display text-[15px] font-extrabold text-perlapp-ink hover:underline">
                  {post.business.name}
                </span>
              </div>
              <div className="flex items-center gap-1 font-sans text-[13px] text-perlapp-inkMuted/80">
                <span>{post.merchant.name}</span>
                <span>·</span>
                <span>{timeAgo(post.created_at)}</span>
              </div>
            </Link>

            {isPromotion ? (
              <span className="shrink-0 rounded-full bg-perlapp-orange/10 px-2 py-0.5 font-display text-[11px] font-semibold uppercase tracking-wider text-perlapp-orange">
                Promo
              </span>
            ) : null}
          </div>

          {/* Content */}
          <p className="mt-2 font-sans text-[15px] leading-[1.45] tracking-[-0.01em] text-perlapp-ink whitespace-pre-wrap">
            {post.content}
          </p>

          {/* Photo */}
          {firstPhoto ? (
            <div className="mt-3 overflow-hidden rounded-2xl border border-perlapp-line/20 shadow-sm">
              <Image
                src={firstPhoto}
                alt=""
                width={800}
                height={500}
                className="h-auto w-full object-cover"
                sizes="(max-width: 672px) 100vw, 672px"
              />
            </div>
          ) : null}

          {/* Share action row */}
          <div className="mt-3 flex items-center">
            <SharePostButton
              postUrl={merchantHref}
              shareText={`${post.business.name}: ${post.content.slice(0, 100)}${post.content.length > 100 ? "…" : ""}`}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
