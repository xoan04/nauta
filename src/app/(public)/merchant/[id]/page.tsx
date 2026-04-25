import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { MerchantProfileView } from "@/components/merchant/MerchantProfileView";
import { getMerchantProfileById, merchantProfilePath } from "@/lib/merchant-profile.mock";

type PageProps = {
  params: { id: string };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const merchant = getMerchantProfileById(params.id);
  if (!merchant) {
    return { title: "Comercio no encontrado · Perlapp" };
  }
  return {
    title: `${merchant.displayName} · Perlapp`,
    description: merchant.bio.slice(0, 160),
  };
}

export default function MerchantProfilePage({ params }: PageProps) {
  const merchant = getMerchantProfileById(params.id);
  if (!merchant) {
    notFound();
  }
  const canonical = merchantProfilePath(merchant.id);
  if (canonical !== `/merchant/${params.id}`) {
    redirect(canonical);
  }
  return <MerchantProfileView merchant={merchant} />;
}
