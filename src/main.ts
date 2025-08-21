import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import config from "src/config";
import { Environments } from "./types/environments";
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import { RouteLoggerMiddleware } from "./libs/middlewares/route-logger";
import passport from "passport";
import * as session from "express-session";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "http://localhost:5173", // ton front
    credentials: true,
  });

  app.use(
    session({
      secret: process.env.JWT_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000,
      },
    })
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        console.error("Validation errors:", errors);
        return new BadRequestException(errors);
      },
    })
  );

  // app.use(passport.initialize());

  // app.use(passport.session());

  app.use(cookieParser());

  app.use(RouteLoggerMiddleware);

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
