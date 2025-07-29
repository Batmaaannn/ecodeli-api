import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Status } from "src/types/status";

export class UpdateFileStatutRegistrationDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  status: Status;

  @ApiProperty()
  @IsNotEmpty()
  validityDate: Date;
}
