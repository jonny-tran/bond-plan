import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ChecklistItem {
  id: string;
  title: string;
  done: boolean;
  assignee_role: string;
  due_date: string | null;
}

const Checklist = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ChecklistItem[]>([]);

  useEffect(() => {
    loadChecklist();
  }, [id]);

  const loadChecklist = async () => {
    try {
      const { data, error } = await supabase
        .from("checklist_items")
        .select("*")
        .eq("trip_id", id)
        .order("item_order");

      if (error) throw error;
      setItems(data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error loading checklist:", error);
      toast.error("Failed to load checklist");
      setLoading(false);
    }
  };

  const toggleItem = async (itemId: string, currentDone: boolean) => {
    try {
      const { error } = await supabase
        .from("checklist_items")
        .update({ done: !currentDone })
        .eq("id", itemId);

      if (error) throw error;

      setItems(prev =>
        prev.map(item =>
          item.id === itemId ? { ...item, done: !currentDone } : item
        )
      );
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Failed to update item");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const completedCount = items.filter(i => i.done).length;
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(`/trip/${id}/itinerary`)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Itinerary
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Checklist</h1>
          <p className="text-muted-foreground">
            {completedCount} of {items.length} completed ({Math.round(progress)}%)
          </p>
          <div className="w-full h-2 bg-muted rounded-full mt-2">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <Card
              key={item.id}
              className={`p-4 transition-all ${item.done ? "opacity-60" : ""}`}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  id={item.id}
                  checked={item.done}
                  onCheckedChange={() => toggleItem(item.id, item.done)}
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default Checklist;
