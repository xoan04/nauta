import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  title = "No hay datos",
  description = "Aún no hay ningún resultado para mostrar.",
  className,
}: {
  title?: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2 p-8 text-center text-muted-foreground", className)}>
      <Inbox className="h-10 w-10 opacity-50" />
      <p className="font-medium text-foreground">{title}</p>
      <p className="max-w-sm text-sm">{description}</p>
    </div>
  );
}
