import type { Metadata } from "next";
import { MerchantProfilePageClient } from "@/components/merchant/MerchantProfilePageClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  params: { id: string };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: "Perfil de comercio · Perlapp",
    description: `Perfil del comercio ${params.id}.`,
  };
}

export default function MerchantProfilePage({ params }: PageProps) {
  return <MerchantProfilePageClient userId={params.id} />;
}
