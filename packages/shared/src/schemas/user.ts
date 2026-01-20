import { z } from "zod";

export const UserPublicSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.string().datetime()
});

export const createUserInputSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6).max(16)
});

export type UserPublic = z.infer<typeof UserPublicSchema>;
export type CreateUserInput = z.infer<typeof createUserInputSchema>;
