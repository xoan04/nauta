"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createExampleFormFieldSchema, type CreateExampleFormFields } from "@/core/models/example.model";
import { useCreateExample, useExampleList } from "@/hooks/useExample";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

const formSchema = createExampleFormFieldSchema;

export function ExampleList() {
  const { data, isPending, isError, error, refetch } = useExampleList();
  const createMutation = useCreateExample();

  const form = useForm<CreateExampleFormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", body: "" },
  });

  const onSubmit = form.handleSubmit((values) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        form.reset({ title: "", body: "" });
      },
    });
  });

  if (isPending) {
    return <LoadingSpinner label="Cargando publicaciones…" />;
  }

  if (isError) {
    return (
      <div className="space-y-3">
        <ErrorMessage error={error} title="No se pudo cargar el listado" />
        <Button type="button" variant="secondary" onClick={() => void refetch()}>
          Reintentar
        </Button>
      </div>
    );
  }

  const list = (data ?? []).slice(0, 10);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nueva publicación (mock API)</CardTitle>
          <CardDescription>Se envía a la API pública vía `http` + use case. userId fijo 1 (JSONPlaceholder).</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-3 max-w-lg">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input id="title" {...form.register("title")} />
              {form.formState.errors.title && (
                <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">Contenido</Label>
              <Textarea id="body" rows={3} {...form.register("body")} />
              {form.formState.errors.body && (
                <p className="text-sm text-destructive">{form.formState.errors.body.message}</p>
              )}
            </div>
            {createMutation.isError && <ErrorMessage error={createMutation.error} title="Error al crear" />}
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Enviando…" : "Crear"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-semibold mb-3">Últimas publicaciones</h2>
        {list.length === 0 ? (
          <EmptyState title="Sin publicaciones" description="No se recibió ningún ítem de la API." />
        ) : (
          <ul className="space-y-2">
            {list.map((ex) => (
              <li key={ex.id} className="rounded-md border border-border p-3">
                <p className="text-xs text-muted-foreground">#{ex.id} · user {ex.userId}</p>
                <p className="font-medium">{ex.title}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{ex.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
