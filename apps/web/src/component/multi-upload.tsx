import { Sortable, type SortableProps } from "./sortable";
import { SortableItem } from "./sortable/sortable-item";
import { useUpload } from "./upload/upload.provider";
import type { FileStateEntry } from "./upload/use-file-states";

function Root(props: {
  children: SortableProps<FileStateEntry>["render"];
}) {
  const { fileStates, actions } = useUpload();
  return <Sortable items={fileStates} setItems={actions.reorder} render={props.children} />;
}

function Item() {
  return (
    <SortableItem id={id} key={id}>
      {({ setNodeRef, attributes, listeners, isDragging, style }) => (
        <div
          ref={setNodeRef}
          data-dragging={isDragging}
          className={cn(
            "-mx-3 group rounded-lg px-2 py-3 pr-5",
            "flex items-center gap-x-3 transition-shadow duration-300",
            "data-[filestate=PENDING]:animate-pulse",
            isDragging && "z-20 bg-bg-subtle shadow-lg",
          )}
          data-filestate={fileState._tag}
          style={style}
        >
          <div
            className="handle cursor-grab duration-200 hover:bg-bg-subtle active:cursor-grabbing"
            {...listeners}
            {...attributes}
          >
            <DotsSixVertical size={22} />
          </div>
        </div>
      )}
    </SortableItem>
  );
}

export const MultiUpload = {
  Root,
};
