import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
} from "class-validator";
import { Statut } from "src/types/statut";

export class UpdateFileStatutRegistrationDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  status: Statut;

  @ApiProperty()
  @IsNotEmpty()
  validityDate: Date;
}
