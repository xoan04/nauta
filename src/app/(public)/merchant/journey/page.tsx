import type { Metadata } from "next";
import { GamificationJourney } from "@/components/merchant/gamification/GamificationJourney";

export const metadata: Metadata = {
  title: "Tu camino al éxito · Perlapp",
};

export default function MerchantJourneyPage() {
  return <GamificationJourney />;
}
