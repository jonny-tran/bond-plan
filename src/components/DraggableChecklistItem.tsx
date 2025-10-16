import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { GripVertical, Pencil, Trash2 } from "lucide-react";

interface ChecklistItem {
  id: string;
  title: string;
  done: boolean;
  assignee_role: string;
  due_date: string | null;
}

interface DraggableChecklistItemProps {
  item: ChecklistItem;
  onToggle: (itemId: string, currentDone: boolean) => void;
  onEdit: (item: ChecklistItem) => void;
  onDelete: (itemId: string) => void;
}

export const DraggableChecklistItem = ({
  item,
  onToggle,
  onEdit,
  onDelete,
}: DraggableChecklistItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        className={`p-4 transition-all relative ${item.done ? "opacity-60" : ""}`}
      >
        {/* Controls */}
        <div
          className={`absolute top-4 right-4 flex gap-1 transition-opacity ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(item)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => onDelete(item.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-start gap-3 pr-32">
          <Checkbox
            id={item.id}
            checked={item.done}
            onCheckedChange={() => onToggle(item.id, item.done)}
          />
          <div className="flex-1">
            <label
              htmlFor={item.id}
              className={`font-medium cursor-pointer ${
                item.done ? "line-through" : ""
              }`}
            >
              {item.title}
            </label>
            <div className="text-sm text-muted-foreground mt-1">
              Assigned to: {item.assignee_role}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
