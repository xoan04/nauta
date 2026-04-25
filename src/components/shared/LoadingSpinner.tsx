import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export function LoadingSpinner({ className, label = "Cargando…" }: { className?: string; label?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2 p-6 text-muted-foreground", className)} role="status" aria-label={label}>
      <Loader2 className="h-8 w-8 animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
