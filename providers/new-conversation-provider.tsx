'use client';

import { useState, useContext, useEffect } from "react";
import { createContext } from "react";
import { useDatabase } from "./database-provider";
import { id } from "@instantdb/react";
import { DateTime } from "luxon";

interface NewConversationContextType {
  newConversationMessage: string | null,
  newConversationId: string | null,
  setNewConversationMessage: (message: string) => void,
  setNewConversationId: (id: string) => void
}

const NewConversationContext = createContext<NewConversationContextType | undefined>(undefined);

export function NewConversationProvider({ children }: { children: React.ReactNode }) {
  const [newConversationMessage, setNewConversationMessage] = useState<string | null>(null);  
  const [newConversationId, setNewConversationId] = useState<string | null>(null);

  const {db} = useDatabase()

  return (
    <NewConversationContext.Provider value={{ newConversationMessage, newConversationId, setNewConversationMessage, setNewConversationId }}>
      {children}
    </NewConversationContext.Provider>
  );
}

export function useNewConversation() {
  const context = useContext(NewConversationContext);
  if (context === undefined) {
    throw new Error('useNewConversation must be used within a NewConversationProvider');
  }
  return context;
} 