import {
  IsNotEmpty,
  IsEmail,
  Length,
  ValidateNested,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  FileSystemStoredFile,
  HasMimeType,
  IsFiles,
} from "nestjs-form-data";

export class SelectedPrestationsDto {
  @ApiProperty()
  @IsNotEmpty()
  prestationId: string;

  @ApiProperty()
  @IsNotEmpty()
  requestedPrice: string;
}
export class CreateUserServiceAgentDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(14, 14, { message: "Siret is not equal 14" })
  companySiret: string;

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
  companyPostalCode: string;

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
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => SelectedPrestationsDto)
  selectedPrestations: SelectedPrestationsDto[];

  @IsFiles()
  @HasMimeType(["application/pdf", "image/jpeg", "image/png"], { each: true })
  files: FileSystemStoredFile[];
}
