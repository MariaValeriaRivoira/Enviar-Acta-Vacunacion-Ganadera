import { z } from "zod";

export const submitDocumentSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  telefono: z.string().min(1, "El teléfono es requerido"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
});

export type SubmitDocumentData = z.infer<typeof submitDocumentSchema>;
