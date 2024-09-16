import { Storage } from "@/lib/storage";
// @ts-ignore
import type { FileUpload } from "@repo/db/schema";
import { useCallback } from "react";
import { match } from "ts-pattern";
import { useMap } from "usehooks-ts";

export interface FileStatePending {
  _tag: "PENDING";
  file: File;
}

export interface FileStateSuccess {
  _tag: "SUCCESS";
  data: FileUpload;
  file?: File;
}

export interface FileStateError {
  _tag: "ERROR";
  error: string;
  file: File;
}

export type FileState = FileStatePending | FileStateSuccess | FileStateError;

export type FileStateEntry = [string, FileState];
export type FileStateIterable = IterableIterator<FileStateEntry>;

export type UseFileConfig = {
  defaultFiles?: FileStateEntry[];
};

export type UseFileStates = ReturnType<typeof useFileStates>;

export function useFileStates(config?: UseFileConfig) {
  const [fileStates, fileStatesActions] = useMap<string, FileState>(
    config?.defaultFiles,
  );

  const getFileState = useCallback(
    (filename: string) => {
      const fileState = fileStates.get(filename);

      if (!fileState) return { _tag: "NOT_FOUND" } as const;

      return { _tag: "FOUND", state: fileState } as const;
    },
    [fileStates],
  );

  const triggerUpload = useCallback(
    async (file: File) => {
      const fileState = getFileState(file.name);

      async function handleUpload() {
        const result = await Storage.upload(file);

        if (result.error) {
          return fileStatesActions.set(file.name, {
            _tag: "ERROR",
            error: result.error.message,
            file,
          });
        }

        fileStatesActions.set(file.name, {
          _tag: "SUCCESS",
          data: result.value,
          file,
        });
      }

      match(fileState)
        .with({ _tag: "FOUND" }, async ({ state }) => {
          if (state._tag !== "ERROR") return;
          fileStatesActions.set(state.file.name, { _tag: "PENDING", file });
          handleUpload();
        })
        .with({ _tag: "NOT_FOUND" }, () => {
          fileStatesActions.set(file.name, { _tag: "PENDING", file });
          handleUpload();
        })
        .exhaustive();
    },
    [fileStatesActions, getFileState],
  );

  const setFiles = useCallback(
    (files: File[]) => {
      for (const file of files) {
        const fileState = getFileState(file.name);
        if (fileState._tag === "FOUND" && fileState.state._tag !== "ERROR")
          continue;
        triggerUpload(file);
      }
    },
    [getFileState, triggerUpload],
  );

  const setFileStates = useCallback(
    (newFileStates: FileState[]) => {
      fileStatesActions.reset();

      for (const fileState of newFileStates) {
        match(fileState)
          .with({ _tag: "SUCCESS" }, (data) => {
            fileStatesActions.set(data.data.name, data);
          })
          .otherwise((data) => {
            fileStatesActions.set(data.file.name, data);
          });
      }
    },
    [fileStatesActions],
  );

  const reorder = useCallback(
    (fileStateEntries: FileStateEntry[]) => {
      fileStatesActions.setAll(fileStateEntries);
    },
    [fileStatesActions],
  );

  const remove = useCallback(
    (filename: string) => {
      fileStatesActions.remove(filename);
    },
    [fileStatesActions],
  );

  const retry = useCallback(
    (filename: string) => {
      const fileState = getFileState(filename);
      if (fileState._tag !== "FOUND" || fileState.state._tag !== "ERROR")
        return;
      triggerUpload(fileState.state.file);
    },
    [triggerUpload, getFileState, fileStates],
  );

  return {
    fileStates,
    triggerUpload,
    setFiles,
    setFileStates,
    getFileState,
    fileStatesActions,
    reorder,
    remove,
    retry,
  };
}
