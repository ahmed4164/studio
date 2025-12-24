'use client';

import { useState } from 'react';
import type { Checklist, ChecklistVersion, Platform } from '@/app/types';
import { ChecklistCard } from './checklist-card';
import { AddChecklistDialog } from './add-checklist-dialog';
import { AddVersionDialog } from './add-version-dialog';
import { ChecklistToolbar } from './checklist-toolbar';

interface ChecklistContainerProps {
  initialChecklists: Checklist[];
}

export function ChecklistContainer({ initialChecklists }: ChecklistContainerProps) {
  const [history, setHistory] = useState<ChecklistVersion[]>([
    {
      version: 1,
      appVersion: '1.0.0',
      platform: 'general',
      createdAt: new Date().toISOString(),
      checklists: initialChecklists,
    },
  ]);
  const [currentVersionIndex, setCurrentVersionIndex] = useState(0);
  const [isAddChecklistDialogOpen, setAddChecklistDialogOpen] = useState(false);
  const [isAddVersionDialogOpen, setAddVersionDialogOpen] = useState(false);

  const currentVersion = history[currentVersionIndex];
  const checklists = currentVersion.checklists;

  const handleUpdateChecklist = (updatedChecklist: Checklist) => {
    const newHistory = [...history];
    const newChecklists = newHistory[currentVersionIndex].checklists.map(c =>
      c.id === updatedChecklist.id ? updatedChecklist : c
    );
    newHistory[currentVersionIndex] = {
      ...newHistory[currentVersionIndex],
      checklists: newChecklists,
    };
    setHistory(newHistory);
  };

  const handleAddChecklist = (title: string, items: string[]) => {
    const newChecklist: Checklist = {
      id: crypto.randomUUID(),
      title,
      items: items.map(itemText => ({
        id: crypto.randomUUID(),
        text: itemText,
        status: 'pending',
      })),
    };

    const newHistory = history.map(version => ({
      ...version,
      checklists: [...version.checklists, newChecklist],
    }));

    setHistory(newHistory);
    setAddChecklistDialogOpen(false);
  };

  const handleAddVersion = (appVersion: string, platform: Platform) => {
    const latestVersion = history[history.length - 1];
    const newChecklists = latestVersion.checklists.map(checklist => ({
      ...checklist,
      items: checklist.items.map(item => ({ ...item, status: 'pending' as const, notes: '' })),
    }));

    const newVersion: ChecklistVersion = {
      version: history.length + 1,
      appVersion,
      platform,
      createdAt: new Date().toISOString(),
      checklists: newChecklists,
    };

    const newHistory = [...history, newVersion];
    setHistory(newHistory);
    setCurrentVersionIndex(newHistory.length - 1);
    setAddVersionDialogOpen(false);
  };

  const handleVersionChange = (index: number) => {
    setCurrentVersionIndex(index);
  };

  return (
    <div className="container mx-auto">
      <ChecklistToolbar
        onNewChecklist={() => setAddChecklistDialogOpen(true)}
        onNewVersion={() => setAddVersionDialogOpen(true)}
        history={history}
        currentVersionIndex={currentVersionIndex}
        onVersionChange={handleVersionChange}
      />

      {checklists.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
          {checklists.map(checklist => (
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
        open={isAddChecklistDialogOpen}
        onOpenChange={setAddChecklistDialogOpen}
        onAddChecklist={handleAddChecklist}
      />
      <AddVersionDialog
        open={isAddVersionDialogOpen}
        onOpenChange={setAddVersionDialogOpen}
        onAddVersion={handleAddVersion}
      />
    </div>
  );
}
