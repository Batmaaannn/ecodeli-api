import { FilesService } from "./files.service";
import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  HttpException,
  HttpStatus,
  Get,
  Request,
} from "@nestjs/common";
import { Roles } from "../auth/decorator/roles.decorator";
import { UserType } from "src/types/user";
import { UpdateFileStatutRegistrationDto } from "./dto/update-file-statut-registration.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("files")
@Controller("files")
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Patch(":targetId/update-registration")
  @Roles(UserType.ADMIN)
  async updateFileStatus(
    @Param("targetId", ParseIntPipe) targetId: number,
    @Body() updateFileStatusDto: UpdateFileStatutRegistrationDto[],
    @Request() req
  ) {

    const { userId } = req.user;

    return this.filesService.updateFileStatus(targetId, userId, updateFileStatusDto);
  }

  @Get("download-file")
  async downloadFile(@Request() req: any, @Query("filePath") filePath: string) {
    if (!filePath) {
      throw new HttpException("File path is required", HttpStatus.BAD_REQUEST);
    }

    return await this.filesService.getFileDownloadUrl(filePath);
  }
}
