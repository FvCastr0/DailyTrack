import "@fastify/jwt";

declare module "@fastify/jwt" {
  export interface FastifyJWT {
    payload: { id: string };
    user: {
      id: string;
      name: string;
      email: string;
    };
  }
}
