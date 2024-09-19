import sharp from "sharp";
import { type FileTypeResult, fileTypeFromBuffer } from "file-type";
import { hash } from "@repo/libs";
import { err, ok } from "@justmiracle/result";
import { storage } from "@/lib/storage";
import { db, takeFirstOrThrow } from "@/lib/db";
import { TB_fileUpload } from "@repo/db/table";
import { apiError } from "@/lib/error";

const OPTIMIZE_IMAGE = {
  format: "webp",
  mime: "image/webp",
  quality: 80,
} as const;

class FileUploadService {
  async uploadFile(file: File, userId: string) {
    const buffer = new Uint8Array(await file.arrayBuffer());

    const fileTypeFallback = {
      ext: file.type.split("/").pop() ?? "",
      mime: file.type,
    } as FileTypeResult;
    const fileType = (await fileTypeFromBuffer(buffer)) ?? fileTypeFallback;

    const fileHash = hash(buffer);
    const hashedFilename = `${fileHash}.${fileType.ext}`;

    const key = `u-${userId}/profile/${hashedFilename}`;

    const optimizedImageResult = await sharp(buffer)
      .toFormat(OPTIMIZE_IMAGE.format, { quality: OPTIMIZE_IMAGE.quality })
      .toBuffer()
      .then(ok)
      .catch(err);

    if (optimizedImageResult.error) {
      throw apiError({
        status: 500,
        message: "Failed to optimize file",
        details: optimizedImageResult.error,
      });
    }

    const url = await storage
      .upload({
        key,
        buffer: optimizedImageResult.value,
        hashedFilename,
        mime: OPTIMIZE_IMAGE.mime,
      })
      .then(ok)
      .catch(err);

    if (url.error) {
      throw apiError({
        status: 500,
        message: "Failed to upload file",
        details: url.error,
      });
    }

    const fileUpload = await db
      .insert(TB_fileUpload)
      .values({
        hash: hashedFilename,
        name: file.name,
        type: OPTIMIZE_IMAGE.mime,
        size: file.size,
        url: url.value,
        userId,
      })
      .returning()
      .then(takeFirstOrThrow)
      .then(ok)
      .catch(err);

    if (fileUpload.error) {
      throw apiError({
        status: 500,
        message: "Failed to save your file",
        details: fileUpload.error,
      });
    }

    return fileUpload;
  }
}

export const fileUploadService = new FileUploadService();
