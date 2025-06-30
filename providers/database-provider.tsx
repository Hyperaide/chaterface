'use client';

import { init } from "@instantdb/react";
import { createContext, useContext, useEffect, useState } from 'react';
import schema from "@/instant.schema";
import { useAuth } from "./auth-provider";

const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID as string;

const db = init({ appId: APP_ID, schema });

interface DatabaseContextType {
  db: typeof db;
  isInitialized: boolean;
  data: any;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const { sessionId } = useAuth();
  const { user } = useAuth();

  useEffect(() => {
    init({
      appId: APP_ID,
      schema: schema,
    });
    setIsInitialized(true);
  }, []);
  
  const { data } = db.useQuery({
    conversations: {
      $: {
        where: {
          or: [
            {
              'user.id': user ? user.id : undefined,

            },
            {
              sessionId: sessionId ?? '',
            }
          ]
        },
      },
      messages: {}
    },
    personas: {
      $: {
        where: {
          'user.id': user ? user.id : undefined,
        },
      },
    }
  }, {
    ruleParams: {
      sessionId: sessionId ?? ''
    }
  });

  return (
    <DatabaseContext.Provider value={{ db, isInitialized, data }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
} 