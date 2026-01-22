import { users } from "@/db/schemas/user";
import { messages } from "@/messages";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const createUserSchema = createInsertSchema(users, {
  name: schema => schema.min(2, messages.user.text.NAME_MIN_CARACTERES),
  email: schema => schema.email(messages.user.text.INVALID_EMAIL),
  password: schema =>
    schema
      .min(6, messages.user.text.PASSWORD_MIN_CARACTERES)
      .max(16, messages.user.text.PASSWORD_MAX_CARACTERES)
});

export const userResponseSchema = createSelectSchema(users).omit({
  password: true
});
