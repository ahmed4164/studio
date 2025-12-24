'use client';

import { useState } from 'react';
import { CheckCircle2, Circle, MessageSquarePlus, CornerDownRight, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChecklistItem as ChecklistItemType, CheckStatus } from '@/app/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface ChecklistItemProps {
  item: ChecklistItemType;
  onStatusChange: (status: CheckStatus) => void;
  onNotesChange: (notes: string) => void;
}

const statusIcons = {
  pass: <CheckCircle2 className="text-primary" />,
  fail: <XCircle className="text-destructive" />,
  pending: <Circle className="text-muted-foreground" />,
};

const statusTexts = {
  pass: 'Passed',
  fail: 'Failed',
  pending: 'Pending',
};

export function ChecklistItem({ item, onStatusChange, onNotesChange }: ChecklistItemProps) {
    const [notes, setNotes] = useState(item.notes || '');

    const handleNotesBlur = () => {
        onNotesChange(notes);
    };

  return (
    <Collapsible asChild>
      <li className={cn(
          "p-3 rounded-lg bg-card/60 hover:bg-card transition-colors group border",
          item.status === 'fail' && 'bg-destructive/10 border-destructive/30'
      )}>
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full flex-shrink-0">
                {statusIcons[item.status]}
                <span className="sr-only">Change status</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onStatusChange('pass')}>
                <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                <span>Pass</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange('fail')}>
                <XCircle className="mr-2 h-4 w-4 text-destructive" />
                <span>Fail</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange('pending')}>
                <Circle className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Set to Pending</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <span
            className={cn(
              'ml-3 flex-1 text-base font-medium transition-colors',
              item.status === 'pass' ? 'text-muted-foreground line-through' : 'text-foreground'
            )}
          >
            {item.text}
          </span>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
              <MessageSquarePlus className="h-5 w-5 text-muted-foreground" />
              <span className="sr-only">Add or View Notes</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="pl-11 pt-2 animate-in fade-in-0 zoom-in-95">
           <div className="flex items-start gap-2">
                <CornerDownRight className="h-4 w-4 mt-2.5 text-muted-foreground/80 shrink-0"/>
                <Textarea
                    placeholder="Add optional notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    onBlur={handleNotesBlur}
                    className="bg-white"
                />
            </div>
        </CollapsibleContent>
      </li>
    </Collapsible>
  );
}
