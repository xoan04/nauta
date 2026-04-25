"use client";

import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { MOCK_CREDENTIALS, MOCK_USER, MOCK_TOKEN } from "@/lib/mock-user";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const loginSchema = z.object({
  email: z.string().email("Email no válido"),
  password: z.string().min(1, "Introduce la contraseña"),
});

type LoginForm = z.infer<typeof loginSchema>;

function LoginForm() {
  const [authError, setAuthError] = useState("");
  const { login } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: MOCK_CREDENTIALS.email,
      password: MOCK_CREDENTIALS.password,
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    if (values.email === MOCK_CREDENTIALS.email && values.password === MOCK_CREDENTIALS.password) {
      setAuthError("");
      login(MOCK_USER, MOCK_TOKEN);
      const redirect = searchParams.get("redirect") ?? "/dashboard";
      router.push(redirect);
    } else {
      setAuthError("Credenciales incorrectas");
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-secondary/20">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Iniciar sesión</CardTitle>
          <CardDescription>Usa las credenciales de prueba o las que ves abajo.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {authError && (
              <p className="text-sm text-destructive rounded-md border border-destructive/50 bg-destructive/10 p-2">
                {authError}
              </p>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" placeholder="Email" {...form.register("email")} />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Contraseña"
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              Entrar
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 text-sm text-muted-foreground text-center sm:text-left">
          <p>
            Usuario de prueba: <span className="text-foreground">{MOCK_CREDENTIALS.email}</span> /{" "}
            <span className="text-foreground">{MOCK_CREDENTIALS.password}</span>
          </p>
          <p>
            <Button variant="link" className="h-auto p-0" asChild>
              <Link href="/">Volver al inicio</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-4 text-muted-foreground">Cargando…</div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
