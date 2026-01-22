import { createUserSchema, userResponseSchema } from "@/db/zod/user";
import { EmailAlreadyUsedError } from "@/errors/EmailAlreadyExistsError";
import { messages } from "@/messages";
import { UsersRepository } from "@/repositories/user-repository";
import { FastifyTypedInstance } from "@/types";
import { CreateUserUseCase } from "@/use-cases/users/CreateUser";
import { z } from "zod";

const usersRepository = new UsersRepository();

export async function userRoutes(app: FastifyTypedInstance) {
  app.get(
    "/users",
    {
      schema: {
        tags: ["users"],
        description: "List users",
        response: {
          200: z.array(userResponseSchema)
        }
      }
    },
    async () => {
      return usersRepository.findAll();
    }
  );

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
}
