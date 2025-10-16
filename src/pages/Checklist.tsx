// @ts-nocheck
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft } from "lucide-react";
import { supabaseLite as supabase } from "@/integrations/supabase/lite";
import { toast } from "sonner";
import { DraggableChecklistItem } from "@/components/DraggableChecklistItem";
import { useTripStore } from "@/store/tripStore";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";

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
  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { updateChecklistItem, deleteChecklistItem, reorderChecklist } = useTripStore();

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    reorderChecklist(items, active.id as string, over.id as string, async (reorderedItems) => {
      try {
        // Update all items in database with new order
        for (const item of reorderedItems) {
          await supabase
            .from('checklist_items')
            .update({ item_order: item.item_order })
            .eq('id', item.id);
        }

        setItems(reorderedItems);
        toast.success('Checklist reordered successfully');
      } catch (error) {
        console.error('Error reordering checklist:', error);
        toast.error('Failed to reorder checklist');
      }
    });
  };

  const handleEditItem = (item: ChecklistItem) => {
    setEditingItem(item);
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    updateChecklistItem(editingItem.id, editingItem, async (updatedItem) => {
      try {
        const { error } = await supabase
          .from('checklist_items')
          .update({
            title: editingItem.title,
            assignee_role: editingItem.assignee_role,
          })
          .eq('id', editingItem.id);

        if (error) throw error;

        setItems(prev =>
          prev.map(item => (item.id === editingItem.id ? editingItem : item))
        );

        toast.success('Item updated successfully');
        setEditingItem(null);
      } catch (error) {
        console.error('Error updating item:', error);
        toast.error('Failed to update item');
      }
    });
  };

  const handleDeleteItem = async (itemId: string) => {
    deleteChecklistItem(itemId, async () => {
      try {
        const { error } = await supabase
          .from('checklist_items')
          .delete()
          .eq('id', itemId);

        if (error) throw error;

        setItems(items.filter(i => i.id !== itemId));
        toast.success('Item deleted successfully');
        setDeletingItemId(null);
      } catch (error) {
        console.error('Error deleting item:', error);
        toast.error('Failed to delete item');
      }
    });
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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
              {items.map((item) => (
                <DraggableChecklistItem
                  key={item.id}
                  item={item}
                  onToggle={toggleItem}
                  onEdit={handleEditItem}
                  onDelete={(itemId) => setDeletingItemId(itemId)}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>

      {/* Edit Item Dialog */}
      {editingItem && (
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Checklist Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="edit-title">Task</Label>
                <Input
                  id="edit-title"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="edit-assignee">Assigned to</Label>
                <Input
                  id="edit-assignee"
                  value={editingItem.assignee_role}
                  onChange={(e) => setEditingItem({ ...editingItem, assignee_role: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingItem(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingItemId} onOpenChange={() => setDeletingItemId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this checklist item. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deletingItemId && handleDeleteItem(deletingItemId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Checklist;
