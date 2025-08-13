import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./modules/users/users.module";
import { AuthModule } from "./modules/auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import config from "./config";
import { CustomersModule } from "./modules/customers/customers.module";
import { DeliveryAgentsModule } from "./modules/delivery-agents/delivery-agents.module";
import { ServiceAgentsModule } from "./modules/service-agents/service-agents.module";
import { MerchantsModule } from "./modules/merchants/merchants.module";
import { PrestationsModule } from "./modules/prestations/prestations.module";
import { RatingsModule } from "./modules/ratings/ratings.module";
import { AppointmentModule } from "./modules/appointment/appointment.module";
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "./modules/auth/guards/roles.guard";
import { JwtAuthGuard } from "./modules/auth/guards/jwt-auth.guard";
import { DeliveriesModule } from "./modules/deliveries/deliveries.module";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { ScheduleModule } from "@nestjs/schedule";
import { StoragesModule } from "./modules/storages/storages.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { AnnouncementsModule } from "./modules/announcements/announcements.module";
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
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: 587,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PWD,
        },
      },
      defaults: {
        from: '"App" <stainvy@gmail.com>',
      },
      template: {
        dir: process.cwd() + "/src/utils/emails/templates/",
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    CustomersModule,
    DeliveryAgentsModule,
    ServiceAgentsModule,
    MerchantsModule,
    PrestationsModule,
    AppointmentModule,
    DeliveriesModule,
    StoragesModule,
    RatingsModule,
    NotificationsModule,
    PaymentsModule,
    AnnouncementsModule,
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
