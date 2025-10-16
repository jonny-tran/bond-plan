import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GripVertical, Pencil, Trash2, MapPin } from "lucide-react";
import { format } from "date-fns";

interface Activity {
  id: string;
  title: string;
  description: string | null;
  duration_minutes: number;
  cost_level: string | null;
  tags: string[] | null;
  is_signature: boolean | null;
}

interface BlockData {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  location: string;
  notes: string;
  activity_id?: string;
  activity?: Activity;
  lat?: number;
  lng?: number;
}

interface DraggableItineraryBlockProps {
  block: BlockData;
  onEdit: (block: BlockData) => void;
  onDelete: (blockId: string) => void;
  onViewMap?: (lat: number, lng: number, title: string) => void;
}

export const DraggableItineraryBlock = ({
  block,
  onEdit,
  onDelete,
  onViewMap,
}: DraggableItineraryBlockProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const durationMinutes = Math.floor(
    (new Date(block.end_time).getTime() - new Date(block.start_time).getTime()) / 60000
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      <Card
        className="p-6 hover:shadow-lg transition-all relative"
        style={{
          background: block.activity?.is_signature ? "var(--gradient-hero)" : "var(--gradient-card)",
          borderLeft: block.activity?.is_signature ? "4px solid hsl(var(--accent))" : undefined,
        }}
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
            onClick={() => onEdit(block)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => onDelete(block.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex-1 pr-32">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-sm font-semibold text-muted-foreground">
                {format(new Date(block.start_time), "h:mm a")} -{" "}
                {format(new Date(block.end_time), "h:mm a")}
              </div>
              {block.activity?.is_signature && (
                <Badge className="bg-accent">Signature Activity</Badge>
              )}
            </div>
            <h3 className="text-xl font-bold mb-2">{block.title}</h3>
            {block.notes && (
              <p className="text-muted-foreground mb-2">{block.notes}</p>
            )}
            {block.location && (
              <p className="text-sm text-muted-foreground">📍 {block.location}</p>
            )}
            {block.activity && (
              <div className="flex gap-2 mt-3">
                {block.activity.tags?.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{durationMinutes}min</div>
            {block.lat && block.lng && onViewMap && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewMap(block.lat!, block.lng!, block.title)}
                className="mt-2"
              >
                <MapPin className="w-4 h-4 mr-2" />
                View Map
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
