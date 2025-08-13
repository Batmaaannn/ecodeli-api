import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { File } from "./entities/file.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import slugify from "slugify";
import { getFileSignedUrl, uploadFile } from "src/utils/file-storage/s3";
import config from "src/config";
import { FileTargetType } from "src/types/file";
import { UpdateFileStatutRegistrationDto } from "./dto/update-file-statut-registration.dto";
import { checkUserCanUpdateRegistrationFile } from "src/utils/authorized";
import { Status } from "src/types/status";

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>
  ) {}

  async createRegistrationRequestFile(registration: {
    files: Express.Multer.File[];
    info?: string;
    tokenRequest: string;
    registrationRequestId: number;
  }) {
    const { files, info, tokenRequest, registrationRequestId } = registration;

    if (!files.length) {
      throw new HttpException("No files received", HttpStatus.BAD_REQUEST);
    }

    const createdFiles = [];

    for (const file of files) {
      const fileNameSlugified = slugify(file.originalname, {
        lower: true,
      }).replace(/\.jpg|\.jpeg|\.png/i, ".pdf");

      const fileFullPath = `${tokenRequest}/${fileNameSlugified}`;

      try {
        const presignedURL: string = await this.processFile(
          fileFullPath,
          file,
          tokenRequest.toString()
        );

        const fileRecord = {
          ...(info && { info }),
          file_name: fileNameSlugified,
          file_url: fileFullPath,
          target_type: FileTargetType.REGISTRATION_REQUEST,
          target_id: registrationRequestId,
        };

        const createdFile = await this.insertOne(fileRecord);

        createdFiles.push({
          ...createdFile,
          url: presignedURL,
        });
      } catch (err) {
        console.error(err);
        throw new HttpException(
          "Error while creating registration request file",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }

    return createdFiles;
  }

  async updateFileRegistration(
    registrationId: number,
    updateFileStatutRegistrationDto: UpdateFileStatutRegistrationDto[]
  ): Promise<File> {
    for (const updateDto of updateFileStatutRegistrationDto) {
      const { id, status, validityDate } = updateDto;
      const file = await this.findOneById(id);

      if (!file) {
        throw new HttpException(`File not found`, HttpStatus.NOT_FOUND);
      }

      const isAuthorized = checkUserCanUpdateRegistrationFile(
        registrationId,
        file
      );

      if (!isAuthorized)
        throw new HttpException(
          "Unauthorized - you can't update this resource",
          HttpStatus.UNAUTHORIZED
        );

      file.status = status;
      file.validity = validityDate;

      switch (status) {
        case Status.ACCEPTED:
          file.approval_date = new Date();
          break;
        case Status.REJECTED:
        case Status.PENDING:
          file.approval_date = null;
          break;
      }

      this.fileRepository.save(file);
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

  async createFile(data: {
    files: Express.Multer.File[];
    userId: number;
    targetType: FileTargetType;
    targetId: number;
    info?: string;
  }) {
    const { files, info, userId, targetType, targetId } = data;

    const createdFiles = [];

    for (const file of files) {
      const fileNameSlugified = slugify(file.originalname, {
        lower: true,
      });

      const fileFullPath = `${targetType}/${targetId}/${fileNameSlugified}`;

      try {
        const presignedURL: string = await this.processFile(
          fileFullPath,
          file,
          targetId.toString()
        );

        const fileRecord = {
          ...(info && { info }),
          file_name: fileNameSlugified,
          file_url: fileFullPath,
          target_type: targetType,
          target_id: targetId,
          user_id: userId,
        };

        const createdFile = await this.insertOne(fileRecord);

        createdFiles.push({
          ...createdFile,
          url: presignedURL,
        });
      } catch (err) {
        console.error(err);
        throw new HttpException(
          "Error while creating file with user relation",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }

    return createdFiles;
  }

  /* Db Request */
  async insertOne(fileData: Partial<File>) {
    return this.fileRepository.save(fileData);
  }

  async getFilesByTargetTypeAndId(
    targetType: FileTargetType,
    targetId: number
  ): Promise<File[]> {
    return this.fileRepository.find({
      where: {
        target_type: targetType,
        target_id: targetId,
      },
    });
  }

  findOneById(id: number): Promise<File> {
    return this.fileRepository.findOne({ where: { id } });
  }
}
