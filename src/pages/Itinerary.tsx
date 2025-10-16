// @ts-nocheck
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Calendar, Users, Share2, Download, Clock, CheckSquare, MapPin } from "lucide-react";
import { supabaseLite as supabase } from "@/integrations/supabase/lite";
import { toast } from "sonner";
import { format, differenceInDays, addMinutes } from "date-fns";
import { ActivityLibrary } from "@/components/ActivityLibrary";
import { DraggableItineraryBlock } from "@/components/DraggableItineraryBlock";
import { useTripStore } from "@/store/tripStore";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
// PDF libs dynamically imported in handler

interface Trip {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  participant_count: number;
  budget_level: string;
  goal_tags: string[];
  status: string;
}

interface Activity {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  cost_level: string;
  tags: string[];
  is_signature: boolean;
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

const Itinerary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showActivities, setShowActivities] = useState(false);
  const [showMapDialog, setShowMapDialog] = useState(false);
  const [mapData, setMapData] = useState<{ lat: number; lng: number; title: string } | null>(null);
  const [editingBlock, setEditingBlock] = useState<BlockData | null>(null);
  const [deletingBlockId, setDeletingBlockId] = useState<string | null>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadTripData();
  }, [id]);

  const loadTripData = async () => {
    try {
      // Load trip
      const { data: tripData, error: tripError } = await supabase
        .from("trips")
        .select("*")
        .eq("id", id)
        .single();

      if (tripError) throw tripError;
      setTrip(tripData);

      // Load or generate itinerary blocks
      const { data: blocksData, error: blocksError } = await supabase
        .from("itinerary_blocks")
        .select(`
          *,
          activity:activity_id (*)
        `)
        .eq("trip_id", id)
        .order("start_time");

      if (blocksError) throw blocksError;

      if (blocksData.length === 0) {
        // Generate initial itinerary
        await generateItinerary(tripData);
      } else {
        setBlocks(blocksData as any);
      }

      // Load activities library
      const { data: activitiesData, error: activitiesError } = await supabase
        .from("activities")
        .select("*")
        .order("title");

      if (activitiesError) throw activitiesError;
      setActivities(activitiesData);

      // Track analytics
      await supabase.from("analytics_events").insert([{
        event_name: "itinerary_generated",
        trip_id: id,
        properties: { duration_ms: Date.now() }
      }]);

      setLoading(false);
    } catch (error) {
      console.error("Error loading trip:", error);
      toast.error("Failed to load trip");
      setLoading(false);
    }
  };

  const generateItinerary = async (tripData: Trip) => {
    try {
      const startDate = new Date(tripData.start_date);
      const days = differenceInDays(new Date(tripData.end_date), startDate) + 1;
      
      // Get relevant activities based on trip goals
      const { data: relevantActivities } = await supabase
        .from("activities")
        .select("*")
        .overlaps("tags", tripData.goal_tags)
        .limit(days * 3);

      const newBlocks: any[] = [];
      let currentTime = new Date(startDate);
      currentTime.setHours(9, 0, 0, 0); // Start at 9 AM

      // Generate blocks for each day
      for (let day = 0; day < days; day++) {
        // Morning energizer
        newBlocks.push({
          trip_id: tripData.id,
          title: "Morning Energizer",
          start_time: currentTime.toISOString(),
          end_time: addMinutes(currentTime, 30).toISOString(),
          location: "Meeting Point",
          notes: "Start the day with energy!",
          block_order: newBlocks.length
        });
        currentTime = addMinutes(currentTime, 30);

        // Main activities (3-4 per day)
        const dayActivities = relevantActivities?.slice(day * 3, (day + 1) * 3) || [];
        
        for (const activity of dayActivities) {
          newBlocks.push({
            trip_id: tripData.id,
            activity_id: activity.id,
            title: activity.title,
            start_time: currentTime.toISOString(),
            end_time: addMinutes(currentTime, activity.duration_minutes).toISOString(),
            location: "TBD",
            notes: activity.description,
            block_order: newBlocks.length
          });
          currentTime = addMinutes(currentTime, activity.duration_minutes + 15); // +15 min buffer
        }

        // Evening reflection
        newBlocks.push({
          trip_id: tripData.id,
          title: "Reflection & Dinner",
          start_time: currentTime.toISOString(),
          end_time: addMinutes(currentTime, 120).toISOString(),
          location: "Dining Area",
          notes: "Share highlights and enjoy dinner together",
          block_order: newBlocks.length
        });

        // Next day
        currentTime = new Date(startDate);
        currentTime.setDate(currentTime.getDate() + day + 1);
        currentTime.setHours(9, 0, 0, 0);
      }

      // Insert blocks
      const { data: insertedBlocks, error } = await supabase
        .from("itinerary_blocks")
        .insert(newBlocks)
        .select(`*, activity:activity_id (*)`);

      if (error) throw error;
      setBlocks(insertedBlocks as any);

      // Generate checklist
      await generateChecklist(tripData.id, insertedBlocks as any);

    } catch (error) {
      console.error("Error generating itinerary:", error);
      toast.error("Failed to generate itinerary");
    }
  };

  const generateChecklist = async (tripId: string, blocks: any[]) => {
    const checklistItems = [
      { title: "Send trip details to all participants", due_date: null, assignee_role: "Organizer", item_order: 0 },
      { title: "Book transportation", due_date: null, assignee_role: "Logistics Lead", item_order: 1 },
      { title: "Reserve activity slots", due_date: null, assignee_role: "Activity Coordinator", item_order: 2 },
      { title: "Prepare participant list", due_date: null, assignee_role: "Organizer", item_order: 3 },
      { title: "Pack emergency supplies", due_date: null, assignee_role: "Safety Officer", item_order: 4 },
      { title: "Confirm all bookings 24h before", due_date: null, assignee_role: "Organizer", item_order: 5 },
    ];

    // Add activity-specific items
    blocks.forEach((block, index) => {
      if (block.activity) {
        checklistItems.push({
          title: `Prepare materials for ${block.activity.title}`,
          due_date: block.start_time,
          assignee_role: "Activity Coordinator",
          item_order: checklistItems.length
        });
      }
    });

    await supabase.from("checklist_items").insert(
      checklistItems.map(item => ({ ...item, trip_id: tripId }))
    );
  };

  const handleShare = () => {
    if (trip) {
      const shareUrl = `${window.location.origin}/share/${trip.id}`;
      navigator.clipboard.writeText(shareUrl);
      toast.success("Share link copied to clipboard!");
    }
  };

  const handleExportPdf = async () => {
    const element = exportRef.current;
    if (!element) return;

    try {
      toast.info("Generating PDF...");
      const { default: html2canvas } = await import('html2canvas');
      const { default: jsPDF } = await import('jspdf');
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${trip?.title || 'itinerary'}.pdf`);
      
      await supabase.from("analytics_events").insert([{
        event_name: "pdf_exported",
        trip_id: id,
      }]);
      
      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF");
    }
  };

  // Zustand store actions
  const { addActivityToItinerary, updateBlock, deleteBlock, reorderBlocks } = useTripStore();

  const handleAddActivity = async (activity: Activity) => {
    if (!trip) return;

    const lastBlock = blocks.length > 0 ? blocks[blocks.length - 1] : null;

    addActivityToItinerary(activity, trip.id, lastBlock as any, async (newBlock, newChecklistItems) => {
      try {
        // Insert the new itinerary block
        const { data: insertedBlock, error: blockError } = await supabase
          .from('itinerary_blocks')
          .insert([newBlock])
          .select(`*, activity:activity_id (*)`)
          .single();

        if (blockError) throw blockError;

        // Insert checklist items
        const { error: checklistError } = await supabase
          .from('checklist_items')
          .insert(newChecklistItems);

        if (checklistError) throw checklistError;

        // Update local state with sorted blocks
        const updatedBlocks = [...blocks, insertedBlock as any].sort(
          (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        );
        setBlocks(updatedBlocks);

        toast.success(`Added "${activity.title}" to itinerary with ${newChecklistItems.length} checklist item(s)`);

        // Track analytics
        await supabase.from('analytics_events').insert([{
          event_name: 'activity_added',
          trip_id: trip.id,
          properties: { activity_id: activity.id, activity_title: activity.title }
        }]);
      } catch (error) {
        console.error('Error adding activity:', error);
        toast.error('Failed to add activity');
      }
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    reorderBlocks(blocks as any, active.id as string, over.id as string, async (reorderedBlocks) => {
      try {
        // Update all blocks in database with new order and times
        const updates = reorderedBlocks.map((block, index) => ({
          id: block.id,
          start_time: block.start_time,
          end_time: block.end_time,
          block_order: index,
        }));

        for (const update of updates) {
          await supabase
            .from('itinerary_blocks')
            .update({
              start_time: update.start_time,
              end_time: update.end_time,
              block_order: update.block_order,
            })
            .eq('id', update.id);
        }

        // Update local state
        const updatedBlocks = await supabase
          .from('itinerary_blocks')
          .select(`*, activity:activity_id (*)`)
          .eq('trip_id', id)
          .order('block_order');

        if (updatedBlocks.data) {
          setBlocks(updatedBlocks.data as any);
        }

        toast.success('Itinerary reordered successfully');
      } catch (error) {
        console.error('Error reordering blocks:', error);
        toast.error('Failed to reorder itinerary');
      }
    });
  };

  const handleEditBlock = (block: BlockData) => {
    setEditingBlock(block);
  };

  const handleSaveEdit = async () => {
    if (!editingBlock) return;

    updateBlock(editingBlock.id, editingBlock as any, async (updatedBlock) => {
      try {
        const { error } = await supabase
          .from('itinerary_blocks')
          .update({
            title: editingBlock.title,
            notes: editingBlock.notes,
            location: editingBlock.location,
          })
          .eq('id', editingBlock.id);

        if (error) throw error;

        // Reload data
        const { data: blocksData } = await supabase
          .from('itinerary_blocks')
          .select(`*, activity:activity_id (*)`)
          .eq('trip_id', id)
          .order('start_time');

        if (blocksData) {
          setBlocks(blocksData as any);
        }

        toast.success('Block updated successfully');
        setEditingBlock(null);
      } catch (error) {
        console.error('Error updating block:', error);
        toast.error('Failed to update block');
      }
    });
  };

  const handleDeleteBlock = async (blockId: string) => {
    deleteBlock(blockId, async () => {
      try {
        const { error } = await supabase
          .from('itinerary_blocks')
          .delete()
          .eq('id', blockId);

        if (error) throw error;

        setBlocks(blocks.filter(b => b.id !== blockId));
        toast.success('Block deleted successfully');
        setDeletingBlockId(null);
      } catch (error) {
        console.error('Error deleting block:', error);
        toast.error('Failed to delete block');
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

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Trip not found</h2>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{trip.title}</h1>
              <p className="text-muted-foreground text-lg">{trip.description}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportPdf}>
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                {format(new Date(trip.start_date), "MMM d")} - {format(new Date(trip.end_date), "MMM d, yyyy")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{trip.participant_count} participants</span>
            </div>
            <div className="flex gap-2">
              {trip.goal_tags.map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-8">
          <Button onClick={() => setShowActivities(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Activity
          </Button>
          <Button variant="outline" onClick={() => navigate(`/trip/${id}/checklist`)}>
            <CheckSquare className="w-4 h-4 mr-2" />
            View Checklist
          </Button>
          <Button variant="outline" onClick={() => navigate(`/trip/${id}/runsheet`)}>
            <Clock className="w-4 h-4 mr-2" />
            Run Sheet
          </Button>
        </div>

        {/* Timeline with Drag and Drop */}
        <div className="space-y-4" ref={exportRef}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
              {blocks.map((block) => (
                <DraggableItineraryBlock
                  key={block.id}
                  block={block}
                  onEdit={handleEditBlock}
                  onDelete={(blockId) => setDeletingBlockId(blockId)}
                  onViewMap={(lat, lng, title) => {
                    setMapData({ lat, lng, title });
                    setShowMapDialog(true);
                  }}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>

      {/* Activity Library Modal */}
      <ActivityLibrary
        open={showActivities}
        onOpenChange={setShowActivities}
        activities={activities}
        onAddActivity={handleAddActivity}
      />

      {/* Edit Block Dialog */}
      {editingBlock && (
        <Dialog open={!!editingBlock} onOpenChange={() => setEditingBlock(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Itinerary Block</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingBlock.title}
                  onChange={(e) => setEditingBlock({ ...editingBlock, title: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  value={editingBlock.location}
                  onChange={(e) => setEditingBlock({ ...editingBlock, location: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={editingBlock.notes}
                  onChange={(e) => setEditingBlock({ ...editingBlock, notes: e.target.value })}
                  className="mt-1"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingBlock(null)}>
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
      <AlertDialog open={!!deletingBlockId} onOpenChange={() => setDeletingBlockId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this itinerary block. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deletingBlockId && handleDeleteBlock(deletingBlockId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Map Dialog */}
      {mapData && (
        <Dialog open={showMapDialog} onOpenChange={setShowMapDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{mapData.title}</DialogTitle>
            </DialogHeader>
            <div className="w-full h-[450px]">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://maps.google.com/maps?q=${mapData.lat},${mapData.lng}&hl=en&z=14&output=embed`}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Itinerary;
