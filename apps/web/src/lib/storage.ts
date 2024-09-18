import { api } from "./api";
import { nanoid } from "@repo/libs";
import type { FileUpload } from "@repo/db/schema";
import { type Result, err, ok } from "@justmiracle/result";

export const Storage = {
  async upload(file: File): Promise<Result<FileUpload>> {
    const formData = new FormData();
    formData.append("file", file);

    // const response = await fetch(new URL("/v1/upload", env.VITE_API_URL), {
    //   credentials: "include",
    //   method: "POST",
    //   body: formData,
    // });

    const response = await api
      .post("v1/upload", { body: formData })
      .json<FileUpload>()
      .then(ok)
      .catch(err);

    return response;
  },
  async mockUpload(file: File): Promise<Result<FileUpload>> {
    const random = Math.random();
    const size = file.size / 1024 / 1024;
    await new Promise((resolve) => setTimeout(resolve, size * 1500));

    if (random < 0.37) {
      return err("Upload failed");
    }

    return ok({
      id: nanoid(),
      name: file.name,
      url: URL.createObjectURL(file),
      size: file.size,
      hash: `${nanoid()}.webp`,
      type: file.type,
      userId: nanoid(),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
  },
};
