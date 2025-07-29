import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsBoolean } from "class-validator";

export class UpdateStatusRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;
}
