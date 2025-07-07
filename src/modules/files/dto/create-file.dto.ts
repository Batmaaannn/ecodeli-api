import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateFileDto {
  @ApiProperty()
  files: Express.Multer.File[];

  @ApiProperty()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty()
  info: string;

  @ApiProperty()
  tokenRequest: string;

  @ApiProperty()
  registrationRequestId: number;
}
