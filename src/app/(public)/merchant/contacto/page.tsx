import type { Metadata } from "next";
import { MerchantContactPhoneScreen } from "@/components/merchant/MerchantContactPhoneScreen";

export const metadata: Metadata = {
  title: "Teléfono de tu negocio · Perlapp",
  description: "Añade el contacto de tu negocio para publicar en el catálogo.",
};

export default function MerchantContactPhonePage() {
  return <MerchantContactPhoneScreen />;
}
