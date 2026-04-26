"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Link2, Share2, X } from "lucide-react";

/* ─────────────────────────────────────────────
   Social share targets
───────────────────────────────────────────── */
interface ShareTarget {
  id: string;
  label: string;
  icon: React.ReactNode;
  buildUrl: (encodedUrl: string, encodedText: string) => string;
  bgClass: string;
  fgClass: string;
  borderClass: string;
}

const SHARE_TARGETS: ShareTarget[] = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    buildUrl: (u, t) =>
      `https://wa.me/?text=${t}%20${u}`,
    bgClass: "bg-[#25D366]/10",
    fgClass: "text-[#25D366]",
    borderClass: "border-[#25D366]/30",
  },
  {
    id: "x",
    label: "X (Twitter)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.736l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    buildUrl: (u, t) =>
      `https://twitter.com/intent/tweet?text=${t}&url=${u}`,
    bgClass: "bg-black/5",
    fgClass: "text-black dark:text-white",
    borderClass: "border-black/20",
  },
  {
    id: "facebook",
    label: "Facebook",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    buildUrl: (u) =>
      `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    bgClass: "bg-[#1877F2]/10",
    fgClass: "text-[#1877F2]",
    borderClass: "border-[#1877F2]/30",
  },
  {
    id: "instagram",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
    buildUrl: (u, t) =>
      // Instagram doesn't support direct web share; open profile as fallback + copy works best
      `https://www.instagram.com/`,
    bgClass: "bg-gradient-to-br from-[#f09433]/10 via-[#e6683c]/10 to-[#bc1888]/10",
    fgClass: "text-[#c13584]",
    borderClass: "border-[#c13584]/30",
  },
];

/* ─────────────────────────────────────────────
   Props
───────────────────────────────────────────── */
interface Props {
  /** Canonical URL of the post. Falls back to current page url. */
  postUrl?: string;
  /** Short text shown in share message (e.g. business name + excerpt). */
  shareText?: string;
  /** Small label shown alongside icon, e.g. "Compartir" */
  label?: string;
  /** Compact mode – icon only button, no label */
  compact?: boolean;
}

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */
export function SharePostButton({
  postUrl,
  shareText = "¡Mira esta publicación en Perlapp!",
  label = "Compartir",
  compact = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const resolvedUrl =
    postUrl && postUrl.startsWith("http")
      ? postUrl
      : typeof window !== "undefined"
      ? window.location.href
      : "";

  const encodedUrl = encodeURIComponent(resolvedUrl);
  const encodedText = encodeURIComponent(shareText);

  /** Try native share sheet (mobile), fall back to bottom panel */
  const handleShare = async () => {
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function" &&
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    ) {
      try {
        await navigator.share({ title: shareText, url: resolvedUrl });
        return;
      } catch {
        // User cancelled or share failed – open panel
      }
    }
    setOpen(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resolvedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  // Bloquear scroll del body al abrir
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Cerrar al presionar Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Trigger button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          void handleShare();
        }}
        aria-label="Compartir publicación"
        className={`flex items-center gap-1.5 rounded-full text-perlapp-inkMuted/70 transition-colors hover:bg-perlapp-orange/10 hover:text-perlapp-orange ${
          compact
            ? "h-8 w-8 justify-center"
            : "px-3 py-1.5 font-display text-[13px] font-semibold"
        }`}
      >
        <Share2 className="h-4 w-4 shrink-0" strokeWidth={2} />
        {!compact && <span>{label}</span>}
      </button>

      {/* Bottom sheet */}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-0 sm:p-4"
          role="presentation"
        >
          {/* Backdrop */}
          <button
            type="button"
            className="absolute inset-0 bg-perlapp-ink/60 backdrop-blur-[6px] animate-in fade-in duration-300"
            aria-label="Cerrar"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-sheet-title"
            className="relative z-10 w-full max-w-md overflow-hidden rounded-t-[32px] border-t border-white/20 bg-perlapp-white shadow-2xl sm:rounded-[32px] animate-in slide-in-from-bottom-full duration-300 ease-out"
          >
            {/* Handle bar (mobile) */}
            <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-perlapp-line/50 sm:hidden" />

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-3 pt-5">
              <h2
                id="share-sheet-title"
                className="font-display text-[17px] font-bold text-perlapp-ink"
              >
                Compartir publicación
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-perlapp-inkMuted hover:bg-perlapp-surfaceContainer"
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Social grid */}
            <div className="grid grid-cols-4 gap-x-2 gap-y-4 px-5 pb-5">
              {SHARE_TARGETS.map((target) => (
                <button
                  key={target.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const url = target.buildUrl(encodedUrl, encodedText);
                    window.open(url, "_blank", "noopener,noreferrer,width=600,height=500");
                    // Also copy link to clipboard for Instagram (no web share)
                    if (target.id === "instagram") {
                      void navigator.clipboard.writeText(resolvedUrl).catch(() => {});
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2500);
                    }
                    setOpen(false);
                  }}
                  className={`flex flex-col items-center gap-2 rounded-2xl border p-3 transition-all hover:scale-105 active:scale-95 ${target.bgClass} ${target.borderClass}`}
                  aria-label={`Compartir en ${target.label}`}
                >
                  <span className={target.fgClass}>{target.icon}</span>
                  <span className="font-display text-[11px] font-semibold leading-none text-perlapp-inkMuted">
                    {target.id === "instagram" ? "Instagram*" : target.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="mx-5 border-t border-perlapp-line/30" />

            {/* Copy link row */}
            <div className="flex items-center gap-3 px-5 py-4">
              <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-perlapp-line/50 bg-perlapp-surfaceContainer px-3 py-2.5">
                <Link2 className="h-4 w-4 shrink-0 text-perlapp-inkMuted" />
                <span className="flex-1 truncate font-sans text-[13px] text-perlapp-inkMuted">
                  {resolvedUrl}
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  void handleCopy();
                }}
                className={`flex h-10 shrink-0 items-center gap-1.5 rounded-xl px-4 font-display text-[13px] font-semibold transition-all ${
                  copied
                    ? "bg-emerald-500 text-white"
                    : "bg-perlapp-orange text-white hover:bg-perlapp-orange/90"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    ¡Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copiar
                  </>
                )}
              </button>
            </div>

            {/* Instagram disclaimer */}
            <p className="px-5 pb-5 font-sans text-[11px] leading-4 text-perlapp-inkMuted/60">
              *Instagram no permite compartir directamente desde web. Se abrirá Instagram y el enlace se copiará al portapapeles.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
