import { Text } from "@radix-ui/themes";
import { useMemo } from "react";
import { UploadDropzone } from "./upload";
import { UploadPreview } from "./upload/upload.preview";
import { useUpload } from "./upload/upload.provider";
import { cn } from "@/lib/cn";

export function SingleUploadUI({
  label = "Drop your file here",
  className,
}: { label?: string; className?: string }) {
  const { fileStates } = useUpload();

  const uploadPreview = useMemo(() => {
    return fileStates.map(([key, fileState]) => (
      <UploadPreview fileState={fileState} key={key} />
    ));
  }, [fileStates]);

  return (
    <UploadDropzone className={cn("aspect-square p-0", className)}>
      {uploadPreview}

      <Text align="center" wrap="pretty" className="hidden select-none px-3 first:block">
        {label}
      </Text>
    </UploadDropzone>
  );
}
