import { users } from "@/db/schemas/user";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const createUserSchema = createInsertSchema(users, {
  name: schema => schema.min(2),
  email: schema => schema.email(),
  password: schema => schema.min(6).max(16)
});

export const userResponseSchema = createSelectSchema(users).omit({
  password: true
});
