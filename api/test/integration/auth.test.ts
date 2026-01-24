import { buildApp } from "@/app";
import { db } from "@/db";
import { sql } from "drizzle-orm";

describe("POST /auth/login", () => {
  const app = buildApp();

  const validUser = {
    name: "Fernando",
    email: "test@email.com",
    password: "123456"
  };

  beforeAll(async () => {
    await app.ready();
    await db.execute(sql`DELETE FROM users`);

    await app.inject({
      method: "POST",
      url: "/user/new",
      payload: validUser
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it("should return 200 if user is valid", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: {
        email: validUser.email,
        password: validUser.password
      }
    });

    expect(res.statusCode).toBe(200);
  });

  it("should return 401 if email or pass is invalid", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: {
        email: "invalid@email.com",
        password: "wrong-pass"
      }
    });

    expect(res.statusCode).toBe(401);
  });
});
