import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Destination, Attraction, TripVibe, BudgetLevel } from '@/types';

interface TripState {
  selectedDestination: Destination | null;
  selectedAttractions: Attraction[];
  tripVibe: TripVibe | null;
  budgetLevel: BudgetLevel | null;
  setDestination: (destination: Destination) => void;
  setAttractions: (attractions: Attraction[]) => void;
  setVibe: (vibe: TripVibe) => void;
  setBudget: (budget: BudgetLevel) => void;
  clearSelection: () => void;
}

export const useTripStore = create<TripState>()(
  persist(
    (set) => ({
      selectedDestination: null,
      selectedAttractions: [],
      tripVibe: null,
      budgetLevel: null,
      setDestination: (destination) => set({ selectedDestination: destination }),
      setAttractions: (attractions) => set({ selectedAttractions: attractions }),
      setVibe: (vibe) => set({ tripVibe: vibe }),
      setBudget: (budget) => set({ budgetLevel: budget }),
      clearSelection: () => set({ 
        selectedDestination: null, 
        selectedAttractions: [], 
        tripVibe: null,
        budgetLevel: null 
      }),
    }),
    {
      name: 'trip-storage',
    }
  )
);
