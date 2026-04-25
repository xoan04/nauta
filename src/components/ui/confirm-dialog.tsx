"use client";

import { useEffect } from "react";

export type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "default",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const confirmClasses =
    variant === "danger"
      ? "bg-red-600 text-white shadow-sm hover:bg-red-600/90 focus-visible:ring-red-600/40"
      : "bg-perlapp-orange text-white shadow-sm hover:bg-perlapp-orange/90 focus-visible:ring-perlapp-orange/40";

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-perlapp-ink/50 backdrop-blur-[2px]"
        aria-label={cancelLabel}
        onClick={onCancel}
      />
      <div
        className="relative z-10 flex max-h-[min(90dvh,520px)] w-full max-w-md flex-col rounded-t-2xl border border-perlapp-line/50 bg-perlapp-white shadow-2xl sm:max-h-[min(85dvh,480px)] sm:rounded-2xl"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-desc"
      >
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-4 pt-5 sm:px-6 sm:pb-5 sm:pt-6">
          <h2 id="confirm-dialog-title" className="font-display text-perlapp-headline-md font-bold text-perlapp-ink">
            {title}
          </h2>
          <p id="confirm-dialog-desc" className="mt-2 font-sans text-sm leading-relaxed text-perlapp-inkMuted">
            {description}
          </p>
        </div>
        <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-perlapp-line/40 bg-perlapp-canvas/30 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:flex-row sm:justify-end sm:gap-3 sm:px-6 sm:py-4">
          <button
            type="button"
            onClick={onCancel}
            className="w-full rounded-full px-4 py-3 font-display text-perlapp-label-md font-semibold text-perlapp-inkMuted transition hover:bg-perlapp-surfaceContainer sm:w-auto sm:py-2.5"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`w-full rounded-full px-5 py-3 font-display text-perlapp-label-md font-semibold outline-none ring-2 ring-transparent focus-visible:ring-offset-2 focus-visible:ring-offset-perlapp-white sm:w-auto sm:py-2.5 ${confirmClasses}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
