import type { ChecklistItem } from '@/app/types';
import { Progress } from '@/components/ui/progress';

interface ChecklistProgressProps {
  items: ChecklistItem[];
}

export function ChecklistProgress({ items }: ChecklistProgressProps) {
  const completedItems = items.filter((item) => item.status === 'pass').length;
  const totalItems = items.length;
  const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <p className="text-sm font-medium text-muted-foreground">
          Overall Progress
        </p>
        <p className="text-sm font-semibold text-foreground">
          {completedItems} / {totalItems}
        </p>
      </div>
      <Progress value={progressPercentage} className="h-2" />
    </div>
  );
}
