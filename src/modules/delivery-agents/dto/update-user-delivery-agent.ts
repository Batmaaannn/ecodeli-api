import { IsNotEmpty, IsEmail } from "class-validator";
import { VehiculeType } from "src/types/vehicule";
import { ApiProperty } from "@nestjs/swagger";
import { IsObject, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class SchedulePeriod {
  @ApiProperty()
  @IsNotEmpty()
  isActive: boolean;

  @ApiProperty()
  start: string;

  @ApiProperty()
  end: string;
}

class DaySchedule {
  @ApiProperty()
  @IsNotEmpty()
  isWorking: boolean;

  @ApiProperty({ type: SchedulePeriod })
  @ValidateNested()
  @Type(() => SchedulePeriod)
  morning: SchedulePeriod;

  @ApiProperty({ type: SchedulePeriod })
  @ValidateNested()
  @Type(() => SchedulePeriod)
  afternoon: SchedulePeriod;
}

class Schedule {
  @ApiProperty({ type: DaySchedule })
  @ValidateNested()
  @Type(() => DaySchedule)
  monday: DaySchedule;

  @ApiProperty({ type: DaySchedule })
  @ValidateNested()
  @Type(() => DaySchedule)
  tuesday: DaySchedule;

  @ApiProperty({ type: DaySchedule })
  @ValidateNested()
  @Type(() => DaySchedule)
  wednesday: DaySchedule;

  @ApiProperty({ type: DaySchedule })
  @ValidateNested()
  @Type(() => DaySchedule)
  thursday: DaySchedule;

  @ApiProperty({ type: DaySchedule })
  @ValidateNested()
  @Type(() => DaySchedule)
  friday: DaySchedule;

  @ApiProperty({ type: DaySchedule })
  @ValidateNested()
  @Type(() => DaySchedule)
  saturday: DaySchedule;

  @ApiProperty({ type: DaySchedule })
  @ValidateNested()
  @Type(() => DaySchedule)
  sunday: DaySchedule;
}

export class UpdateUserDeliveryAgentDto {
  @ApiProperty()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  siret: string;

  @ApiProperty()
  @IsNotEmpty()
  licenseNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty()
  @IsNotEmpty()
  companyAddress: string;

  @ApiProperty()
  @IsNotEmpty()
  companyCity: string;

  @ApiProperty()
  @IsNotEmpty()
  vehiculeType: VehiculeType;

  @ApiProperty()
  @IsNotEmpty()
  favoriteDeliveryCity: string;

  @ApiProperty()
  @IsNotEmpty()
  maxRadiusKm: string;

  @ApiProperty({ type: Schedule })
  @ValidateNested()
  @Type(() => Schedule)
  schedule: Schedule;
}
