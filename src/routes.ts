import { UsersRepository } from "@/repositories/user-repository";
import { z } from "zod";
import { FasityTypedInstance } from "./types.js";

const usersRepository = new UsersRepository();

export async function routes(app: FasityTypedInstance) {
  app.get(
    "/users",
    {
      schema: {
        tags: ["users"],
        description: "List users",
        response: {
          200: z.array(
            z.object({
              id: z.string().uuid(),
              name: z.string(),
              email: z.string().email()
            })
          )
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
        body: z.object({
          name: z.string(),
          email: z.string().email()
        }),
        response: {
          201: z.null().describe("User created")
        }
      }
    },
    async (request, reply) => {
      const { name, email } = request.body;

      await usersRepository.create({ name, email });

      return reply.status(201).send(null);
    }
  );
}
