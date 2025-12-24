'use client';

import { Plus, History, GitBranchPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import type { ChecklistVersion } from '@/app/types';
import { Badge } from '../ui/badge';

interface ChecklistToolbarProps {
  onNewChecklist: () => void;
  onNewVersion: () => void;
  history: ChecklistVersion[];
  currentVersionId: string | null;
  onVersionChange: (id: string) => void;
}

export function ChecklistToolbar({
  onNewChecklist,
  onNewVersion,
  history,
  currentVersionId,
  onVersionChange,
}: ChecklistToolbarProps) {
  const currentVersion = history.find(v => v.id === currentVersionId) || history[0];

  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-3xl font-bold tracking-tight font-headline">Your Checklists</h2>
      <div className="flex items-center gap-2">
        {history.length > 0 && currentVersion && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <History className="mr-2 h-4 w-4" />
                <span>
                  Version {currentVersion.version}: {currentVersion.appVersion}
                </span>
                <Badge variant="secondary" className="ml-2 capitalize">{currentVersion.platform}</Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Checklist History</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {history.map((version) => (
                <DropdownMenuItem
                  key={version.id}
                  onSelect={() => onVersionChange(version.id)}
                  disabled={version.id === currentVersionId}
                >
                  <div className="flex justify-between w-full items-center">
                      <span>
                          Version {version.version}: {version.appVersion}
                      </span>
                      <Badge variant={version.id === currentVersionId ? "default" : "secondary"} className="capitalize">{version.platform}</Badge>
                  </div>

                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Button onClick={onNewVersion} variant="outline">
          <GitBranchPlus className="mr-2 h-4 w-4" />
          New Version
        </Button>

        <Button onClick={onNewChecklist}>
          <Plus className="mr-2 h-4 w-4" />
          New Checklist
        </Button>
      </div>
    </div>
  );
}
