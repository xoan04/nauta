"use client";

import { type ReactNode } from "react";
import { AuthPerlappRoleSync } from "@/components/auth/AuthPerlappRoleSync";
import { QueryProvider } from "./QueryProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <AuthPerlappRoleSync />
      {children}
    </QueryProvider>
  );
}
