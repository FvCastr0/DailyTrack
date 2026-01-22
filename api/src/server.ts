import { fastifyCors } from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import jwt from "@fastify/jwt";
import fastifyRateLimit from "@fastify/rate-limit";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import "dotenv/config";
import fastify, { FastifyError } from "fastify";
import {
  ZodTypeProvider,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler
} from "fastify-type-provider-zod";
import { ZodError } from "zod";
import { userRoutes } from "./routes/user";

const app = fastify({
  bodyLimit: 1_000_000
}).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Daily Track",
      version: "1.0.0"
    }
  },
  transform: jsonSchemaTransform
});

app.setErrorHandler((error: FastifyError, request, reply) => {
  if (error.validation) {
    return reply.status(400).send({
      message: error.validation[0]?.message
    });
  }

  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Erro de validação",
      issues: error.flatten().fieldErrors
    });
  }
  console.error(error);
  return reply.status(500).send({ message: "Internal Server Error" });
});

app.register(fastifyHelmet, {
  contentSecurityPolicy: false
});

app.register(fastifyRateLimit, {
  max: 100,
  timeWindow: "1 minute"
});

app.register(jwt, {
  secret: process.env.JWT_SECRET!
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs"
});

app.register(fastifyCors, {
  origin: ["http://localhost:3000"],
  credentials: true
});

app.register(userRoutes);

app.listen({ port: 3333 }).then(() => {
  console.log("HTTP Server running on http://localhost:3333");
});
