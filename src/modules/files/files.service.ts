import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { File } from "./entities/file.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import slugify from "slugify";
import { getFileSignedUrl, uploadFile } from "src/utils/file-storage/s3";
import config from "src/config";
import { FileTargetType } from "src/types/file";

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>
  ) {}

  async createRegistrationRequestFile(registration: {
    files: Express.Multer.File[];
    fileName: string;
    info?: string;
    tokenRequest: string;
    registrationRequestId: number;
  }) {
    const { fileName, files, info, tokenRequest, registrationRequestId } =
      registration;

    if (!files.length) {
      throw new HttpException("No files received", HttpStatus.BAD_REQUEST);
    }

    for (const file of files) {
      const fileNameSlugified = slugify(fileName, { lower: true }).replace(
        /\.jpg|\.jpeg|\.png/i,
        ".pdf"
      );

      const fileFullPath = `${tokenRequest}/${fileNameSlugified}`;

      try {
        await this.processFile(fileFullPath, file, tokenRequest.toString());

        const registration = {
          ...(info && { info }),
          file_name: fileNameSlugified,
          file_url: fileFullPath,
          target_type: FileTargetType.REGISTRATION_REQUEST,
          target_id: registrationRequestId,
        };

        await this.insertOne(registration);
      } catch (err) {
        console.log(err);
        throw new HttpException(
          "Error while creating registration request file",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
    return;
  }

  async processFile(
    path: string,
    fileToUpload: Express.Multer.File,
    id: string
  ) {
    const uploadedFilePath = await uploadFile(
      fileToUpload,
      path,
      config.storage.bucket,
      { id }
    );

    return getFileSignedUrl(uploadedFilePath, config.storage.bucket);
  }

  /* Db Request */
  async insertOne(fileData: Partial<File>) {
    return this.fileRepository.save(fileData);
  }
}
