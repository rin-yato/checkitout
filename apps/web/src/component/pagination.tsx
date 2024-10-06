import { IconButton, Select, Text } from "@radix-ui/themes";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { Label } from "./ui/label";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination(props: PaginationProps) {
  return (
    <div className="flex items-center justify-between">
      <Text color="gray">
        Page {props.currentPage ?? 1} of {props.totalPages ?? 1}
      </Text>

      <div className="flex items-center gap-x-2">
        <IconButton
          variant="soft"
          color="gray"
          disabled={props.currentPage === 1}
          onClick={() => props.onPageChange(props.currentPage - 1)}
        >
          <CaretLeft size={18} />
        </IconButton>
        <IconButton
          variant="soft"
          color="gray"
          disabled={props.currentPage === props.totalPages}
          onClick={() => props.onPageChange(props.currentPage + 1)}
        >
          <CaretRight size={18} />
        </IconButton>
      </div>

      <Select.Root defaultValue="10">
        <div className="flex items-center gap-x-4">
          <Label className="text-gray-foreground">Per Page</Label>
          <Select.Trigger />
        </div>
        <Select.Content position="popper">
          <Select.Item value="10">10</Select.Item>
          <Select.Item value="20" disabled>
            20
          </Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
  );
}
