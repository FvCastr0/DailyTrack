import { db } from "@/db/index";
import { users } from "@/db/schemas/user";
import { CreateUserInput } from "@/shared/schemas/user";
import { eq } from "drizzle-orm";

export class UsersRepository {
  async findAll() {
    return db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt
      })
      .from(users);
  }

  async create(data: CreateUserInput) {
    await db.insert(users).values(data);
  }

  async findByEmail(email: string) {
    const result = await db.select().from(users).where(eq(users.email, email));

    return result[0] ?? null;
  }
}
