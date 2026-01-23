import { db } from "@/db/index";
import { users } from "@/db/schemas/user";
import { CreateUserInput } from "@/types";

import { eq } from "drizzle-orm";

export class UsersRepository {
  async create(data: CreateUserInput) {
    await db.insert(users).values(data);
  }

  async findByEmail(email: string) {
    const result = await db.select().from(users).where(eq(users.email, email));

    return result[0] ?? null;
  }

  async findById(id: string) {
    const result = await db.select().from(users).where(eq(users.id, id));

    return result[0] ?? null;
  }

  async deleteUserById(id: string) {
    const deletedUser = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning();

    return deletedUser.length === 0 ? false : true;
  }
}
