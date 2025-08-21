import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Status } from "src/types/status";
import { DocumentType } from "src/types/file";

export class UpdateFileStatutRegistrationDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  status: Status;

  @ApiProperty()
  validityDate: Date | null;

  @ApiProperty()
  @IsNotEmpty()
  type: DocumentType;
}
