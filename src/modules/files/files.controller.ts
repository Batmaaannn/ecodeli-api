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
} from "@nestjs/common";

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
}
