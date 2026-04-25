import type { Metadata } from "next";
import { MarketNotificationsView } from "@/components/notifications/MarketNotificationsView";

export const metadata: Metadata = {
  title: "Notificaciones · Perlapp",
  description: "Solicitudes de conexión entre comercios.",
};

export default function NotificationsPage() {
  return <MarketNotificationsView />;
}

