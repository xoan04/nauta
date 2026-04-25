import type { Metadata } from "next";
import { PerlappHome } from "@/components/home/PerlappHome";

export const metadata: Metadata = {
  title: "Perlapp — Inicio",
  description: "Descubre comercios, novedades y publicaciones cerca de ti.",
};

export default function HomePage() {
  return <PerlappHome />;
}
