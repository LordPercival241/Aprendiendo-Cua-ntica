'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

interface SupabaseContextType {
  supabase: SupabaseClient;
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signInWithGoogle: (redirectTo?: string) => Promise<void>;
  loginAsDemoStudent: (customEmail?: string) => void;
  signOut: () => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      try {
        // Check local demo session first
        if (typeof window !== 'undefined') {
          const savedDemoUser = localStorage.getItem('quantum_uni_demo_user');
          if (savedDemoUser) {
            const parsed = JSON.parse(savedDemoUser);
            if (mounted) {
              setUser(parsed);
              setIsLoading(false);
              return;
            }
          }
        }

        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
        }
      } catch (err) {
        console.warn('Supabase not yet configured or offline:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const loginAsDemoStudent = (customEmail = 'alumno.ciencias@uni.edu.pe') => {
    const demoUser = {
      id: 'demo-student-uni',
      app_metadata: {},
      user_metadata: { full_name: 'Estudiante FC-UNI' },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      email: customEmail,
    } as unknown as User;

    setUser(demoUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('quantum_uni_demo_user', JSON.stringify(demoUser));
    }
  };

  const signInWithGoogle = async (redirectTo?: string) => {
    try {
      const isPlaceholder = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder') || !process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (isPlaceholder) {
        // Automatically activate demo student mode with feedback
        loginAsDemoStudent();
        return;
      }

      const callbackUrl = redirectTo || (typeof window !== 'undefined' ? `${window.location.origin}/api/auth/callback` : '');
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
    } catch (err) {
      console.warn('OAuth signIn failed, falling back to demo student:', err);
      loginAsDemoStudent();
    }
  };

  const signOut = async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('quantum_uni_demo_user');
      }
      await supabase.auth.signOut();
    } catch {
      // ignore
    } finally {
      setUser(null);
      setSession(null);
    }
  };

  return (
    <SupabaseContext.Provider value={{ supabase, user, session, isLoading, signInWithGoogle, loginAsDemoStudent, signOut }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
}
