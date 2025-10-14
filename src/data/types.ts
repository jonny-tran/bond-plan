// Simple type definitions to avoid circular dependencies
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

export const budgetLevels: BudgetLevel[] = [
  {
    key: "low",
    label: "Economical",
    description: "Under $25/person/day"
  },
  {
    key: "medium",
    label: "Moderate",
    description: "$25-60/person/day"
  },
  {
    key: "high",
    label: "Premium",
    description: "Above $60/person/day"
  }
];
