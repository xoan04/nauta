/** Producto listado en el catálogo del perfil comercio (demo). */
export type ProfileCatalogProduct = {
  id: string;
  name: string;
  description?: string;
  price: number;
  /** URL https de la foto, o cadena vacía si no hay imagen. */
  imageUrl: string;
};
