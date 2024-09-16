import { env } from "@/lib/env";
import { type Result, err, ok } from "@justmiracle/result";
// @ts-ignore
import type { FileUpload } from "@repo/db/schema";

const nanoid = () => {
  let id = "";
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 21; i++) {
    id += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }

  return id;
};

export const Storage = {
  async upload(file: File): Promise<Result<FileUpload>> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(new URL("/upload/single", env.VITE_API_URL), {
      credentials: "include",
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      return err(await response.json());
    }

    return ok((await response.json()).data);
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
      storeId: nanoid(),
      userId: nanoid(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
};
