import { buildApp } from "@/app";
import { db } from "@/db";
import { messages } from "@/messages";
import { sql } from "drizzle-orm";

const validUser = {
  name: "Fernando",
  email: "test@email.com",
  password: "123456"
};

describe("POST /user/new", () => {
  const app = buildApp();
  beforeAll(async () => {
    await app.ready();
    await db.execute(sql`DELETE FROM users`);
  });

  afterAll(async () => {
    await app.close();
  });

  it("should return 201 if data is correct", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/user/new",
      payload: validUser
    });

    expect(res.statusCode).toBe(201);

    const body = res.json();
    expect(body).toEqual({
      message: messages.user.functions.create[201]
    });
  });

  it("should return 400 if data hasn't requirements", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/user/new",
      payload: {
        name: "F",
        email: "test@email.com",
        password: "12345"
      }
    });

    expect(res.statusCode).toBe(400);

    const body = res.json();
    expect(body).toBeDefined();
  });

  it("should return 401 if email is already used", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/user/new",
      payload: validUser
    });

    expect(res.statusCode).toBe(401);

    const body = res.json();
    expect(body).toEqual({
      message: messages.user.functions.create[401]
    });
  });
});

describe("DELETE /user/delete", () => {
  const app = buildApp();

  let token: string;

  beforeAll(async () => {
    await app.ready();
    await db.execute(sql`DELETE FROM users`);

    await app.inject({
      method: "POST",
      url: "/user/new",
      payload: validUser
    });

    const login = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: {
        email: validUser.email,
        password: validUser.password
      }
    });
    token = login.json().token;
  });

  afterAll(async () => {
    await app.close();
  });

  it("should return 200 if user was deleted", async () => {
    const res = await app.inject({
      method: "DELETE",
      url: "/user/delete",
      headers: {
        authorization: `Bearer ${token}`
      }
    });

    expect(res.statusCode).toBe(200);
  });

  it("should return 401 if token is invalid", async () => {
    const res = await app.inject({
      method: "DELETE",
      url: "/user/delete",
      headers: {
        authorization: `Bearer invalid-token`
      }
    });

    expect(res.statusCode).toBe(401);
  });
});
