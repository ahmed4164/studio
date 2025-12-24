export type CheckStatus = 'pending' | 'pass' | 'fail';

export interface ChecklistItem {
  id: string;
  text: string;
  status: CheckStatus;
  notes?: string;
}

export interface Checklist {
  id:string;
  title: string;
  items: ChecklistItem[];
  version?: number;
  createdAt?: string;
}
