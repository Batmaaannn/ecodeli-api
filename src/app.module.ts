import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./modules/users/users.module";
import { AuthModule } from "./modules/auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { postgresDataSourceConfig } from "./config/postgres.database.config";
import config from "./config";
import { RegistrationRequestsModule } from "./modules/registration-requests/registration-requests.module";
import { CustomersModule } from "./modules/customers/customers.module";
import { DeliveryAgentsModule } from "./modules/delivery-agents/delivery-agents.module";
import { ServiceAgentsModule } from "./modules/service-agents/service-agents.module";
import { MerchantsModule } from "./modules/merchants/merchants.module";

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
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    RegistrationRequestsModule,
    CustomersModule,
    DeliveryAgentsModule,
    ServiceAgentsModule,
    MerchantsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
