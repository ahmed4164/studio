export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  notes?: string;
}

export interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
}
