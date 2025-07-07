import { PDFDocument, PDFImage } from "pdf-lib";
import { inferFileType, SupportedFileTypes } from "./types";
import sharp from "sharp";

/**
 * Merge every PDF/Image into a single PDF document
 */
export async function mergeFiles(
  files: Express.Multer.File[]
): Promise<Uint8Array> {
  const finalDoc = await PDFDocument.create();

  for (const file of files) {
    const fileType = inferFileType(file);
    if (fileType === null) {
      continue;
    }

    let fileBytes = Buffer.from(file.buffer);

    switch (fileType) {
      case SupportedFileTypes.IMAGE:
        const imagePage = finalDoc.addPage();
        let image: PDFImage | null = null;
        if (
          file.originalname.toLowerCase().endsWith(".jpg") ||
          file.originalname.toLowerCase().endsWith(".jpeg")
        ) {
          // NOTE : Use Exif metadata to rotate the image
          const rotatedBuffer = await sharp(fileBytes).rotate().toBuffer();
          fileBytes = Buffer.from(rotatedBuffer);
          image = await finalDoc.embedJpg(fileBytes);
        } else {
          // PNG
          image = await finalDoc.embedPng(fileBytes);
        }

        const { width, height } = image.scaleToFit(
          imagePage.getWidth(),
          imagePage.getHeight()
        );

        imagePage.drawImage(image, {
          x: 0,
          y: 0,
          width: width,
          height: height,
        });
        break;
      case SupportedFileTypes.PDF:
        const fileToMerge = await PDFDocument.load(fileBytes);
        const copiedPages = await finalDoc.copyPages(
          fileToMerge,
          fileToMerge.getPageIndices()
        );
        for (const page of copiedPages) {
          finalDoc.addPage(page);
        }

        break;
    }
  }

  const bytes = await finalDoc.save();

  return bytes;
}
