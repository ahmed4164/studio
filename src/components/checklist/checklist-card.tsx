'use client';

import { useState } from 'react';
import type { Checklist, CheckStatus } from '@/app/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChecklistItem } from './checklist-item';
import { ChecklistProgress } from './checklist-progress';

type FilterStatus = 'all' | 'pending' | 'pass' | 'fail';

interface ChecklistCardProps {
  checklist: Checklist;
  onUpdate: (checklist: Checklist) => void;
}

export function ChecklistCard({ checklist, onUpdate }: ChecklistCardProps) {
  const [filter, setFilter] = useState<FilterStatus>('all');

  const handleItemStatusChange = (itemId: string, status: CheckStatus) => {
    const newItems = checklist.items.map((item) =>
      item.id === itemId ? { ...item, status } : item
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
    if (filter === 'all') return true;
    return item.status === filter;
  });

  return (
    <Card className="flex flex-col shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{checklist.title}</CardTitle>
        <ChecklistProgress items={checklist.items} />
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-4 border-b pb-4 flex-wrap">
          <span className="text-sm font-medium text-muted-foreground">Filter:</span>
          <Button
            variant={filter === 'all' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'pending' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('pending')}
          >
            Pending
          </Button>
          <Button
            variant={filter === 'pass' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('pass')}
            className="text-green-600 hover:bg-green-100 hover:text-green-700"
          >
            Passed
          </Button>
          <Button
            variant={filter === 'fail' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('fail')}
            className="text-red-600 hover:bg-red-100 hover:text-red-700"
          >
            Failed
          </Button>
        </div>
        
        {filteredItems.length > 0 ? (
          <ul className="space-y-3 flex-1">
            {filteredItems.map((item) => (
              <ChecklistItem
                key={item.id}
                item={item}
                onStatusChange={(status) => handleItemStatusChange(item.id, status)}
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
