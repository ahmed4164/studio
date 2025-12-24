'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Checklist } from '@/app/types';
import { Button } from '@/components/ui/button';
import { ChecklistCard } from './checklist-card';
import { AddChecklistDialog } from './add-checklist-dialog';

interface ChecklistContainerProps {
  initialChecklists: Checklist[];
}

export function ChecklistContainer({ initialChecklists }: ChecklistContainerProps) {
  const [checklists, setChecklists] = useState<Checklist[]>(initialChecklists);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);

  const handleUpdateChecklist = (updatedChecklist: Checklist) => {
    setChecklists((prevChecklists) =>
      prevChecklists.map((c) => (c.id === updatedChecklist.id ? updatedChecklist : c))
    );
  };

  const handleAddChecklist = (title: string, items: string[]) => {
    const newChecklist: Checklist = {
      id: crypto.randomUUID(),
      title,
      items: items.map((itemText) => ({
        id: crypto.randomUUID(),
        text: itemText,
        status: 'pending',
      })),
    };
    setChecklists((prev) => [...prev, newChecklist]);
    setAddDialogOpen(false);
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Your Checklists</h2>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Checklist
        </Button>
      </div>

      {checklists.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
          {checklists.map((checklist) => (
            <ChecklistCard
              key={checklist.id}
              checklist={checklist}
              onUpdate={handleUpdateChecklist}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-16 rounded-lg bg-card border">
          <h3 className="text-xl font-semibold">No checklists yet!</h3>
          <p className="mt-2">Click "New Checklist" to create your first one.</p>
        </div>
      )}
      <AddChecklistDialog
        open={isAddDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAddChecklist={handleAddChecklist}
      />
    </div>
  );
}
