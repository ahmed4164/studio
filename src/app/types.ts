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
}

export type Platform = 'ios' | 'android' | 'general';

export interface ChecklistVersion {
  id: string; // Firestore document ID
  version: number;
  platform: Platform;
  appVersion: string;
  createdAt: string;
  checklists: Checklist[];
}
