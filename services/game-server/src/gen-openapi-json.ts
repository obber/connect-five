import fs from "node:fs";
import path from "node:path";
import { NestFactory } from "@nestjs/core";
import { Logger } from "@nestjs/common";
import { AppModule } from "./app.module";
import { createSwaggerDocument } from "./swagger";

const logger = new Logger("gen-openapi-json");

(async () => {
  const app = await NestFactory.create(AppModule);
  const document = createSwaggerDocument(app);

  fs.writeFileSync(
    path.resolve(__dirname, "./swagger-spec.json"),
    JSON.stringify(document)
  );
})().catch((err) => {
  logger.error("Failed to write OpenAPI JSON. err = ", err);
});
