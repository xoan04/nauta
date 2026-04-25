import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-4">Perfil</h1>
      <Card>
        <CardHeader>
          <CardTitle>Perfil de usuario</CardTitle>
          <CardDescription>Vista de demostración protegida por middleware.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Puedes enlazar el perfil a datos reales y formularios aquí.</p>
        </CardContent>
      </Card>
    </div>
  );
}
