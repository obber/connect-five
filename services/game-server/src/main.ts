import { LogLevel, Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { createSwaggerDocument } from "./swagger";
import { CLIENT_ORIGIN, LOCAL_CLIENT_ORIGIN } from "./constants";
import { args } from "./common/args";

const logger = new Logger("bootstrap");

async function bootstrap() {
  const origin = args.local ? LOCAL_CLIENT_ORIGIN : CLIENT_ORIGIN;
  const logLevels = (process.env.LOG_LEVELS ?? "").split(",") as LogLevel[];
  logger.log(`log levels: [${logLevels.join(" ")}]`);
  logger.log(`args: ${JSON.stringify(args)}`);
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin,
    },
    logger: logLevels,
  });
  app.useGlobalPipes(new ValidationPipe());

  const document = createSwaggerDocument(app);
  SwaggerModule.setup("api", app, document);

  const port = process.env.PORT || 4000;
  logger.log(`listening on port: ${port}`);
  await app.listen(port);
}
bootstrap().catch((err) => {
  console.error("Failed to bootstrap server. err = ", err);
});
