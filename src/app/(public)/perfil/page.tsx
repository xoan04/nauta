import type { Metadata } from "next";
import { BuyerProfileView } from "@/components/buyer/BuyerProfileView";

export const metadata: Metadata = {
  title: "Tu perfil · Perlapp",
  description: "Actividad, comercios favoritos y conexiones.",
};

export default function PerfilPage() {
  return <BuyerProfileView />;
}
