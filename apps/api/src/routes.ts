import { UsersRepository } from "@/repositories/user-repository";
import { z } from "zod";
import { createUserSchema, userResponseSchema } from "./db/zod/user";
import { FasityTypedInstance } from "./types";

const usersRepository = new UsersRepository();

export async function routes(app: FasityTypedInstance) {
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
          201: z.null().describe("User created")
        }
      }
    },
    async (request, reply) => {
      const { name, email, password } = request.body;

      await usersRepository.create({ name, email, password });

      return reply.status(201).send(null);
    }
  );
}
