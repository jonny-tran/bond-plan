// @ts-nocheck
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { supabaseLite as supabase } from "@/integrations/supabase/lite";
import { toast } from "sonner";
import { budgetLevels } from "@/data/types";

type TripVibe = "Relaxed & Chill" | "Active & Adventurous" | "Balanced";

const TripBrief = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    participantCount: "10",
    budgetLevel: "medium",
    vibe: "Balanced" as TripVibe,
    goalTags: [] as string[],
  });

  useEffect(() => {
    // Check if destination was selected
    const dest = localStorage.getItem('selectedDestination');
    if (!dest) {
      toast.error("Please select a destination first");
      navigate("/destinations");
    }
  }, [navigate]);

  const goalOptions = [
    "Team Building",
    "Adventure",
    "Learning",
    "Celebration",
    "Networking",
    "Wellness",
    "Cultural",
    "Sports"
  ];

  const toggleGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goalTags: prev.goalTags.includes(goal)
        ? prev.goalTags.filter(g => g !== goal)
        : [...prev.goalTags, goal]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.startDate || !formData.endDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    
    try {
      // Create anonymous user for demo
      const { data: userData, error: userError } = await supabase
        .from("users")
        .insert([{ 
          anon_uuid: crypto.randomUUID(),
          role: "organizer" 
        }])
        .select()
        .single();

      if (userError) throw userError;

      // Create trip
      const { data: tripData, error: tripError } = await supabase
        .from("trips")
        .insert([{
          creator_id: userData.id,
          title: formData.title,
          description: formData.description,
          start_date: formData.startDate.toISOString(),
          end_date: formData.endDate.toISOString(),
          participant_count: parseInt(formData.participantCount),
          budget_level: formData.budgetLevel,
          goal_tags: formData.goalTags,
          status: "draft"
        }])
        .select()
        .single();

      if (tripError) throw tripError;

      // Track analytics
      const dest = JSON.parse(localStorage.getItem('selectedDestination') || '{}');
      const attractions = JSON.parse(localStorage.getItem('selectedAttractions') || '[]');
      
      await supabase.from("analytics_events").insert([{
        event_name: "brief_submitted",
        trip_id: tripData.id,
        user_id: userData.id,
        properties: { 
          participant_count: formData.participantCount,
          budget_level: formData.budgetLevel,
          vibe: formData.vibe,
          goal_count: formData.goalTags.length,
          destination: dest?.city || 'unknown',
          attractions_count: attractions.length
        }
      }]);

      toast.success("Trip brief created! Generating itinerary...");
      navigate(`/trip/${tripData.id}/itinerary`);
    } catch (error) {
      console.error("Error creating trip:", error);
      toast.error("Failed to create trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Create Your Trip</h1>
          <p className="text-muted-foreground text-lg">
            Answer a few quick questions to get your personalized itinerary
          </p>
        </div>

        <Card className="p-8" style={{ background: "var(--gradient-card)" }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Trip Name *</Label>
              <Input
                id="title"
                placeholder="e.g., Spring Team Retreat 2025"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Brief Description</Label>
              <Textarea
                id="description"
                placeholder="What's the main purpose of this trip?"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            {/* Dates */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate ? format(formData.startDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.endDate ? format(formData.endDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
                      initialFocus
                      disabled={(date) => formData.startDate ? date < formData.startDate : false}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Participant Count, Budget, Vibe */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="participants">Number of Participants</Label>
                <Input
                  id="participants"
                  type="number"
                  min="2"
                  max="100"
                  value={formData.participantCount}
                  onChange={(e) => setFormData(prev => ({ ...prev, participantCount: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget Level</Label>
                <Select 
                  value={formData.budgetLevel} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, budgetLevel: value }))}
                >
                  <SelectTrigger id="budget">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetLevels.map(level => (
                      <SelectItem key={level.key} value={level.key}>
                        <div>
                          <div className="font-medium">{level.label}</div>
                          <div className="text-xs text-muted-foreground">{level.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vibe">Trip Vibe</Label>
                <Select 
                  value={formData.vibe} 
                  onValueChange={(value: TripVibe) => setFormData(prev => ({ ...prev, vibe: value }))}
                >
                  <SelectTrigger id="vibe">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Relaxed & Chill">Relaxed & Chill</SelectItem>
                    <SelectItem value="Active & Adventurous">Active & Adventurous</SelectItem>
                    <SelectItem value="Balanced">Balanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Goals */}
            <div className="space-y-2">
              <Label>Trip Goals (Select all that apply)</Label>
              <div className="flex flex-wrap gap-2">
                {goalOptions.map(goal => (
                  <Button
                    key={goal}
                    type="button"
                    variant={formData.goalTags.includes(goal) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleGoal(goal)}
                  >
                    {goal}
                  </Button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <Button 
                type="submit" 
                size="lg" 
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Your Trip...
                  </>
                ) : (
                  "Generate Itinerary"
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default TripBrief;
