import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-4">Ajustes</h1>
      <Card>
        <CardHeader>
          <CardTitle>Configuración</CardTitle>
          <CardDescription>Página reservada para ajustes de la aplicación.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Añade aquí preferencias o integraciones cuando lo necesites.</p>
        </CardContent>
      </Card>
    </div>
  );
}
