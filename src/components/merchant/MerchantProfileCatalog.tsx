"use client";

import { useState } from "react";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImageIcon, Pencil, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import type { ProfileCatalogProduct } from "@/lib/merchant-catalog.types";
import { formatPrice } from "@/lib/cart.utils";
import { useCartStore } from "@/store/cart.store";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { getMyMerchantProductsUseCase } from "@/core/use-cases/merchant/get-my-merchant-products.use-case";
import { createMerchantProductUseCase } from "@/core/use-cases/merchant/create-merchant-product.use-case";
import { updateMerchantProductUseCase } from "@/core/use-cases/merchant/update-merchant-product.use-case";
import { deleteMerchantProductUseCase } from "@/core/use-cases/merchant/delete-merchant-product.use-case";
import { useAuthStore } from "@/store/auth.store";
import { useMerchantCatalogStore } from "@/store/merchant-catalog.store";

type MerchantProfileCatalogProps = {
  merchantId: string;
  merchantName: string;
  isOwner: boolean;
};

type FormState = {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  photos: File[];
};

const emptyForm: FormState = { name: "", description: "", price: "", imageUrl: "", photos: [] };
const EMPTY_PRODUCTS: ProfileCatalogProduct[] = [];

function isHttpsImageUrl(url: string): boolean {
  const normalized = url.trim().toLowerCase();
  return normalized.startsWith("https://") || normalized.startsWith("http://");
}

