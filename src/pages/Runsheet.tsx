// @ts-nocheck
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Clock, ChevronRight } from "lucide-react";
import { supabaseLite as supabase } from "@/integrations/supabase/lite";
import { toast } from "sonner";
import { format, addMinutes, isPast, isWithinInterval } from "date-fns";

interface Block {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  location: string;
  notes: string;
}

const Runsheet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    loadBlocks();
    const interval = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
    return () => clearInterval(interval);
  }, [id]);

  const loadBlocks = async () => {
    try {
      const { data, error } = await supabase
        .from("itinerary_blocks")
        .select("*")
        .eq("trip_id", id)
        .order("start_time");

      if (error) throw error;
      setBlocks(data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error loading blocks:", error);
      toast.error("Failed to load run sheet");
      setLoading(false);
    }
  };

  const shiftBlock = async (blockId: string, minutes: number) => {
    try {
      const block = blocks.find(b => b.id === blockId);
      if (!block) return;

      const newStartTime = addMinutes(new Date(block.start_time), minutes);
      const newEndTime = addMinutes(new Date(block.end_time), minutes);

      const { error } = await supabase
        .from("itinerary_blocks")
        .update({
          start_time: newStartTime.toISOString(),
          end_time: newEndTime.toISOString()
        })
        .eq("id", blockId);

      if (error) throw error;

      await supabase.from("analytics_events").insert([{
        event_name: "block_shifted",
        trip_id: id,
        properties: { block_id: blockId, minutes }
      }]);

      toast.success(`Shifted by ${minutes > 0 ? '+' : ''}${minutes} minutes`);
      loadBlocks();
    } catch (error) {
      console.error("Error shifting block:", error);
      toast.error("Failed to shift block");
    }
  };

  const getBlockStatus = (block: Block) => {
    const start = new Date(block.start_time);
    const end = new Date(block.end_time);

    if (isPast(end)) return "completed";
    if (isWithinInterval(currentTime, { start, end })) return "current";
    return "upcoming";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const currentBlock = blocks.find(b => getBlockStatus(b) === "current");
  const nextBlock = blocks.find(b => getBlockStatus(b) === "upcoming");

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

        <h1 className="text-4xl font-bold mb-8">Run Sheet</h1>

        {/* Now & Next */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6" style={{ background: "var(--gradient-hero)" }}>
            <div className="text-sm font-semibold text-accent mb-2">NOW</div>
            {currentBlock ? (
              <>
                <h3 className="text-2xl font-bold mb-2">{currentBlock.title}</h3>
                <p className="text-muted-foreground mb-4">
                  {format(new Date(currentBlock.start_time), "h:mm a")} - {format(new Date(currentBlock.end_time), "h:mm a")}
                </p>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => shiftBlock(currentBlock.id, 15)}>
                    +15 min
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => shiftBlock(currentBlock.id, -15)}>
                    -15 min
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">No current activity</p>
            )}
          </Card>

          <Card className="p-6">
            <div className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
              NEXT <ChevronRight className="w-4 h-4" />
            </div>
            {nextBlock ? (
              <>
                <h3 className="text-xl font-bold mb-2">{nextBlock.title}</h3>
                <p className="text-muted-foreground">
                  {format(new Date(nextBlock.start_time), "h:mm a")}
                </p>
              </>
            ) : (
              <p className="text-muted-foreground">No upcoming activity</p>
            )}
          </Card>
        </div>

        {/* All Blocks */}
        <div className="space-y-3">
          {blocks.map((block) => {
            const status = getBlockStatus(block);
            return (
              <Card
                key={block.id}
                className={`p-4 ${status === "completed" ? "opacity-50" : ""} ${
                  status === "current" ? "border-2 border-accent" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={status === "current" ? "default" : "outline"}>
                        {status}
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(block.start_time), "h:mm a")}
                      </div>
                    </div>
                    <h3 className="font-bold">{block.title}</h3>
                    {block.location && (
                      <p className="text-sm text-muted-foreground">📍 {block.location}</p>
                    )}
                  </div>
                  {status !== "completed" && (
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => shiftBlock(block.id, 15)}>
                        +15
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => shiftBlock(block.id, -15)}>
                        -15
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Runsheet;
