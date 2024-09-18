import { cn } from "@/lib/cn";
import { Slot, type SlotProps } from "@radix-ui/react-slot";
import { Avatar } from "@radix-ui/themes";
import {
  type ComponentProps,
  type PropsWithChildren,
  type ReactNode,
  useEffect,
  useMemo,
} from "react";
import { type DropzoneOptions, useDropzone } from "react-dropzone";
import { match } from "ts-pattern";
import {
  UploadProvider,
  useUpload,
  type UploadContext as BaseUploadContext,
} from "./upload.provider";
import { type FileState, type FileStateEntry, useFileStates } from "./use-file-states";
import { getFileStateEntries } from "./utils";

export interface UploadProps {
  defaultFileStates?: FileStateEntry[];
  dropzoneOpts?: DropzoneOptions;
  onFileStatesChange?: (fileStates: FileState[]) => void;
}

export const FILE_VALIDATION_ERRORS = {
  DUPLICATE: {
    code: "DUPLICATE",
    message: "File already exists",
  },
} as const;

export function UploadRoot(props: PropsWithChildren<UploadProps>) {
  const { fileStates, setFiles, fileStatesActions, reorder, remove, retry } = useFileStates({
    defaultFiles: props.defaultFileStates,
  });

  const dropzoneState = useDropzone({
    ...props.dropzoneOpts,
    validator: (file) => {
      const existintFile = fileStates.get(file.name);

      if (existintFile && existintFile._tag !== "ERROR") {
        return FILE_VALIDATION_ERRORS.DUPLICATE;
      }

      return props.dropzoneOpts?.validator?.(file) || null;
    },
  });

  const fileStateEntries = useMemo(() => getFileStateEntries(fileStates), [fileStates]);

  const actions = useMemo(() => ({ reorder, remove, retry }), [reorder, remove, retry]);

  useEffect(() => {
    if (props.dropzoneOpts?.multiple === false && dropzoneState.acceptedFiles.length === 1) {
      fileStatesActions.reset();
    }
    setFiles(dropzoneState.acceptedFiles);
  }, [dropzoneState.acceptedFiles]);

  useEffect(() => {
    props.onFileStatesChange?.(Array.from(fileStates.values()));
  }, [fileStates]);

  return (
    <UploadProvider value={{ dropzone: dropzoneState, fileStates: fileStateEntries, actions }}>
      <input {...dropzoneState.getInputProps()} />
      {props.children}
    </UploadProvider>
  );
}

const dropzoneClassNames = cn(
  "flex items-center justify-center rounded-4 p-3",
  "border-2 border-dashed hover:border-primary data-[drag-over=true]:border-primary",
  "text-gray-foreground hover:text-primary data-[drag-over=true]:text-primary",
  "focus-visible:border-primary focus-visible:text-primary focus-visible:outline-none",
  "data-[has-preview=true]:border-solid",
);

export function UploadDropzone(props: ComponentProps<"div">) {
  const { dropzone } = useUpload();
  return (
    <div
      {...props}
      {...dropzone.getRootProps({
        className: cn("dropzone", dropzoneClassNames, props.className),
      })}
      data-drag-over={dropzone.isDragActive}
      data-drag-reject={dropzone.isDragReject}
      data-drag-accept={dropzone.isDragAccept}
      data-has-preview={dropzone.acceptedFiles.length > 0}
    />
  );
}

export function UploadTrigger(props: SlotProps) {
  const { dropzone } = useUpload();
  return <Slot {...props} onClick={dropzone.open} />;
}

export type UploadContextProps = (props: BaseUploadContext) => ReactNode;

export function UploadContext(props: { children: UploadContextProps }) {
  const { dropzone, fileStates, actions } = useUpload();

  return <props.children dropzone={dropzone} fileStates={fileStates} actions={actions} />;
}

export function UploadImagePreview({
  fileState,
  className,
}: { fileState: FileState; className?: string }) {
  const url = useMemo(
    () =>
      match(fileState)
        .with({ _tag: "SUCCESS" }, { _tag: "DEFAULT" }, (state) => state.data.url)
        .with({ _tag: "PENDING" }, (state) => URL.createObjectURL(state.file))
        .with({ _tag: "ERROR" }, () => undefined)
        .exhaustive(),
    [fileState],
  );

  return <Avatar src={url} fallback className={cn("size-full flex-1", className)} />;
}
