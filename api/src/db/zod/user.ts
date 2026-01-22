import { users } from "@/db/schemas/user";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const createUserSchema = createInsertSchema(users, {
  name: schema => schema.min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: schema => schema.email("O formato do e-mail é inválido"),
  password: schema =>
    schema
      .min(6, { message: "A senha deve ter no mínimo 6 caracteres" })
      .max(16, { message: "A senha deve ter no máximo 16 caracteres" })
});

export const userResponseSchema = createSelectSchema(users).omit({
  password: true
});
