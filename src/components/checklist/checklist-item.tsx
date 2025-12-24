'use client';

import { useState } from 'react';
import { CheckCircle2, Circle, MessageSquarePlus, CornerDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChecklistItem as ChecklistItemType } from '@/app/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ChecklistItemProps {
  item: ChecklistItemType;
  onToggle: () => void;
  onNotesChange: (notes: string) => void;
}

export function ChecklistItem({ item, onToggle, onNotesChange }: ChecklistItemProps) {
    const [notes, setNotes] = useState(item.notes || '');

    const handleNotesBlur = () => {
        onNotesChange(notes);
    };

  return (
    <Collapsible asChild>
      <li className="p-3 rounded-lg bg-card/60 hover:bg-card transition-colors group border">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full flex-shrink-0" onClick={onToggle}>
            {item.completed ? (
              <CheckCircle2 className="text-primary transition-transform duration-300 ease-in-out group-hover:scale-110" />
            ) : (
              <Circle className="text-muted-foreground transition-transform duration-300 ease-in-out group-hover:scale-110" />
            )}
            <span className="sr-only">Toggle item completion</span>
          </Button>
          <span
            className={cn(
              'ml-3 flex-1 text-base font-medium transition-colors cursor-pointer',
              item.completed ? 'text-muted-foreground line-through' : 'text-foreground'
            )}
            onClick={onToggle}
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
