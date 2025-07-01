'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface ProviderKeys {
  openai: string | null;
  anthropic: string | null;
  google: string | null;
  xai: string | null;
}

interface KeyContextType {
  providerKeys: ProviderKeys;
  setProviderKey: (provider: keyof ProviderKeys, key: string) => void;
  clearProviderKey: (provider: keyof ProviderKeys) => void;
  getProviderKey: (model: string) => string | null;
}

const KeyContext = createContext<KeyContextType | undefined>(undefined);

const LOCAL_STORAGE_PREFIX = 'api_key_';

export function KeyProvider({ children }: { children: React.ReactNode }) {
  const [providerKeys, setProviderKeys] = useState<ProviderKeys>({
    openai: null,
    anthropic: null,
    google: null,
    xai: null
  });
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Load keys from localStorage on mount
    try {
      const savedKeys: ProviderKeys = {
        openai: localStorage.getItem(`${LOCAL_STORAGE_PREFIX}openai`),
        anthropic: localStorage.getItem(`${LOCAL_STORAGE_PREFIX}anthropic`),
        google: localStorage.getItem(`${LOCAL_STORAGE_PREFIX}google`),
        xai: localStorage.getItem(`${LOCAL_STORAGE_PREFIX}xai`)
      };
      setProviderKeys(savedKeys);
    } catch (error) {
      console.error('Error loading API keys from localStorage:', error);
    }
    setIsInitialized(true);
  }, []);

  const setProviderKey = (provider: keyof ProviderKeys, key: string) => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${provider}`, key);
      setProviderKeys(prev => ({
        ...prev,
        [provider]: key
      }));
    } catch (error) {
      console.error(`Error saving ${provider} API key to localStorage:`, error);
    }
  };

  const clearProviderKey = (provider: keyof ProviderKeys) => {
    try {
      localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}${provider}`);
      setProviderKeys(prev => ({
        ...prev,
        [provider]: null
      }));
    } catch (error) {
      console.error(`Error clearing ${provider} API key from localStorage:`, error);
    }
  };

  const getProviderKey = (model: string) => {
    const [provider, modelId] = model.split('/');
    return providerKeys[provider as keyof ProviderKeys] || null;
  }

  // Don't render children until we've checked localStorage
  if (!isInitialized) {
    return null;
  }

  return (
    <KeyContext.Provider value={{ providerKeys, setProviderKey, clearProviderKey, getProviderKey }}>
      {children}
    </KeyContext.Provider>
  );
}

export function useKey() {
  const context = useContext(KeyContext);
  if (context === undefined) {
    throw new Error('useKey must be used within a KeyProvider');
  }
  return context;
} 