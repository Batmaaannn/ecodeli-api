import { Controller, Request, Body, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserType } from "src/types/user";
import { Roles } from "../auth/decorator/roles.decorator";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { UsersService } from "../users/users.service";

@ApiBearerAuth()
@ApiTags("appointments")
@Controller("appointment")
export class AppointmentController {
  constructor(private readonly usersService: UsersService) {} // private readonly patientsService: PatientsService, // private readonly appointmentsService: AppointmentsService,

  @Roles(UserType.CUSTOMER)
  @Post()
  async createAppointment(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @Request() req
  ) {
    const { userId } = req.user;
    // const { puiId, prescriptionId, patientId, date, startSlot, endSlot } =
    //   createAppointmentDto;
    // if (!startSlot.match(slotLimitRegex) || !endSlot.match(slotLimitRegex))
    //   throw new HttpException(
    //     "Slot limits doesn't not match correct pattern HH:mm",
    //     HttpStatus.BAD_REQUEST
    //   );
    const user = await this.usersService.getUser(userId);

    // const patient = await this.patientsService.findOneById(patientId);
    // if (!patient)
    //   throw new HttpException("Patient not found", HttpStatus.BAD_REQUEST);
    // const prescriptionExists = await this.prescriptionService.getPrescription(
    //   prescriptionId,
    //   { isPatient: true, patientId: patientId }
    // );
    // if (!prescriptionExists)
    //   throw new HttpException("Prescription not found", HttpStatus.BAD_REQUEST);
    // const lastAppointment =
    //   await this.appointmentsService.findLastPrescriptionAppointmentNotDeletedByPatientId(
    //     patientId
    //   );
    // if (lastAppointment) {
    //   const puiSchedule =
    //     await this.puisScheduleService.getScheduleByPuiId(puiId);
    //   const firstPossibleDate = getFirstDateForLegalDaysBetweenAppointments({
    //     lastAppointmentNotDeleted: lastAppointment,
    //     schedule: puiSchedule,
    //     processingTime: pui.processing_time,
    //   });
    //   const firstPossibleDateWithoutTime =
    //     getNewDateWithoutTime(firstPossibleDate);
    //   if (isBefore(new Date(date), firstPossibleDateWithoutTime)) {
    //     throw new HttpException(
    //       "The 21 days are not respected",
    //       HttpStatus.CONFLICT
    //     );
    //   }
    // }
    // return this.appointmentsService.createAppointment(createAppointmentDto);
  }
}
