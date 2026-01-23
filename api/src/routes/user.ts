import { createUserSchema } from "@/db/zod/user";
import { EmailAlreadyUsedError } from "@/errors/user/EmailAlreadyExistsError";
import { HasToBeSameAccount } from "@/errors/user/HasToBeSameAccount";
import { NonExistentUser } from "@/errors/user/NonExistentUser";
import { messages } from "@/messages";
import { verifyJwt } from "@/middlewares/verify-jwt";
import { UsersRepository } from "@/repositories/user-repository";
import { FastifyTypedInstance } from "@/types";
import { CreateUserUseCase } from "@/use-cases/users/CreateUser";
import { DeleteUserUseCase } from "@/use-cases/users/DeleteUser";
import { z } from "zod";

export async function userRoutes(app: FastifyTypedInstance) {
  app.post(
    "/users",
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
    "/users/:id",
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ["users"],
        description: "Delete user",
        params: z.object({
          id: z.string().uuid()
        }),
        response: {
          200: z
            .object({
              message: z.string()
            })
            .describe(messages.user.functions.delete[200]),
          400: z
            .object({
              message: z.string()
            })
            .describe(messages.user.functions.delete[400]),
          500: z
            .object({
              message: z.string()
            })
            .describe("Internal Server Error")
        }
      }
    },
    async (request, reply) => {
      const { id } = request.params;
      const { sub } = request.user;

      try {
        await new DeleteUserUseCase(new UsersRepository()).execute(id, sub);
        return reply
          .status(200)
          .send({ message: messages.user.functions.delete[200] });
      } catch (err) {
        if (err instanceof HasToBeSameAccount) {
          return reply.status(400).send({ message: String(err.message) });
        }

        if (err instanceof NonExistentUser) {
          return reply.status(400).send({ message: String(err.message) });
        }

        return reply.status(500).send({ message: "Internal Server Error" });
      }
    }
  );
}
