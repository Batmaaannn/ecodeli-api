import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import { extname } from "path";
import mime from "mime-types";
import config from "src/config";
import { Environments } from "src/types/environments";

const s3Client = new S3Client({
  credentials: {
    accessKeyId: config.storage.accessKeyId,
    secretAccessKey: config.storage.secretKey,
  },
  endpoint: config.storage.host,
  region: config.storage.region,
  forcePathStyle: config.environment === Environments.DEV,
});

export const uploadFile = async (
  file: Express.Multer.File | Buffer | Uint8Array,
  filepath: string,
  bucket: string,
  metadata?: { [key: string]: string }
): Promise<string> => {
  const bytes =
    file instanceof Buffer || file instanceof Uint8Array ? file : file.buffer;

  const mimeType =
    file instanceof Buffer || file instanceof Uint8Array
      ? "application/octet-stream"
      : file.mimetype || mime.lookup(filepath) || "application/octet-stream";

  const params = {
    Bucket: bucket,
    Key: filepath,
    Body: bytes,
    ContentDisposition: "inline",
    ContentType: mimeType,
    ...(metadata && { Metadata: metadata }),
  };

  await s3Client.send(new PutObjectCommand(params));

  return filepath;
};

export const uploadFilesWithToken = async (
  files: Express.Multer.File[],
  tokenRequest: string,
  bucket: string
): Promise<string[]> => {
  const uploadedPaths: string[] = [];

  for (const file of files) {
    const extension = extname(file.originalname);
    const uniqueFileName = `${uuidv4()}${extension}`;
    const filePath = `${tokenRequest}/${uniqueFileName}`;

    await uploadFile(file, filePath, bucket);
    uploadedPaths.push(filePath);
  }

  return uploadedPaths;
};

export const getFileSignedUrl = async (filepath: string, bucket: string) => {
  const params = {
    Bucket: bucket,
    Key: filepath,
    Expires: config.storage.fileUrlExpiration,
  };
  const command = new GetObjectCommand(params);

  return getSignedUrl(s3Client, command, {
    expiresIn: config.storage.fileUrlExpiration,
  });
};

export const removeFile = async (filepath: string, bucket: string) => {
  const params = {
    Bucket: bucket,
    Key: filepath,
  };

  await s3Client.send(new DeleteObjectCommand(params));
};
