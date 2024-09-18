import type { FileUpload } from "@repo/db/schema";
import type { FileState, FileStateEntry } from "./use-file-states";

export function getFileStateEntries(
  fileStates: Omit<Map<string, FileState>, "clear" | "delete" | "set">,
): FileStateEntry[] {
  return Array.from(fileStates.entries());
}

export function hasPendingFiles(fileStates: FileState[]) {
  return fileStates.some((fileState) => fileState._tag === "PENDING");
}

export function getUploadedFiles(fileStates: FileState[]) {
  return fileStates.filter(
    (fileState) => fileState._tag === "SUCCESS" || fileState._tag === "DEFAULT",
  );
}

export function getFirstUploadedFile(fileStates: FileState[]) {
  return getUploadedFiles(fileStates).at(0);
}

export function generateDefaultFileState(fileUploads: (null | FileUpload)[]): FileStateEntry[] {
  return fileUploads
    .filter((f) => f !== null)
    .map((fileUpload) => [
      fileUpload.name,
      {
        _tag: "DEFAULT",
        data: fileUpload,
      },
    ]);
}
