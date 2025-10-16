import { create } from 'zustand';
import { activitySchema, blockUpdateSchema, checklistItemSchema } from '@/lib/validation';

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
  updateBlock: (
    blockId: string,
    updates: Partial<ItineraryBlock>,
    onSuccess: (updatedBlock: ItineraryBlock) => void
  ) => void;
  deleteBlock: (blockId: string, onSuccess: () => void) => void;
  reorderBlocks: (
    blocks: ItineraryBlock[],
    activeId: string,
    overId: string,
    onSuccess: (reorderedBlocks: ItineraryBlock[]) => void
  ) => void;
  updateChecklistItem: (
    itemId: string,
    updates: Partial<ChecklistItem>,
    onSuccess: (updatedItem: ChecklistItem) => void
  ) => void;
  deleteChecklistItem: (itemId: string, onSuccess: () => void) => void;
  reorderChecklist: (
    items: ChecklistItem[],
    activeId: string,
    overId: string,
    onSuccess: (reorderedItems: ChecklistItem[]) => void
  ) => void;
}

// Helper function to recalculate block times maintaining chronological order
const recalculateBlockTimes = (blocks: ItineraryBlock[]): ItineraryBlock[] => {
  if (blocks.length === 0) return blocks;
  
  return blocks.map((block, index) => {
    if (index === 0) {
      // Keep the first block's start time as anchor
      return block;
    }
    
    const prevBlock = blocks[index - 1];
    const newStartTime = new Date(new Date(prevBlock.end_time).getTime() + 15 * 60000); // 15 min buffer
    const duration = block.end_time && block.start_time 
      ? new Date(block.end_time).getTime() - new Date(block.start_time).getTime()
      : 60 * 60000; // Default 60 min if duration not set
    
    return {
      ...block,
      start_time: newStartTime.toISOString(),
      end_time: new Date(newStartTime.getTime() + duration).toISOString(),
    };
  });
};

// Helper function for array reordering
const arrayMove = <T,>(array: T[], from: number, to: number): T[] => {
  const newArray = array.slice();
  const [movedItem] = newArray.splice(from, 1);
  newArray.splice(to, 0, movedItem);
  return newArray;
};

export const useTripStore = create<TripStore>((set) => ({
  addActivityToItinerary: (activity, tripId, lastBlock, onSuccess) => {
    // Validate activity data
    try {
      activitySchema.parse(activity);
    } catch (error) {
      console.error("Invalid activity data:", error);
      return;
    }

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

  updateBlock: (blockId, updates, onSuccess) => {
    // Validate updates
    try {
      blockUpdateSchema.parse(updates);
    } catch (error) {
      console.error("Invalid block update data:", error);
      return;
    }
    
    const updatedBlock = { ...updates, id: blockId } as ItineraryBlock;
    onSuccess(updatedBlock);
  },

  deleteBlock: (blockId, onSuccess) => {
    onSuccess();
  },

  reorderBlocks: (blocks, activeId, overId, onSuccess) => {
    const oldIndex = blocks.findIndex(b => b.id === activeId);
    const newIndex = blocks.findIndex(b => b.id === overId);
    
    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
      return;
    }

    const reordered = arrayMove(blocks, oldIndex, newIndex);
    const recalculated = recalculateBlockTimes(reordered);
    
    onSuccess(recalculated);
  },

  updateChecklistItem: (itemId, updates, onSuccess) => {
    const updatedItem = { ...updates, id: itemId } as ChecklistItem;
    onSuccess(updatedItem);
  },

  deleteChecklistItem: (itemId, onSuccess) => {
    onSuccess();
  },

  reorderChecklist: (items, activeId, overId, onSuccess) => {
    const oldIndex = items.findIndex(c => c.id === activeId);
    const newIndex = items.findIndex(c => c.id === overId);
    
    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
      return;
    }

    const reordered = arrayMove(items, oldIndex, newIndex).map((item, index) => ({
      ...item,
      item_order: index,
    }));
    
    onSuccess(reordered);
  },
}));
