import { type PropsWithChildren, createContext, useContext } from "react";
import type { DropzoneState } from "react-dropzone";
import type { FileStateEntry } from "./use-file-states";

type Actions = {
  reorder: (fileStateEntries: FileStateEntry[]) => void;
  remove: (filename: string) => void;
  retry: (filename: string) => void;
};

export type UploadContext = {
  dropzone: DropzoneState;
  fileStates: FileStateEntry[];
  actions: Actions;
};

const UploadContext = createContext<UploadContext | null>(null);

export function UploadProvider({
  children,
  value,
}: PropsWithChildren<{
  value: UploadContext;
}>) {
  return <UploadContext.Provider value={value}>{children}</UploadContext.Provider>;
}

export function useUpload() {
  const context = useContext(UploadContext);

  if (!context) {
    throw new Error("useUpload must be used within an UploadProvider");
  }

  return context;
}
