import { createUserSchema } from "@/db/zod/user";
import { EmailAlreadyUsedError } from "@/errors/user/EmailAlreadyExistsError";
import { messages } from "@/messages";
import { verifyJwt } from "@/middlewares/verify-jwt";
import { UsersRepository } from "@/repositories/user-repository";
import { FastifyTypedInstance } from "@/types";
import { CreateUserUseCase } from "@/use-cases/users/CreateUser";
import { DeleteUserUseCase } from "@/use-cases/users/DeleteUser";
import { z } from "zod";

export async function userRoutes(app: FastifyTypedInstance) {
  app.post(
    "/user/new",
    {
      schema: {
        tags: ["users"],
        description: "Create a new user",
        body: createUserSchema,
        response: {
          201: z
            .object({
              message: z.string()
            })
            .describe(messages.user.functions.create[201]),
          401: z
            .object({
              message: z.string()
            })
            .describe(messages.user.functions.create[401]),
          400: z
            .object({
              message: z.string()
            })
            .describe("Validation data error"),
          500: z
            .object({
              message: z.string()
            })
            .describe("Internal Server Error")
        }
      }
    },
    async (request, reply) => {
      try {
        const { name, email, password } = request.body;

        await new CreateUserUseCase(new UsersRepository()).execute({
          name,
          password,
          email
        });

        return reply
          .status(201)
          .send({ message: messages.user.functions.create[201] });
      } catch (err) {
        if (err instanceof EmailAlreadyUsedError) {
          return reply.status(401).send({ message: String(err.message) });
        }

        return reply.status(500).send({ message: "Internal Server Error" });
      }
    }
  );

  app.delete(
    "/user/delete",
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ["users"],
        description: "Delete user",
        response: {
          200: z
            .object({
              message: z.string()
            })
            .describe(messages.user.functions.delete[200]),
          500: z
            .object({
              message: z.string()
            })
            .describe("Internal Server Error")
        }
      }
    },
    async (request, reply) => {
      const { sub } = request.user;

      try {
        await new DeleteUserUseCase(new UsersRepository()).execute(sub);
        return reply
          .status(200)
          .send({ message: messages.user.functions.delete[200] });
      } catch (err) {
        return reply.status(500).send({ message: "Internal Server Error" });
      }
    }
  );
}
