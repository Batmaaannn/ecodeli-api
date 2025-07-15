import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./modules/users/users.module";
import { AuthModule } from "./modules/auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import config from "./config";
import { RegistrationRequestsModule } from "./modules/registration-requests/registration-requests.module";
import { CustomersModule } from "./modules/customers/customers.module";
import { DeliveryAgentsModule } from "./modules/delivery-agents/delivery-agents.module";
import { ServiceAgentsModule } from "./modules/service-agents/service-agents.module";
import { MerchantsModule } from "./modules/merchants/merchants.module";
import { PrestationsModule } from "./modules/prestations/prestations.module";
import { ReviewsModule } from "./modules/reviews/reviews.module";
import { AppointmentModule } from "./modules/appointment/appointment.module";
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "./modules/auth/guards/roles.guard";
import { JwtAuthGuard } from "./modules/auth/guards/jwt-auth.guard";
import {DeliveryRequestsModule} from "./modules/deliveries/delivery-requests.module";
import {TripModule} from "./modules/trip/trip.modules";

@Module({
  imports: [
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
    ReviewsModule,
    PrestationsModule,
    AppointmentModule,
    DeliveryRequestsModule,
    TripModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
