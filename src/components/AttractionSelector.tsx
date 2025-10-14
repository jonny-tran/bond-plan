import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Destination, Attraction } from "@/types";
import { MapPin } from "lucide-react";

interface AttractionSelectorProps {
  destination: Destination;
  open: boolean;
  onClose: () => void;
  onConfirm: (attractions: Attraction[]) => void;
}

export const AttractionSelector = ({ destination, open, onClose, onConfirm }: AttractionSelectorProps) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleAttraction = (attractionId: string) => {
    setSelected(prev =>
      prev.includes(attractionId)
        ? prev.filter(id => id !== attractionId)
        : [...prev, attractionId]
    );
  };

  const handleConfirm = () => {
    const selectedAttractions = destination.attractions.filter(a => selected.includes(a.id));
    onConfirm(selectedAttractions);
    setSelected([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Select Attractions in {destination.city}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {destination.attractions.map((attraction) => (
            <Card key={attraction.id} className="p-4 hover:shadow-lg transition-all">
              <div className="flex gap-4">
                <div className="flex items-start pt-1">
                  <Checkbox
                    id={attraction.id}
                    checked={selected.includes(attraction.id)}
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
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={selected.length === 0}>
            Confirm {selected.length > 0 && `(${selected.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
