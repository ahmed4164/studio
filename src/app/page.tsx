'use client';

import { useEffect, useState } from 'react';
import { useAuth, initiateAnonymousSignIn } from '@/firebase';
import { ChecklistContainer } from '@/components/checklist/checklist-container';
import { Header } from '@/components/layout/header';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const auth = useAuth();
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Automatically sign in anonymously on load (seamless, no user interaction)
  useEffect(() => {
    if (auth) {
      // Sign in immediately if not already authenticated
      if (!auth.currentUser) {
        initiateAnonymousSignIn(auth);
      }
      
      // Listen for auth state changes
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (!user) {
          // If user becomes null, sign in again
          initiateAnonymousSignIn(auth);
        } else {
          // Auth is ready, we have a user (even if anonymous)
          setIsAuthReady(true);
        }
      });

      // If already authenticated, mark as ready
      if (auth.currentUser) {
        setIsAuthReady(true);
      }

      return () => unsubscribe();
    }
  }, [auth]);

  // Show loading while auth initializes (very brief, usually instant)
  if (!isAuthReady) {
    return (
      <div className="flex flex-col h-full">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
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