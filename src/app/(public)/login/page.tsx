"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { HttpError } from "@/core/http";
import { loginUseCase } from "@/core/use-cases/auth/login.use-case";
import { useAuthStore } from "@/store/auth.store";
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
  const loginFromApi = useAuthStore((s) => s.loginFromApi);
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setAuthError("");
    try {
      const data = await loginUseCase({ email: values.email.trim(), password: values.password });
      loginFromApi(data);
      const redirect = searchParams.get("redirect") ?? "/";
      router.push(redirect);
    } catch (e) {
      if (e instanceof HttpError) {
        setAuthError(e.message);
      } else if (e instanceof Error && e.message) {
        setAuthError(e.message);
      } else {
        setAuthError("No se pudo iniciar sesión. Revisa tu conexión e inténtalo de nuevo.");
      }
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-2 shadow-lg overflow-hidden bg-white">
            <Image src="/logo.png" alt="Perlapp logo" width={64} height={64} priority />
          </div>
          <CardTitle>Iniciar sesión</CardTitle>
          <CardDescription>Entra con tu correo y contraseña de Perlapp.</CardDescription>
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
              {form.formState.isSubmitting ? "Entrando…" : "Entrar"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <div className="flex w-full items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">o</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/registro">Soy nuevo — Crear cuenta</Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full text-muted-foreground"
            onClick={() => {
              sessionStorage.setItem("perlapp-guest", "1");
              router.push("/");
            }}
          >
            Entrar como invitado
          </Button>
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
