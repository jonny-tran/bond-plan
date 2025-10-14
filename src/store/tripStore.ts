import { create } from 'zustand';

interface Activity {
  id: string;
  title: string;
  description: string | null;
  duration_minutes: number;
  cost_level: string | null;
  tags: string[] | null;
  is_signature: boolean | null;
  category: string | null;
  props: any;
}

interface ItineraryBlock {
  id?: string;
  trip_id: string;
  activity_id?: string;
  title: string;
  start_time: string;
  end_time: string;
  location: string;
  notes: string;
  block_order: number;
}

interface ChecklistItem {
  id?: string;
  trip_id: string;
  title: string;
  due_date: string | null;
  assignee_role: string;
  is_completed?: boolean;
  item_order: number;
}

interface TripStore {
  // Actions
  addActivityToItinerary: (
    activity: Activity,
    tripId: string,
    lastBlock: ItineraryBlock | null,
    onSuccess: (newBlock: ItineraryBlock, newChecklistItems: ChecklistItem[]) => void
  ) => void;
}

export const useTripStore = create<TripStore>((set) => ({
  addActivityToItinerary: (activity, tripId, lastBlock, onSuccess) => {
    // Calculate start and end times
    const startTime = lastBlock
      ? new Date(new Date(lastBlock.end_time).getTime() + 15 * 60000) // 15 min after last block
      : new Date(Date.now() + 24 * 60 * 60 * 1000); // Tomorrow if no blocks

    const endTime = new Date(startTime.getTime() + activity.duration_minutes * 60000);

    // Create new block
    const newBlock: ItineraryBlock = {
      trip_id: tripId,
      activity_id: activity.id,
      title: activity.title,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      location: 'TBD',
      notes: activity.description || `Added from Activity Library`,
      block_order: lastBlock ? lastBlock.block_order + 1 : 0,
    };

    // Create checklist items
    const newChecklistItems: ChecklistItem[] = [];
    const baseOrder = 1000; // High number to add at end

    // Add material preparation item if activity has props
    if (activity.props && typeof activity.props === 'object') {
      const materials = activity.props.materials || activity.props.equipment;
      if (materials) {
        newChecklistItems.push({
          trip_id: tripId,
          title: `Prepare materials for "${activity.title}": ${Array.isArray(materials) ? materials.join(', ') : materials}`,
          due_date: startTime.toISOString(),
          assignee_role: 'Activity Coordinator',
          item_order: baseOrder + newChecklistItems.length,
        });
      }

      // Add safety notes if present
      const safety = activity.props.safety || activity.props.risk_notes;
      if (safety) {
        newChecklistItems.push({
          trip_id: tripId,
          title: `Review safety guidelines for "${activity.title}": ${safety}`,
          due_date: startTime.toISOString(),
          assignee_role: 'Safety Officer',
          item_order: baseOrder + newChecklistItems.length,
        });
      }
    }

    // Always add a preparation item
    if (newChecklistItems.length === 0) {
      newChecklistItems.push({
        trip_id: tripId,
        title: `Prepare for activity: ${activity.title}`,
        due_date: startTime.toISOString(),
        assignee_role: 'Activity Coordinator',
        item_order: baseOrder,
      });
    }

    // Call success callback with the data to be inserted
    onSuccess(newBlock, newChecklistItems);
  },
}));
