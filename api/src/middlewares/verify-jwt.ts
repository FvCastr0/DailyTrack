import { FastifyReply, FastifyRequest } from "fastify";

export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify<{ sub: string; name: string }>();
  } catch {
    return reply.status(401).send({ message: "Token inválido" });
  }
}
