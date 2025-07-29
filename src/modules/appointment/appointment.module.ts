import { forwardRef, Module } from "@nestjs/common";
import { AppointmentService } from "./appointment.service";
import { AppointmentController } from "./appointment.controller";
import { Appointment } from "./entities/appointment.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment]),
    forwardRef(() => UsersModule),
  ],
  providers: [AppointmentService],
  controllers: [AppointmentController],
})
export class AppointmentModule {}
