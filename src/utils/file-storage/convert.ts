import { FileSystemStoredFile } from "nestjs-form-data";
import * as fs from "fs";

export const convertToMulterFile = (
  file: FileSystemStoredFile
): Express.Multer.File => {
  console.log("Converting FileSystemStoredFile to Express.Multer.File:", file);
  const fileBuffer = fs.readFileSync(file.path);
  const fileSize = fs.statSync(file.path).size;

  return {
    buffer: fileBuffer,
    size: fileSize,
    originalname: file.originalName,
    mimetype: file.mimeType,
    fieldname: "",
    encoding: file.encoding || "7bit",
    stream: null,
    destination: "",
    filename: file.originalName,
    path: file.path,
  } as Express.Multer.File;
};
