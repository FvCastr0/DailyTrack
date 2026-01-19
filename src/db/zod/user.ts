import { users } from "@/db/schemas/user";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const createUserSchema = createInsertSchema(users, {
  name: schema => schema.min(2),
  email: schema => schema.email()
});

export const userResponseSchema = createSelectSchema(users);
