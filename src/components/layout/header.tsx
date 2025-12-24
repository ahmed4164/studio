import { CheckSquare } from 'lucide-react';

export function Header() {
  return (
    <header className="flex-shrink-0 border-b bg-card">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex h-16 items-center">
          <CheckSquare className="h-8 w-8 text-primary" />
          <h1 className="ml-3 text-2xl font-bold tracking-tight text-foreground font-headline">
            ReadyCheck
          </h1>
        </div>
      </div>
    </header>
  );
}
