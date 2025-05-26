import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import config from "src/config";
import { Environments } from "./types/environments";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());

  app.use(cookieParser());

  if (config.environment === Environments.DEV) {
    const config = new DocumentBuilder()
      .setTitle("Ecodeli")
      .setDescription("Ecodeli description")
      .setVersion("1.0")
      .addTag("ecodeli")
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, documentFactory);
  }

  await app.listen(3000);
}
bootstrap();
