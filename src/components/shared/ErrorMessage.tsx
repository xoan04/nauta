import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ApiError } from "@/types/http.types";

function isApiError(e: unknown): e is ApiError {
  return typeof e === "object" && e !== null && "message" in e && "status" in e;
}

export function ErrorMessage({
  error,
  className,
  title = "Error",
}: {
  error: unknown;
  className?: string;
  title?: string;
}) {
  const message = isApiError(error) ? error.message : "Ha ocurrido un error inesperado";

  return (
    <div
      className={cn("flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-4 text-destructive", className)}
      role="alert"
    >
      <AlertCircle className="h-5 w-5 shrink-0" />
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-destructive/90">{message}</p>
      </div>
    </div>
  );
}
