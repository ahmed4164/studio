import type { Checklist } from '@/app/types';

export const initialChecklists: Checklist[] = [
  {
    id: 'cl-1',
    title: 'Frontend Deployment Readiness',
    items: [
      { id: 'item-1-1', text: 'All E2E tests passing', completed: true, notes: 'All tests are green on the staging branch.' },
      { id: 'item-1-2', text: 'Code reviewed and approved by 2 peers', completed: true },
      { id: 'item-1-3', text: 'Accessibility audit (WCAG 2.1 AA) complete', completed: false },
      { id: 'item-1-4', text: 'Performance budget checked (Lighthouse score > 90)', completed: true, notes: 'Current score is 94.' },
      { id: 'item-1-5', text: 'Bundle size analysis performed', completed: false },
      { id: 'item-1-6', text: 'Final QA sign-off received', completed: false },
    ],
  },
  {
    id: 'cl-2',
    title: 'Backend API Launch Checklist',
    items: [
      { id: 'item-2-1', text: 'API documentation generated and published', completed: true },
      { id: 'item-2-2', text: 'Load testing completed (1000 RPS)', completed: true, notes: 'Sustained 1000 RPS for 15 minutes with p99 < 200ms.' },
      { id: 'item-2-3', text: 'Security scan (SAST/DAST) clear of critical vulnerabilities', completed: true },
      { id: 'item-2-4', text: 'Database migration scripts peer-reviewed', completed: true },
      { id: 'item-2-5', text: 'Logging and monitoring dashboards configured', completed: false },
      { id: 'item-2-6', text: 'Rollback plan documented and tested', completed: false },
      { id: 'item-2-7', text: 'On-call rotation updated', completed: true },
    ],
  },
];
