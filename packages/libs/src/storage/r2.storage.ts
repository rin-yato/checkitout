import { PutObjectCommand, S3Client, type S3ClientConfig } from "@aws-sdk/client-s3";
import type { Storage } from "./storage.interface";

export interface R2Config {
  s3: S3ClientConfig;
  bucket: string;
  publicUrl: string;
}

export class R2Storage implements Storage {
  private client: S3Client;
  private bucket: string;
  private publicUrl: string;

  constructor(config: R2Config) {
    this.client = new S3Client(config.s3);
    this.bucket = config.bucket;
    this.publicUrl = config.publicUrl;
  }

  async upload(opts: {
    key: string;
    mime: string;
    hashedFilename: string;
    buffer: Buffer | Uint8Array;
  }): Promise<string> {
    await this.client.send(
      new PutObjectCommand({
        Key: opts.key,
        Body: opts.buffer,
        ContentType: opts.mime,
        Bucket: this.bucket,
      }),
    );

    return new URL(opts.key, this.publicUrl).toString();
  }
}
