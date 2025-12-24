import { ChecklistContainer } from '@/components/checklist/checklist-container';
import { Header } from '@/components/layout/header';
import { initialChecklists } from '@/lib/data';

export default function Home() {
  return (
    <div className="flex flex-col h-full">
      <Header />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <ChecklistContainer initialChecklists={initialChecklists} />
      </main>
    </div>
  );
}
