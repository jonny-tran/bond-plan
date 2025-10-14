export interface Attraction {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  lat: number;
  lng: number;
}

export interface Destination {
  id: string;
  city: string;
  imageUrl: string;
  attractions: Attraction[];
}

export interface BudgetLevel {
  key: "low" | "medium" | "high";
  label: string;
  description: string;
}

export type TripVibe = "Relaxed & Chill" | "Active & Adventurous" | "Balanced";

export interface Brief {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  participantCount: number;
  budgetLevel: BudgetLevel;
  goalTags: string[];
  destinationCity: Destination;
  selectedAttractions: Attraction[];
  vibe: TripVibe;
}

export interface ItineraryBlock {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  location: string;
  notes: string;
  activity_id?: string;
  lat?: number;
  lng?: number;
}
