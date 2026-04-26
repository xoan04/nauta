import type { Metadata } from "next";
import { ExplorarPageClient } from "@/components/explorar/ExplorarPageClient";

export const metadata: Metadata = {
  title: "Explorar · Perlapp",
  description: "Descubre comercios locales y explora tu región en el mapa.",
};

export default function ExplorarPage() {
  return <ExplorarPageClient />;
}
