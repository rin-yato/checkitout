import { cn } from "@/lib/cn";
import { FileX, Spinner } from "@phosphor-icons/react";
import { Avatar, Text } from "@radix-ui/themes";
import { useMemo } from "react";
import { CheckmarkIcon, ErrorIcon } from "react-hot-toast";
import { P, match } from "ts-pattern";
import type {
  FileState,
  FileStateDefault,
  FileStatePending,
  FileStateSuccess,
} from "./use-file-states";

export function UploadImagePreview({
  fileState,
  className,
}: { fileState: FileStateSuccess | FileStatePending | FileStateDefault; className?: string }) {
  const url = useMemo(
    () =>
      match(fileState)
        .with({ _tag: "SUCCESS" }, { _tag: "DEFAULT" }, (state) => state.data.url)
        .with({ _tag: "PENDING" }, (state) => URL.createObjectURL(state.file))
        .exhaustive(),
    [fileState],
  );

  return <Avatar src={url} fallback className={cn("size-full flex-1", className)} />;
}

export function UploadPreviewError(_: { error: string }) {
  return (
    <div className="flex size-full flex-1 items-center justify-center rounded-md bg-red-100">
      <FileX className="text-destructive" size={32} />
    </div>
  );
}

export function UploadPreviewer({
  fileState,
}: { fileState: FileStatePending | FileStateSuccess | FileStateDefault }) {
  const isImage = match(fileState)
    .with({ _tag: "PENDING" }, (data) => data.file.type.startsWith("image/"))
    .with({ _tag: "SUCCESS" }, { _tag: "DEFAULT" }, (data) =>
      data.data.type.startsWith("image/"),
    )
    .exhaustive();

  if (isImage) {
    return <UploadImagePreview fileState={fileState} />;
  }

  const extension = match(fileState)
    .with({ _tag: "PENDING" }, (data) => data.file.name.split(".").pop())
    .with({ _tag: "SUCCESS" }, { _tag: "DEFAULT" }, (data) => data.data.name.split(".").pop())
    .exhaustive();

  return (
    <div className="flex size-full flex-1 items-center justify-center rounded-md bg-gray-100">
      {match(extension)
        .with(P.string, (ext) => (
          <Text className="uppercase" color="gray">
            {ext}
          </Text>
        ))
        .otherwise(() => (
          <FileX className="text-destructive" />
        ))}
    </div>
  );
}

export const UploadIcon = {
  Loading: () => (
    <div className="zoom-in flex size-5 animate-in items-center justify-center rounded-full bg-black duration-300 ease-out">
      <Spinner className="animate-spin text-white" weight="bold" size={14} />
    </div>
  ),
  Error: () => (
    <div className="zoom-out animate-out fill-mode-forwards delay-1000 duration-200 ease-in-out">
      <ErrorIcon />
    </div>
  ),
  Success: () => (
    <div className="zoom-out animate-out fill-mode-forwards delay-1000 duration-200 ease-in-out">
      <CheckmarkIcon className="" />
    </div>
  ),
};

export const UploadPreview = (props: { fileState: FileState; className?: string }) => {
  const state = props.fileState._tag;

  return (
    <div
      className={cn(
        "upload-preview-container relative size-full flex-1",
        state === "PENDING" && "[&>:nth-child(2)]:animate-pulse",
      )}
    >
      <div className="absolute top-1 right-1">
        {match(state)
          .with("PENDING", UploadIcon.Loading)
          .with("SUCCESS", UploadIcon.Success)
          .with("ERROR", UploadIcon.Error)
          .with("DEFAULT", () => null)
          .exhaustive()}
      </div>

      {match(props.fileState)
        .with({ _tag: "ERROR" }, ({ error }) => <UploadPreviewError error={error} />)
        .otherwise((fileState) => (
          <UploadPreviewer fileState={fileState} />
        ))}
    </div>
  );
};
