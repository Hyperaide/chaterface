'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { init, id, i } from '@instantdb/react';
import { Homepage } from '../components/Homepage';
import Pricing from '@/components/Pricing';
import Cookies from 'js-cookie';

const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID || '';

const db = init({ appId: APP_ID });

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_NAME = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_NAME || '';

interface AuthContextType {
  user: any | null; // Consider defining a more specific user type
  profile: any | null;
  isLoading: boolean;
  error: Error | null;
  db: any;
  sessionId: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoading, user, error } = db.useAuth();
  const [profile, setProfile] = useState<any | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const ensureProfile = async () => {
      if (user) {
        const profile = await db.queryOnce({
          userProfiles: {
            $: {
              where: {
                'user.id': user.id
              }
            }
          }
        }).then((data) => {
          return data.data.userProfiles[0];
        })

        if (!profile) {
          const profileId = id()
          await db.transact(db.tx.userProfiles[profileId].update({
            credits: 200
          }).link({user: user?.id}))
        }
      }else{
        // Check if a session ID cookie exists
        let currentSessionId = Cookies.get('sessionId');
        if (!currentSessionId) {
          // If no cookie, generate a new session ID
          currentSessionId = id();
          // Set the cookie, expires in 7 days (adjust as needed)
          Cookies.set('sessionId', currentSessionId, { expires: 7 });
        }
        // Set the session ID in state
        setSessionId(currentSessionId);
      }
    };
    ensureProfile();
  }, [user]);


  const { data: profileData, isLoading: profileIsLoading, error: profileError } = db.useQuery({
    userProfiles: {
      $: {
        where: { 'user.id': user?.id ?? '' }
      }
    }
  })

  useEffect(() => {
    if (profileData) {
      setProfile(profileData.userProfiles[0])
    }
  }, [profileData])

  if (isLoading) {
    return <div>Loading authentication state...</div>;
  }
  if (error) {
    return <div>Authentication Error: {error.message}</div>;
  }

  // Render children if user is authenticated, otherwise render Homepage component
  return (
    // <AuthContext.Provider value={{ user, isLoading, error: error || null, profile: profile, db: db }}>
    //   {user ? children : <Homepage db={db} googleClientId={GOOGLE_CLIENT_ID} googleClientName={GOOGLE_CLIENT_NAME} />}
    // </AuthContext.Provider>
    <AuthContext.Provider value={{ user, isLoading, error: error || null, profile: profile, db: db, sessionId: sessionId }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  // Return the whole context for flexibility, including user, isLoading, error
  return context;
} 