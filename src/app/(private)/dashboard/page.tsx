import { ExampleList } from "@/components/features/example/ExampleList";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-1">Panel</h1>
      <p className="text-sm text-muted-foreground mb-6">Datos remotos: JSONPlaceholder. Flujo: Hook → use case → service → http.</p>
      <ExampleList />
    </div>
  );
}
