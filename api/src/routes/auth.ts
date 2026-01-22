import { LoginError } from "@/errors/LoginError";
import { messages } from "@/messages";
import { UsersRepository } from "@/repositories/user-repository";
import { FastifyTypedInstance } from "@/types";
import { AuthUserUseCase } from "@/use-cases/users/Auth";
import z from "zod";

export async function authRoutes(app: FastifyTypedInstance) {
  app.post(
    "/auth/login",
    {
      schema: {
        tags: ["auth"],
        description: "Auth user",
        body: z.object({
          email: z
            .string(messages.user.text.INVALID_EMAIL)
            .email(messages.user.text.INVALID_EMAIL),
          password: z
            .string()
            .min(6, messages.user.text.PASSWORD_MIN_CARACTERES)
            .max(16, messages.user.text.PASSWORD_MAX_CARACTERES)
        }),
        response: {
          200: z
            .object({
              message: z.string(),
              token: z.string(),
              name: z.string().optional()
            })
            .describe(messages.user.functions.auth[200]),
          401: z
            .object({
              message: z.string()
            })
            .describe(messages.user.functions.auth[401]),
          500: z
            .object({
              message: z.string()
            })
            .describe("Internal server error")
        }
      }
    },
    async (request, reply) => {
      try {
        const { email, password } = request.body;

        const { user } = await new AuthUserUseCase(
          new UsersRepository()
        ).execute({ email, password });

        const token = await reply.jwtSign(
          {
            sub: user.id,
            name: user.name
          },
          {
            sign: {
              expiresIn: "7d"
            }
          }
        );

        return reply.status(200).send({
          name: user.name,
          message: messages.user.functions.auth[200],
          token
        });
      } catch (err) {
        if (err instanceof LoginError) {
          return reply.status(401).send({ message: String(err.message) });
        }

        return reply.status(500).send({ message: "Internal Server Error" });
      }
    }
  );
}
