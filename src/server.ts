import { fastifyCors } from "@fastify/cors";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import fastify from "fastify";
import {
  ZodTypeProvider,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler
} from "fastify-type-provider-zod";
import { routes } from "./routes.js";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, { origin: "*" });

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Daily Track",
      version: "1.0.0"
    }
  },
  transform: jsonSchemaTransform
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs"
});

app.register(routes);

app.listen({ port: 3333 }).then(() => {
  console.log("HTTP Server running!");
});
