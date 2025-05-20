import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./modules/users/users.module";
import { AuthModule } from "./modules/auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { postgresDataSourceConfig } from "./config/postgres.database.config";
import { User } from "./modules/users/entities/user.entity";
import config from "./config";

@Module({
  imports: [
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) =>
    //     postgresDataSourceConfig(configService),
    //   inject: [ConfigService],
    // }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: config.postgres_database.host,
      port: config.postgres_database.port,
      username: config.postgres_database.username,
      password: config.postgres_database.password,
      database: config.postgres_database.name,
      entities: [User],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
