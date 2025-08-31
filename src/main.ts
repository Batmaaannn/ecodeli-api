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

  const whitelist = ["https://ecodeli.grados.fr", "http://localhost:5173"];

  app.enableCors({
    origin: (origin, cb) => {
      if (!origin || whitelist.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
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


  app.use(cookieParser());

  app.use(RouteLoggerMiddleware);

  if (config.environment === Environments.DEV) {
    const config = new DocumentBuilder()
      .setTitle("Ecodeli")
      .setDescription("Ecodeli description")
      .setVersion("1.0")
      .addTag("ecodeli")
      .addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT" })
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, documentFactory);
  }

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