export function MerchantProfileCatalog({ merchantId, merchantName, isOwner }: MerchantProfileCatalogProps) {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const localProducts = useMerchantCatalogStore((s) => s.byMerchant[merchantId] ?? EMPTY_PRODUCTS);
  const addProduct = useMerchantCatalogStore((s) => s.addProduct);
  const updateProduct = useMerchantCatalogStore((s) => s.updateProduct);
  const deleteProduct = useMerchantCatalogStore((s) => s.deleteProduct);
  const addToCart = useCartStore((s) => s.addItem);
  const openDrawer = useCartStore((s) => s.openDrawer);
  const {
    data: apiProducts,
    isLoading: isLoadingApiProducts,
    isError: isErrorApiProducts,
    refetch: refetchApiProducts,
  } = useQuery({
    queryKey: ["merchant-my-products"],
    queryFn: () => getMyMerchantProductsUseCase(token ?? ""),
    enabled: isOwner && Boolean(token),
  });
  const useApiCatalog = isOwner && Boolean(token) && !isErrorApiProducts;
  const products = isOwner
    ? isErrorApiProducts
      ? localProducts
      : (apiProducts ?? EMPTY_PRODUCTS)
    : localProducts;

  const [modal, setModal] = useState<null | { mode: "create" } | { mode: "edit"; product: ProfileCatalogProduct }>(
    null
  );
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<ProfileCatalogProduct | null>(null);
  const refreshProducts = async () => {
    await Promise.all([
      refetchApiProducts(),
      queryClient.invalidateQueries({ queryKey: ["merchant-my-products"] }),
    ]);
  };

  const { mutateAsync: createApiProduct, isPending: isCreatingApiProduct } = useMutation({
    mutationFn: async () => {
      if (!token) {
        throw new Error("Tu sesión expiró. Inicia sesión de nuevo.");
      }
      const name = form.name.trim();
      const description = form.description.trim();
      const price = form.price.trim();
      if (name.length < 2) {
        throw new Error("El nombre debe tener al menos 2 caracteres.");
      }
      if (!price) {
        throw new Error("Introduce un precio válido (COP).");
      }
      await createMerchantProductUseCase(token, {
        name,
        description,
        price,
        photos: form.photos,
      });
    },
    onSuccess: async () => {
      await refreshProducts();
    },
  });
  const { mutateAsync: updateApiProduct, isPending: isUpdatingApiProduct } = useMutation({
    mutationFn: async (productId: string) => {
      if (!token) {
        throw new Error("Tu sesión expiró. Inicia sesión de nuevo.");
      }
      const name = form.name.trim();
      const description = form.description.trim();
      const price = form.price.trim();
      if (name.length < 2) {
        throw new Error("El nombre debe tener al menos 2 caracteres.");
      }
      if (!price) {
        throw new Error("Introduce un precio válido (COP).");
      }
      await updateMerchantProductUseCase(token, productId, {
        name,
        description,
        price,
        photos: form.photos,
      });
    },
    onSuccess: async () => {
      await refreshProducts();
    },
  });
  const { mutateAsync: deleteApiProduct, isPending: isDeletingApiProduct } = useMutation({
    mutationFn: async (productId: string) => {
      if (!token) {
        throw new Error("Tu sesión expiró. Inicia sesión de nuevo.");
      }
      await deleteMerchantProductUseCase(token, productId);
    },
    onSuccess: async () => {
      await refreshProducts();
    },
  });

  const openCreate = () => {
    setForm(emptyForm);
    setFormError("");
    setModal({ mode: "create" });
  };

  const openEdit = (product: ProfileCatalogProduct) => {
    setForm({
      name: product.name,
      description: "",
      price: String(product.price),
      imageUrl: product.imageUrl,
      photos: [],
    });
    setFormError("");
    setModal({ mode: "edit", product });
  };

  const closeModal = () => {
    setModal(null);
    setFormError("");
  };

  const validateForm = (): ProfileCatalogProduct | null => {
    const name = form.name.trim();
    if (name.length < 2) {
      setFormError("El nombre debe tener al menos 2 caracteres.");
      return null;
    }
    const price = Number(form.price.replace(/\s/g, "").replace(",", "."));
    if (!Number.isFinite(price) || price < 0) {
      setFormError("Introduce un precio válido (COP).");
      return null;
    }
    const imageUrl = form.imageUrl.trim();
    if (imageUrl !== "" && !isHttpsImageUrl(imageUrl)) {
      setFormError("Si añades imagen, debe ser una URL que empiece por https://");
      return null;
    }
    return { id: "", name, price: Math.round(price), imageUrl };
  };

  const handleSave = async () => {
    if (useApiCatalog && modal?.mode === "create") {
      try {
        setFormError("");
        await createApiProduct();
        closeModal();
      } catch (e) {
        const message = e instanceof Error && e.message ? e.message : "No se pudo crear el producto.";
        setFormError(message);
      }
      return;
    }
    if (useApiCatalog && modal?.mode === "edit") {
      try {
        setFormError("");
        await updateApiProduct(modal.product.id);
        closeModal();
      } catch (e) {
        const message = e instanceof Error && e.message ? e.message : "No se pudo actualizar el producto.";
        setFormError(message);
      }
      return;
    }
    const parsed = validateForm();
    if (!parsed) return;
    if (modal?.mode === "create") {
      addProduct(merchantId, { name: parsed.name, price: parsed.price, imageUrl: parsed.imageUrl });
    } else if (modal?.mode === "edit") {
      updateProduct(merchantId, modal.product.id, {
        name: parsed.name,
        price: parsed.price,
        imageUrl: parsed.imageUrl,
      });
    }
    closeModal();
  };

  const requestDelete = (product: ProfileCatalogProduct) => {
    setDeleteTarget(product);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    if (useApiCatalog) {
      try {
        await deleteApiProduct(deleteTarget.id);
        setDeleteTarget(null);
      } catch (e) {
        const message = e instanceof Error && e.message ? e.message : "No se pudo eliminar el producto.";
        setFormError(message);
      }
      return;
    }
    deleteProduct(merchantId, deleteTarget.id);
    setDeleteTarget(null);
  };

  const handleAddToCart = (p: ProfileCatalogProduct) => {
    if (isOwner) return;
    addToCart({
      productId: p.id,
      name: p.name,
      price: p.price,
      ...(isHttpsImageUrl(p.imageUrl) ? { imageUrl: p.imageUrl.trim() } : {}),
      merchantId,
      merchantName,
      quantity: 1,
    });
    openDrawer();
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="font-sans text-sm leading-relaxed text-perlapp-inkMuted">
          {isOwner
            ? "Gestiona el catálogo que ven tus clientes. En tu propio comercio no puedes usar el carrito: solo crear, editar o borrar productos."
            : "Productos publicados por este comercio."}
        </p>
        {isOwner ? (
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-full bg-perlapp-orange px-4 py-2 font-display text-perlapp-label-md font-semibold text-white shadow-[0_2px_0_0_#862300] transition hover:bg-perlapp-orange/90 active:translate-y-px active:shadow-none"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            Nuevo producto
          </button>
        ) : null}
      </div>
      {isOwner && isLoadingApiProducts ? (
        <p className="mb-3 text-sm text-perlapp-inkMuted">Cargando productos…</p>
      ) : null}
      {isOwner && isErrorApiProducts ? (
        <p className="mb-3 text-sm text-red-600">
          No se pudieron cargar los productos del merchant. Se muestra el catálogo local.
        </p>
      ) : null}

      {products.length === 0 ? (
        <p className="rounded-xl border border-dashed border-perlapp-line/60 bg-perlapp-canvas/40 px-4 py-8 text-center font-sans text-sm text-perlapp-inkMuted">
          {isOwner
            ? "Aún no hay productos. Pulsa “Nuevo producto” para añadir el primero."
            : "Este comercio aún no publicó productos en el catálogo."}
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:gap-4">
          {products.map((p) => (
            <li
              key={p.id}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-perlapp-line/40 bg-perlapp-white shadow-perlapp-float"
            >
              {isOwner ? (
                <div className="absolute right-2 top-2 z-10 flex gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(p)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-perlapp-white/95 text-perlapp-ink shadow-sm ring-1 ring-perlapp-line/50 backdrop-blur hover:bg-perlapp-surfaceContainer"
                    aria-label={`Editar ${p.name}`}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => requestDelete(p)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-perlapp-white/95 text-red-600 shadow-sm ring-1 ring-perlapp-line/50 backdrop-blur hover:bg-red-50"
                    aria-label={`Eliminar ${p.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : null}
              <div className="relative aspect-square w-full bg-perlapp-surfaceVariant">
                {isHttpsImageUrl(p.imageUrl) ? (
                  <Image
                    src={p.imageUrl.trim()}
                    alt={p.name}
                    fill
                    className="object-cover"
                    sizes="(max-width:768px) 45vw, 320px"
                  />
                ) : (
                  <div
                    className="flex h-full w-full flex-col items-center justify-center gap-1 px-2 text-center"
                    aria-hidden
                  >
                    <ImageIcon className="h-10 w-10 text-perlapp-inkMuted/45" strokeWidth={1.25} />
                    <span className="font-display text-[10px] font-medium uppercase tracking-wide text-perlapp-inkMuted/70">
                      Sin foto
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2 p-3">
                <p className="line-clamp-2 font-display text-perlapp-label-md font-semibold leading-snug text-perlapp-ink">
                  {p.name}
                </p>
                <p className="font-display text-sm font-bold text-[#2c6956]">{formatPrice(p.price)}</p>
                {isOwner ? (
                  <p className="mt-auto pt-1 font-display text-[11px] leading-snug text-perlapp-inkMuted">
                    {isErrorApiProducts ? "Solo gestión del catálogo" : "Productos obtenidos desde API"}
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleAddToCart(p)}
                    className="mt-auto inline-flex items-center justify-center gap-1.5 rounded-lg border border-perlapp-orange/40 bg-perlapp-orange/10 py-2 font-display text-perlapp-label-sm font-semibold text-perlapp-orange transition hover:bg-perlapp-orange/15"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    Añadir al carrito
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {modal ? (
        <div className="fixed inset-0 z-[55] flex items-end justify-center p-4 sm:items-center" role="presentation">
          <button
            type="button"
            className="absolute inset-0 bg-perlapp-ink/50 backdrop-blur-[2px]"
            aria-label="Cerrar"
            onClick={closeModal}
          />
          <div
            className="relative z-10 w-full max-w-md rounded-2xl border border-perlapp-line/50 bg-perlapp-white p-5 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="catalog-form-title"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <h2 id="catalog-form-title" className="font-display text-perlapp-headline-md font-bold text-perlapp-ink">
                {modal.mode === "create" ? "Nuevo producto" : "Editar producto"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full p-2 text-perlapp-inkMuted hover:bg-perlapp-surfaceContainer"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <label className="flex flex-col gap-1">
                <span className="font-display text-perlapp-label-sm font-semibold text-perlapp-inkMuted">Nombre</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="rounded-xl border border-perlapp-line bg-perlapp-white px-3 py-2.5 font-sans text-sm text-perlapp-ink outline-none ring-perlapp-orange focus:ring-2"
                  placeholder="Ej. Café en grano 500 g"
                  maxLength={120}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-display text-perlapp-label-sm font-semibold text-perlapp-inkMuted">
                  Descripción <span className="font-normal text-perlapp-inkMuted/80">(opcional)</span>
                </span>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="min-h-24 rounded-xl border border-perlapp-line bg-perlapp-white px-3 py-2.5 font-sans text-sm text-perlapp-ink outline-none ring-perlapp-orange focus:ring-2"
                  placeholder="Describe el producto"
                  maxLength={600}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-display text-perlapp-label-sm font-semibold text-perlapp-inkMuted">
                  Precio (COP)
                </span>
                <input
                  inputMode="numeric"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  className="rounded-xl border border-perlapp-line bg-perlapp-white px-3 py-2.5 font-sans text-sm text-perlapp-ink outline-none ring-perlapp-orange focus:ring-2"
                  placeholder="25000"
                />
              </label>
              {isOwner && !isErrorApiProducts ? (
                <label className="flex flex-col gap-1">
                  <span className="font-display text-perlapp-label-sm font-semibold text-perlapp-inkMuted">
                    Fotos <span className="font-normal text-perlapp-inkMuted/80">(opcional)</span>
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setForm((f) => ({ ...f, photos: Array.from(e.target.files ?? []) }))}
                    className="block w-full text-sm text-perlapp-inkMuted file:mr-3 file:rounded-md file:border file:border-perlapp-line file:bg-perlapp-surfaceContainer file:px-3 file:py-1.5 file:font-display file:text-xs file:font-semibold file:text-perlapp-ink hover:file:bg-perlapp-surfaceVariant"
                  />
                </label>
              ) : (
                <label className="flex flex-col gap-1">
                  <span className="font-display text-perlapp-label-sm font-semibold text-perlapp-inkMuted">
                    URL de imagen{" "}
                    <span className="font-normal text-perlapp-inkMuted/80">(opcional)</span>
                  </span>
                  <input
                    value={form.imageUrl}
                    onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                    className="rounded-xl border border-perlapp-line bg-perlapp-white px-3 py-2.5 font-sans text-sm text-perlapp-ink outline-none ring-perlapp-orange focus:ring-2"
                    placeholder="https://... o vacío"
                  />
                  <span className="font-sans text-xs text-perlapp-inkMuted">
                    Si la dejas vacía, el producto se muestra con un marcador "Sin foto".
                  </span>
                </label>
              )}
              {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full px-4 py-2 font-display text-perlapp-label-md font-semibold text-perlapp-inkMuted hover:bg-perlapp-surfaceContainer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={isCreatingApiProduct || isUpdatingApiProduct}
                className="rounded-full bg-perlapp-orange px-5 py-2 font-display text-perlapp-label-md font-semibold text-white shadow-sm hover:bg-perlapp-orange/90"
              >
                {isCreatingApiProduct || isUpdatingApiProduct ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Eliminar producto"
        description={
          deleteTarget
            ? `¿Eliminar “${deleteTarget.name}” del catálogo? Esta acción no se puede deshacer.`
            : ""
        }
        cancelLabel="Cancelar"
        confirmLabel="Eliminar"
        variant="danger"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
