"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getExamplesUseCase } from "@/core/use-cases/example/get-examples.use-case";
import { createExampleUseCase } from "@/core/use-cases/example/create-example.use-case";
import { useAuthStore } from "@/store/auth.store";
import type { CreateExampleFormFields } from "@/core/models/example.model";

const EXAMPLES_KEY = ["examples"] as const;

export function useExampleList() {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: [...EXAMPLES_KEY, token],
    queryFn: () => getExamplesUseCase({ token: token ?? undefined }),
  });
}

export function useCreateExample() {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);

  return useMutation({
    mutationFn: (input: CreateExampleFormFields) =>
      createExampleUseCase({ title: input.title, body: input.body, userId: 1 }, { token: token ?? undefined }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: EXAMPLES_KEY });
    },
  });
}
