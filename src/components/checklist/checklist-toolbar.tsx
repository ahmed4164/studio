'use client';

import { Plus, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import type { Checklist } from '@/app/types';

interface ChecklistToolbarProps {
  onNewChecklist: () => void;
  history: Checklist[][];
  currentVersionIndex: number;
  onVersionChange: (index: number) => void;
}

export function ChecklistToolbar({
  onNewChecklist,
  history,
  currentVersionIndex,
  onVersionChange,
}: ChecklistToolbarProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-3xl font-bold tracking-tight font-headline">Your Checklists</h2>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <History className="mr-2 h-4 w-4" />
              Version {currentVersionIndex + 1}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Checklist History</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {history.map((_, index) => (
              <DropdownMenuItem
                key={index}
                onSelect={() => onVersionChange(index)}
                disabled={index === currentVersionIndex}
              >
                Version {index + 1} ({new Date(history[index][0]?.createdAt ?? Date.now()).toLocaleDateString()})
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button onClick={onNewChecklist}>
          <Plus className="mr-2 h-4 w-4" />
          New Checklist
        </Button>
      </div>
    </div>
  );
}
