'use client';

import { useUser, useAuth, initiateAnonymousSignIn } from '@/firebase';
import { ChecklistContainer } from '@/components/checklist/checklist-container';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  const handleSignIn = () => {
    initiateAnonymousSignIn(auth);
  };

  if (isUserLoading) {
    return (
      <div className="flex flex-col h-full">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col h-full">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center p-8 bg-white rounded-lg shadow-md border">
            <h2 className="text-2xl font-bold mb-2">Welcome to ReadyCheck</h2>
            <p className="text-muted-foreground mb-6">
              Please sign in to manage your production readiness checklists.
            </p>
            <Button onClick={handleSignIn} size="lg" className="bg-accent hover:bg-accent/90">
              Sign In Anonymously
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <ChecklistContainer />
      </main>
    </div>
  );
}
