"use client";

import { useEffect, useState } from "react";
import { PerlappHome } from "@/components/home/PerlappHome";
import { WelcomeScreen } from "@/components/home/WelcomeScreen";
import { useAuthStore } from "@/store/auth.store";

type Gate = "loading" | "home" | "welcome";

export default function HomePage() {
  const [gate, setGate] = useState<Gate>("loading");

  useEffect(() => {
    const resolve = () => {
      const { isAuthenticated } = useAuthStore.getState();
      if (isAuthenticated) {
        setGate("home");
        return;
      }
      const isGuest = sessionStorage.getItem("perlapp-guest") === "1";
      setGate(isGuest ? "home" : "welcome");
    };

    if (useAuthStore.persist.hasHydrated()) {
      resolve();
    } else {
      return useAuthStore.persist.onFinishHydration(resolve);
    }
  }, []);

  // Listen to auth changes (e.g. after login inside WelcomeScreen)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  useEffect(() => {
    if (isAuthenticated && gate !== "home") {
      setGate("home");
    }
  }, [isAuthenticated, gate]);

  if (gate === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-brand-teal border-t-transparent" />
      </div>
    );
  }

  if (gate === "home") {
    return <PerlappHome />;
  }

  return (
    <WelcomeScreen
      onGuest={() => {
        sessionStorage.setItem("perlapp-guest", "1");
        setGate("home");
      }}
    />
  );
}
