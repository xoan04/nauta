import { z } from "zod";

export const exampleSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  body: z.string(),
});

export type Example = z.infer<typeof exampleSchema>;

export const examplesListSchema = z.array(exampleSchema);

const createExampleFormSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  body: z.string().min(1, "El contenido es obligatorio"),
});

export const createExampleInputSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  body: z.string().min(1, "El contenido es obligatorio"),
  userId: z.number().int().positive(),
});
export type CreateExampleInput = z.infer<typeof createExampleInputSchema>;
export const createExampleFormFieldSchema = createExampleFormSchema;
export type CreateExampleFormFields = z.infer<typeof createExampleFormFieldSchema>;

export const createdExampleResponseSchema = exampleSchema;
export type CreatedExample = z.infer<typeof createdExampleResponseSchema>;
