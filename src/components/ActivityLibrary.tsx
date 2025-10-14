import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Clock, DollarSign, X } from 'lucide-react';

interface Activity {
  id: string;
  title: string;
  description: string | null;
  duration_minutes: number;
  cost_level: string | null;
  tags: string[] | null;
  is_signature: boolean | null;
  category: string | null;
}

interface ActivityLibraryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activities: Activity[];
  onAddActivity: (activity: Activity) => void;
}

export const ActivityLibrary = ({ open, onOpenChange, activities, onAddActivity }: ActivityLibraryProps) => {
  const [goalFilter, setGoalFilter] = useState<string>('all');
  const [budgetFilter, setBudgetFilter] = useState<string>('all');

  // Get unique goals from all activities
  const availableGoals = useMemo(() => {
    const goalsSet = new Set<string>();
    activities.forEach(activity => {
      activity.tags?.forEach(tag => goalsSet.add(tag));
    });
    return Array.from(goalsSet).sort();
  }, [activities]);

  // Filter activities
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      // Goal filter
      if (goalFilter !== 'all') {
        if (!activity.tags?.includes(goalFilter)) {
          return false;
        }
      }

      // Budget filter
      if (budgetFilter !== 'all') {
        if (activity.cost_level !== budgetFilter) {
          return false;
        }
      }

      return true;
    });
  }, [activities, goalFilter, budgetFilter]);

  const handleAddActivity = (activity: Activity) => {
    onAddActivity(activity);
    onOpenChange(false);
  };

  const getCostBadgeVariant = (costLevel: string | null) => {
    switch (costLevel) {
      case 'low': return 'outline';
      case 'medium': return 'secondary';
      case 'high': return 'default';
      default: return 'outline';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">Activity Library</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Browse and add activities to your itinerary
          </p>
        </DialogHeader>

        {/* Filters */}
        <div className="flex gap-4 py-4 border-b">
          <div className="flex-1">
            <Select value={goalFilter} onValueChange={setGoalFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Goals</SelectItem>
                {availableGoals.map(goal => (
                  <SelectItem key={goal} value={goal}>{goal}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Select value={budgetFilter} onValueChange={setBudgetFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Budgets</SelectItem>
                <SelectItem value="low">Low ($)</SelectItem>
                <SelectItem value="medium">Medium ($$)</SelectItem>
                <SelectItem value="high">High ($$$)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Activity Grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {filteredActivities.length === 0 ? (
              <div className="col-span-2 text-center py-12 text-muted-foreground">
                No activities found matching your filters
              </div>
            ) : (
              filteredActivities.map(activity => (
                <Card
                  key={activity.id}
                  className="hover:shadow-lg transition-all"
                  style={{
                    background: activity.is_signature ? 'var(--gradient-hero)' : undefined,
                    borderLeft: activity.is_signature ? '4px solid hsl(var(--accent))' : undefined,
                  }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg">{activity.title}</CardTitle>
                      {activity.is_signature && (
                        <Badge className="bg-accent shrink-0">Signature</Badge>
                      )}
                    </div>
                    <CardDescription className="line-clamp-2">
                      {activity.description || 'No description available'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline" className="gap-1">
                        <Clock className="w-3 h-3" />
                        {activity.duration_minutes} min
                      </Badge>
                      {activity.cost_level && (
                        <Badge variant={getCostBadgeVariant(activity.cost_level)} className="gap-1">
                          <DollarSign className="w-3 h-3" />
                          {activity.cost_level}
                        </Badge>
                      )}
                      {activity.tags?.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      onClick={() => handleAddActivity(activity)}
                      className="w-full"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add to Itinerary
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Results count */}
        <div className="border-t pt-3 text-sm text-muted-foreground">
          Showing {filteredActivities.length} of {activities.length} activities
        </div>
      </DialogContent>
    </Dialog>
  );
};
