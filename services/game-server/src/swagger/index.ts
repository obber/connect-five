import type { INestApplication } from "@nestjs/common";
import type {
  SwaggerDocumentOptions} from "@nestjs/swagger";
import {
  DocumentBuilder,
  SwaggerModule,
} from "@nestjs/swagger";

export function createSwaggerDocument(app: INestApplication) {
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const config = new DocumentBuilder()
    .setTitle("Title")
    .setDescription("description")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  return SwaggerModule.createDocument(app, config, options);
}
