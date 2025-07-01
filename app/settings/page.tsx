"use client"
import Header from "@/components/Header";
import { providers } from "@/constants/models";
import { useKey } from "@/providers/key-provider";
import { Check, CheckCircle } from "@phosphor-icons/react";
import { useState, useEffect } from "react";


export default function SettingsPage() {
  return (
    <div className="flex flex-col h-dvh">
      <Header title="Settings">
        
      </Header>

    <div className="flex flex-col gap-2 p-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-base font-medium text-gray-11">API Keys</h1>
        <p className="text-xs text-gray-10">All your LLM provider api keys are stored locally and are never stored on our servers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
        {providers.map((provider) => (
          <Provider key={provider.id} provider={provider} />
        ))}
      </div>
    </div>
    </div>
  );
}

function Provider({provider}: {provider: any}) {
  const { providerKeys, setProviderKey, clearProviderKey } = useKey();
  const [apiKey, setApiKey] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  
  useEffect(() => {
    // Load the saved key when component mounts
    const savedKey = providerKeys[provider.id as keyof typeof providerKeys];
    if (savedKey) {
      setApiKey(savedKey);
      setIsSaved(true);
    }
  }, [providerKeys, provider.id]);

  const handleKeyChange = (value: string) => {
    setApiKey(value);
    setIsSaved(false);
  };

  const handleBlur = () => {
    // Save on blur
    if (apiKey.trim()) {
      setProviderKey(provider.id as keyof typeof providerKeys, apiKey.trim());
      setIsSaved(true);
    } else {
      // Clear the key if empty
      clearProviderKey(provider.id as keyof typeof providerKeys);
      setIsSaved(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };
  
  return (
    <div className={`flex flex-col gap-1 border rounded-md overflow-hidden transition-colors ${apiKey && apiKey.length > 10 ? "border-gray-5 dark:border-gray-4" : "border-gray-3 dark:border-gray-2"}`}>
      <div className="flex flex-col gap-1 p-2 ">
        <div className="flex flex-row gap-1 items-center justify-between">
          <h1 className="text-base font-medium text-gray-11">{provider.name}</h1>
          {apiKey && apiKey.length > 10 && isSaved && (
            <div className="flex flex-row gap-1 items-center transition-all">
              <CheckCircle size={16} weight="fill" className="text-green-8 dark:text-green-9" />
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-1">
          {provider.models.map((model: string) => (
            <div key={model} className="text-xs text-gray-10 px-2 py-1 bg-gray-3 dark:bg-gray-2 rounded-md">
              {model.split('/')[1]}
            </div>
          ))}
        </div>
      </div>
      <input 
        value={apiKey} 
        onChange={(e) => handleKeyChange(e.target.value)} 
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="bg-gray-2 mt-auto dark:bg-gray-2 m-2 rounded p-2 text-xs border border-gray-3 dark:border-gray-3 text-gray-10 dark:text-gray-11 focus:outline-none" 
        placeholder="Your API Key"
        type="password"
      />
    </div>
  );
}