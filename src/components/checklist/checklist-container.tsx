'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Checklist, ChecklistVersion, Platform } from '@/app/types';
import { ChecklistCard } from './checklist-card';
import { AddChecklistDialog } from './add-checklist-dialog';
import { AddVersionDialog } from './add-version-dialog';
import { ChecklistToolbar } from './checklist-toolbar';
import {
  useFirestore,
  useUser,
  useCollection,
  useMemoFirebase,
  addDocumentNonBlocking,
  setDocumentNonBlocking,
} from '@/firebase';
import { collection, doc, orderBy, query } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { initialChecklists } from '@/lib/data';

export function ChecklistContainer() {
  const { user } = useUser();
  const firestore = useFirestore();

  const versionsCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'users/personal/versions');
  }, [firestore]);

  const versionsQuery = useMemoFirebase(() => {
    if (!versionsCollectionRef) return null;
    return query(versionsCollectionRef, orderBy('version', 'desc'));
  }, [versionsCollectionRef]);

  const { data: history, isLoading: isLoadingHistory } = useCollection<ChecklistVersion>(versionsQuery);

  const [currentVersionId, setCurrentVersionId] = useState<string | null>(null);
  const [isAddChecklistDialogOpen, setAddChecklistDialogOpen] = useState(false);
  const [isAddVersionDialogOpen, setAddVersionDialogOpen] = useState(false);
  
  // Seeding logic for global data
  useEffect(() => {
    if (!isLoadingHistory && history !== null && history.length === 0 && firestore && versionsCollectionRef) {
      const seedInitialData = async () => {
         try {
             // Create initial version based on static data
             const newVersion: Omit<ChecklistVersion, 'id'> = {
                version: 1,
                appVersion: '1.0.0', 
                platform: 'general' as const, 
                createdAt: new Date().toISOString(),
                checklists: initialChecklists,
             };
             // Use addDocumentNonBlocking to create it
             await addDocumentNonBlocking(versionsCollectionRef, newVersion);
             console.log("Seeded initial global data");
         } catch (e) {
             console.error("Failed to seed global data", e);
         }
      };
      seedInitialData();
    }
  }, [isLoadingHistory, history, firestore, versionsCollectionRef]);
  
  const currentVersion = useMemo(() => {
    if (!history) return null;
    if (currentVersionId) {
      return history.find(v => v.id === currentVersionId) ?? history[0];
    }
    return history[0];
  }, [history, currentVersionId]);

  const checklists = currentVersion?.checklists || [];

  const handleUpdateChecklist = (updatedChecklist: Checklist) => {
    if (!currentVersion || !firestore) return;

    const newChecklists = currentVersion.checklists.map(c =>
      c.id === updatedChecklist.id ? updatedChecklist : c
    );

    const updatedVersion: Partial<ChecklistVersion> = {
      checklists: newChecklists,
    };
    
    // Use shared public path
    const versionDocRef = doc(firestore, `users/personal/versions/${currentVersion.id}`);
    setDocumentNonBlocking(versionDocRef, updatedVersion, { merge: true });
  };

  const handleAddChecklist = (title: string, items: string[]) => {
    if (!firestore || !history) return;
    
    const newChecklist: Checklist = {
      id: crypto.randomUUID(),
      title,
      items: items.map(itemText => ({
        id: crypto.randomUUID(),
        text: itemText,
        status: 'pending',
      })),
    };

    history.forEach(version => {
      const updatedChecklists = [...version.checklists, newChecklist];
      // Use shared public path
      const versionDocRef = doc(firestore, `users/personal/versions/${version.id}`);
      setDocumentNonBlocking(versionDocRef, { checklists: updatedChecklists }, { merge: true });
    });

    setAddChecklistDialogOpen(false);
  };

  const handleAddVersion = (appVersion: string, platform: Platform) => {
    if (!versionsCollectionRef) return;
    
    const latestVersionNumber = history && history.length > 0 ? history[0].version : 0;
    const baseChecklists = history && history.length > 0 ? history[0].checklists : initialChecklists;

    const newChecklists = baseChecklists.map(checklist => ({
      ...checklist,
      items: checklist.items.map(item => ({ ...item, status: 'pending' as const, notes: '' })),
    }));

    const newVersion: Omit<ChecklistVersion, 'id'> = {
      version: latestVersionNumber + 1,
      appVersion,
      platform,
      createdAt: new Date().toISOString(),
      checklists: newChecklists,
    };

    addDocumentNonBlocking(versionsCollectionRef, newVersion);
    setAddVersionDialogOpen(false);
  };

  const handleVersionChange = (versionId: string) => {
    setCurrentVersionId(versionId);
  };
  
  const handleDeleteChecklist = (checklistId: string) => {
    if (!currentVersion || !firestore) return;

    const newChecklists = currentVersion.checklists.filter(c => c.id !== checklistId);

    const updatedVersion: Partial<ChecklistVersion> = {
      checklists: newChecklists,
    };
    
    // Use shared public path
    const versionDocRef = doc(firestore, `users/personal/versions/${currentVersion.id}`);
    setDocumentNonBlocking(versionDocRef, updatedVersion, { merge: true });
  };

  if (isLoadingHistory) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <ChecklistToolbar
        onNewChecklist={() => setAddChecklistDialogOpen(true)}
        onNewVersion={() => setAddVersionDialogOpen(true)}
        history={history ?? []}
        currentVersionId={currentVersion?.id ?? null}
        onVersionChange={handleVersionChange}
      />

      {checklists.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
          {checklists.map(checklist => (
            <ChecklistCard
              key={checklist.id}
              checklist={checklist}
              onUpdate={handleUpdateChecklist}
              onDelete={handleDeleteChecklist}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-16 rounded-lg bg-card border">
          <h3 className="text-xl font-semibold">No checklists yet!</h3>
          <p className="mt-2">Welcome! Initializing shared data...</p>
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
