import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEmail, Length, IsEnum } from "class-validator";
import { VehiculeType } from "src/types/vehicule";

export class CreateDeliveryAgentRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(14, 14, { message: "Siret is not equal 14" })
  siret: string;

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
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(1, 15, { message: "Driving license length must be between 1 and 15" })
  drivingLicense: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(VehiculeType)
  vehicleType: VehiculeType;
}
