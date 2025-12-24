'use client';

import { useState } from 'react';
import type { Checklist } from '@/app/types';
import { ChecklistCard } from './checklist-card';
import { AddChecklistDialog } from './add-checklist-dialog';
import { ChecklistToolbar } from './checklist-toolbar';

interface ChecklistContainerProps {
  initialChecklists: Checklist[];
}

export function ChecklistContainer({ initialChecklists }: ChecklistContainerProps) {
  const [history, setHistory] = useState<Checklist[][]>([initialChecklists.map(c => ({...c, version: 1, createdAt: new Date().toISOString()}))]);
  const [currentVersionIndex, setCurrentVersionIndex] = useState(0);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);

  const checklists = history[currentVersionIndex];

  const createNewVersion = (updater: (prevChecklists: Checklist[]) => Checklist[]) => {
    setHistory(prevHistory => {
      const currentChecklists = prevHistory[prevHistory.length - 1];
      const newChecklists = updater(currentChecklists);
      const newVersion = prevHistory.length + 1;
      const newChecklistsWithVersion = newChecklists.map(c => 
        currentChecklists.find(oldC => oldC.id === c.id) ? c : {...c, version: newVersion, createdAt: new Date().toISOString()}
      );
      
      const updatedHistory = [...prevHistory.slice(0, prevHistory.length), newChecklistsWithVersion];
      setCurrentVersionIndex(updatedHistory.length - 1);
      return updatedHistory;
    });
  };

  const handleUpdateChecklist = (updatedChecklist: Checklist) => {
    createNewVersion(prevChecklists =>
      prevChecklists.map(c => (c.id === updatedChecklist.id ? updatedChecklist : c))
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
      version: history.length + 1,
      createdAt: new Date().toISOString(),
    };
    
    createNewVersion(prevChecklists => [...prevChecklists, newChecklist]);
    setAddDialogOpen(false);
  };

  const handleVersionChange = (index: number) => {
    setCurrentVersionIndex(index);
  };


  return (
    <div className="container mx-auto">
      <ChecklistToolbar
        onNewChecklist={() => setAddDialogOpen(true)}
        history={history}
        currentVersionIndex={currentVersionIndex}
        onVersionChange={handleVersionChange}
      />

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
