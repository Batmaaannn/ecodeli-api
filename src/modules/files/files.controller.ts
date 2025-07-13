import { FilesInterceptor } from "@nestjs/platform-express";
import { Public } from "../auth/decorator/public.decorator";
import { FilesService } from "./files.service";
import { CreateFileDto } from "./dto/create-file.dto";
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UploadedFiles,
  UseInterceptors,
  Param,
  ParseIntPipe,
  Patch,
} from "@nestjs/common";
import { Roles } from "../auth/decorator/roles.decorator";
import { UserType } from "src/types/user";
import { UpdateFileStatutRegistrationDto } from "./dto/update-file-statut-registration.dto";

@Controller("files")
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Public()
  @Post("register-request-files")
  @UseInterceptors(FilesInterceptor("files"))
  async createServiceAgent(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createFileDto: CreateFileDto
  ) {
    files.map((file) => {
      if (
        !file.mimetype.match(
          /jpg|jpeg|png|application\/octet-stream|application\/pdf/i
        )
      )
        throw new HttpException(
          "Can only process jpg, jpeg or pdf files",
          HttpStatus.BAD_REQUEST
        );
    });

    return this.filesService.createRegistrationRequestFile({
      ...createFileDto,
      files,
    });
  }

  @Patch(":registrationId/update-registration")
  @Roles(UserType.ADMIN)
  async updateFileStatutRegistration(
    @Param("registrationId", ParseIntPipe) id: number,
    @Body() updateFileStatutRegistrationDto: UpdateFileStatutRegistrationDto[]
  ) {
    return this.filesService.updateFileRegistration(
      id,
      updateFileStatutRegistrationDto
    );
  }
}
