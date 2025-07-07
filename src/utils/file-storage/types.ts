export enum SupportedFileTypes {
  PDF = "pdf",
  IMAGE = "image",
}

export function inferFileType(
  file: Express.Multer.File
): SupportedFileTypes | null {
  const mimeType = file.mimetype;
  const fileName = file.originalname.toLowerCase();

  if (mimeType.match(/image/i)) {
    return SupportedFileTypes.IMAGE;
  }

  if (mimeType.match(/pdf/i)) {
    return SupportedFileTypes.PDF;
  }

  if (mimeType.match(/octet-stream/i)) {
    if (fileName.endsWith(".pdf")) {
      return SupportedFileTypes.PDF;
    }
    if (fileName.match(/\.jpg$|\.jpeg$|\.png$/gi)) {
      return SupportedFileTypes.IMAGE;
    }
  }

  return null;
}
