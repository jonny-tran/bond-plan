import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin } from "lucide-react";
import { vietnamDestinations } from "@/data/vietnam-destinations";
import type { Destination, Attraction } from "@/data/types";

const DestinationSelect = () => {
  const navigate = useNavigate();
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
  const [showAttractions, setShowAttractions] = useState(false);
  const [selectedAttractionIds, setSelectedAttractionIds] = useState<string[]>([]);

  const handleDestinationClick = (destination: Destination) => {
    setSelectedDest(destination);
    setSelectedAttractionIds([]);
    setShowAttractions(true);
  };

  const toggleAttraction = (attractionId: string) => {
    setSelectedAttractionIds(prev =>
      prev.includes(attractionId)
        ? prev.filter(id => id !== attractionId)
        : [...prev, attractionId]
    );
  };

  const handleConfirm = () => {
    if (!selectedDest) return;
    
    // Store selections in localStorage for now
    const selected = selectedDest.attractions.filter(a => selectedAttractionIds.includes(a.id));
    localStorage.setItem('selectedDestination', JSON.stringify(selectedDest));
    localStorage.setItem('selectedAttractions', JSON.stringify(selected));
    
    navigate("/trip/new");
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Choose Your Destination</h1>
          <p className="text-xl text-muted-foreground">
            Select a city to explore attractions and start planning
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {vietnamDestinations.map((dest) => (
            <Card
              key={dest.id}
              className="cursor-pointer hover:scale-105 transition-all overflow-hidden"
              onClick={() => handleDestinationClick(dest)}
            >
              <img
                src={dest.imageUrl}
                alt={dest.city}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="font-bold text-lg">{dest.city}</h3>
                <p className="text-xs text-muted-foreground">
                  {dest.attractions.length} attractions
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {selectedDest && (
        <Dialog open={showAttractions} onOpenChange={setShowAttractions}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                Select Attractions in {selectedDest.city}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {selectedDest.attractions.map((attraction) => (
                <Card key={attraction.id} className="p-4 hover:shadow-lg transition-all">
                  <div className="flex gap-4">
                    <div className="flex items-start pt-1">
                      <Checkbox
                        id={attraction.id}
                        checked={selectedAttractionIds.includes(attraction.id)}
                        onCheckedChange={() => toggleAttraction(attraction.id)}
                      />
                    </div>
                    <div className="flex-1">
                      <img
                        src={attraction.imageUrl}
                        alt={attraction.name}
                        className="w-full h-32 object-cover rounded-lg mb-2"
                      />
                      <label htmlFor={attraction.id} className="text-lg font-semibold cursor-pointer">
                        {attraction.name}
                      </label>
                      <p className="text-sm text-muted-foreground mt-1">{attraction.description}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                        <MapPin className="w-3 h-3" />
                        <span>{attraction.lat.toFixed(3)}, {attraction.lng.toFixed(3)}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAttractions(false)}>Cancel</Button>
              <Button onClick={handleConfirm} disabled={selectedAttractionIds.length === 0}>
                Confirm {selectedAttractionIds.length > 0 && `(${selectedAttractionIds.length})`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DestinationSelect;
