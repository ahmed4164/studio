'use client';

import { useState } from 'react';
import type { Checklist } from '@/app/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChecklistItem } from './checklist-item';
import { ChecklistProgress } from './checklist-progress';

type FilterStatus = 'all' | 'completed' | 'incomplete';

interface ChecklistCardProps {
  checklist: Checklist;
  onUpdate: (checklist: Checklist) => void;
}

export function ChecklistCard({ checklist, onUpdate }: ChecklistCardProps) {
  const [filter, setFilter] = useState<FilterStatus>('all');

  const handleItemToggle = (itemId: string) => {
    const newItems = checklist.items.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    onUpdate({ ...checklist, items: newItems });
  };

  const handleNotesChange = (itemId: string, notes: string) => {
    const newItems = checklist.items.map((item) =>
      item.id === itemId ? { ...item, notes: notes } : item
    );
    onUpdate({ ...checklist, items: newItems });
  };

  const filteredItems = checklist.items.filter((item) => {
    if (filter === 'completed') return item.completed;
    if (filter === 'incomplete') return !item.completed;
    return true;
  });

  return (
    <Card className="flex flex-col shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{checklist.title}</CardTitle>
        <ChecklistProgress items={checklist.items} />
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-4 border-b pb-4">
          <span className="text-sm font-medium text-muted-foreground">Filter:</span>
          <Button
            variant={filter === 'all' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'incomplete' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('incomplete')}
          >
            Pending
          </Button>
          <Button
            variant={filter === 'completed' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('completed')}
          >
            Completed
          </Button>
        </div>
        
        {filteredItems.length > 0 ? (
          <ul className="space-y-3 flex-1">
            {filteredItems.map((item) => (
              <ChecklistItem
                key={item.id}
                item={item}
                onToggle={() => handleItemToggle(item.id)}
                onNotesChange={(notes) => handleNotesChange(item.id, notes)}
              />
            ))}
          </ul>
        ) : (
          <div className="text-center text-muted-foreground py-8 flex-1 flex items-center justify-center rounded-lg bg-secondary/30">
            <p>No items match the current filter.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
