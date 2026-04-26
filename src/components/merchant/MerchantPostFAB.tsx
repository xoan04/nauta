"use client";

import { useMemo, useState, useEffect } from "react";
import { Camera, Plus, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HttpError } from "@/core/http";
import { createMerchantPostUseCase } from "@/core/use-cases/merchant/create-merchant-post.use-case";
import { useAuthStore } from "@/store/auth.store";
import { usePerlappRoleStore } from "@/store/perlapp-role.store";
import { useQueryClient } from "@tanstack/react-query";
import { DEFAULT_POST_CATEGORY_ID } from "@/lib/constants";

export function MerchantPostFAB() {
  const role = usePerlappRoleStore((s) => s.role);
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();


  const [isOpen, setIsOpen] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [postPhotos, setPostPhotos] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  // Limpiar blobs
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, [previewUrls]);

  const canPublish = useMemo(() => {
    return Boolean(token && postContent.trim());
  }, [token, postContent]);

  const oversizedPhotos = useMemo(
    () => postPhotos.filter((file) => file.size > 10 * 1024 * 1024),
    [postPhotos]
  );

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setPostPhotos(files);

    previewUrls.forEach((url) => {
      if (url.startsWith("blob:")) URL.revokeObjectURL(url);
    });

    const newUrls = files.map((f) => URL.createObjectURL(f));
    setPreviewUrls(newUrls);
  };

  const closeModal = () => {
    if (publishing) return;
    setIsOpen(false);
    setPostContent("");
    setPostPhotos([]);
    setPublishError(null);
    previewUrls.forEach((url) => {
      if (url.startsWith("blob:")) URL.revokeObjectURL(url);
    });
    setPreviewUrls([]);
  };

  const handleCreatePost = async () => {
    if (!token) {
      setPublishError("Tu sesión expiró. Inicia sesión nuevamente.");
      return;
    }
    setPublishError(null);
    setPublishing(true);
    try {
      await createMerchantPostUseCase(
        {
          content: postContent,
          publication_type_id: DEFAULT_POST_CATEGORY_ID,
          photos: postPhotos,
        },
        token
      );
      
      // Invalidar consultas para refrescar los feeds si es necesario
      await queryClient.invalidateQueries({ queryKey: ["merchant-public-profile"] });
      
      closeModal();
    } catch (e) {
      if (e instanceof HttpError) {
        setPublishError(e.message);
      } else if (e instanceof Error && e.message) {
        setPublishError(e.message);
      } else {
        setPublishError("No se pudo crear la publicación. Inténtalo de nuevo.");
      }
      setPublishing(false);
    }
  };

  // Solo mostrar el FAB si es un comercio activo
  if (role !== "market") return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-[88px] right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-perlapp-orange tracking-wide text-white shadow-[0_4px_12px_rgba(217,90,33,0.4)] transition-transform hover:scale-105 active:scale-95 sm:bottom-6 sm:right-6"
        aria-label="Nueva publicación"
      >
        <Plus className="h-7 w-7" strokeWidth={2.5} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-perlapp-ink/40 backdrop-blur-sm sm:items-center sm:justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg overflow-hidden rounded-t-[32px] sm:rounded-3xl bg-perlapp-white shadow-2xl transition-transform animate-in slide-in-from-bottom-full duration-300 sm:slide-in-from-bottom-8"
          >
            {/* Cabecera */}
            <div className="flex items-center justify-between border-b border-perlapp-line/40 px-6 py-4">
              <h2 className="font-display text-perlapp-headline-sm font-bold text-perlapp-ink">
                Crear publicación
              </h2>
              <button
                type="button"
                className="rounded-full bg-perlapp-surfaceVariant p-2 text-perlapp-inkMuted transition-colors hover:bg-perlapp-line hover:text-perlapp-ink"
                onClick={closeModal}
                disabled={publishing}
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cuerpo */}
            <div className="flex max-h-[75vh] flex-col overflow-y-auto p-6 scrollbar-hide">
              <div className="flex flex-col gap-4">
                
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="¿Qué hay de nuevo en tu comercio?"
                  className="min-h-[120px] w-full resize-none rounded-xl bg-perlapp-surfaceContainer px-4 py-3 font-sans text-base text-perlapp-ink outline-none transition focus:bg-perlapp-white focus:ring-2 focus:ring-perlapp-orange/50"
                  disabled={publishing}
                />



                <div className="flex flex-col gap-2 pt-2">
                  <span className="font-display text-perlapp-label-sm font-semibold text-perlapp-inkMuted">
                    Fotos <span className="font-normal text-perlapp-inkMuted/80">(opcional)</span>
                  </span>

                  {previewUrls.length > 0 && (
                    <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                      {previewUrls.map((url, i) => (
                        <div key={i} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-perlapp-line bg-perlapp-surfaceVariant shadow-sm">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt={`Preview ${i}`} className="h-full w-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  <label className={`group mt-1 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-perlapp-line bg-perlapp-canvas/70 px-4 py-8 transition-colors hover:bg-perlapp-surfaceContainer active:bg-perlapp-surfaceVariant ${publishing ? 'pointer-events-none opacity-50' : ''}`}>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-perlapp-orange/10 text-perlapp-orange transition-transform group-active:scale-95">
                      <Camera className="h-6 w-6" />
                    </div>
                    <span className="font-display text-sm font-semibold tracking-wide text-perlapp-ink text-center">
                      Tomar foto o elegir de la galería
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoSelect}
                      className="hidden"
                      disabled={publishing}
                    />
                  </label>

                  {oversizedPhotos.length > 0 && (
                    <p className="mt-1 text-xs text-amber-600 bg-amber-50 p-2 rounded-md border border-amber-200">
                      {oversizedPhotos.length === 1
                        ? "⚠️ Hay 1 imagen mayor a 10 MB. Puede tardar más en publicarse."
                        : `⚠️ Hay ${oversizedPhotos.length} imágenes mayores a 10 MB.`}
                    </p>
                  )}
                  {publishError && (
                    <p className="mt-1 text-sm text-red-600 bg-red-50 p-2 rounded-md border border-red-200">{publishError}</p>
                  )}
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-perlapp-line/40 p-4">
              <Button
                type="button"
                disabled={!canPublish || publishing}
                onClick={() => void handleCreatePost()}
                className="w-full h-12 rounded-xl bg-perlapp-orange font-display text-base font-bold text-white shadow-sm hover:bg-perlapp-orange/90 active:scale-[0.98] transition-transform disabled:opacity-70 disabled:active:scale-100"
              >
                {publishing ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" /> Publicando...
                  </span>
                ) : (
                  "Publicar"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
