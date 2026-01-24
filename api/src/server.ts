import "dotenv/config";
import { buildApp } from "./app";

buildApp()
  .listen({ port: 3333 })
  .then(() => {
    console.log("HTTP Server runing on http://localhost:3333");
  });
