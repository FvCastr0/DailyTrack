import { users } from "@/db/schemas/user";
import { messages } from "@/messages";
import { createInsertSchema } from "drizzle-zod";

export const createUserSchema = createInsertSchema(users, {
  name: schema => schema.min(2, messages.user.text.NAME_MIN_CHARACTERS),
  email: schema => schema.email(messages.user.text.INVALID_EMAIL),
  password: schema =>
    schema
      .min(6, messages.user.text.PASSWORD_MIN_CHARACTERS)
      .max(16, messages.user.text.PASSWORD_MAX_CHARACTERS)
});
