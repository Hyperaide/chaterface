"use client";

import Button from "@/components/button";
import IntroductionModal from "@/components/IntroductionModal";
import Logo from "@/components/logo";
import ModelSelector from "@/components/ModelSelector";
import { models } from "@/constants/models";
import { DiamondsFour, Folder, Warning } from "@phosphor-icons/react";
import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useTheme } from "@/providers/theme-provider";
import Sidebar from "@/components/Sidebar";
import { useDatabase } from "@/providers/database-provider";
import { id } from "@instantdb/react";
import { create } from 'zustand'
import { useRouter } from "next/navigation";
import AnimatedMessageInput from "@/components/AnimatedMessageInput";
import Toolbar from "@/components/Toolbar";
import { useSidebarStore } from "@/components/Sidebar";
import { startBackgroundJob } from "@/lib/background-jobs";
import { useMessageStore } from "./utils/message-store";
import { motion } from "motion/react";
import { useKey } from "@/providers/key-provider";
import Link from "next/link";

export default function Page() {
  const { db } = useDatabase();
  const [selectedModel, setSelectedModel] = useState<string>(models[0].id);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, sessionId } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  const { sidebarOpen } = useSidebarStore();
  const { getProviderKey } = useKey();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [shouldHighlight, setShouldHighlight] = useState<boolean>(false);

  // Check if the selected model has an API key
  const hasApiKey = () => {
    const key = getProviderKey(selectedModel);
    return key && key.length > 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Check if API key is set
    if (!hasApiKey()) {
      // Trigger highlight animation
      setShouldHighlight(true);
      setTimeout(() => setShouldHighlight(false), 1000);
      return;
    }
    
    setIsLoading(true);
    setErrorMessage(null);
    const conversationId = id();
    await db.transact(db.tx.conversations[conversationId].update({
      name: "New Conversation",
      createdAt: new Date().toISOString(),
      sessionId: sessionId
    }));
    await startBackgroundJob(`${process.env.NEXT_PUBLIC_APP_URL}/api/name-conversation`, { conversationId, firstMessageContent: input });
    useMessageStore.setState({ message: input });
    router.push(`/conversations/${conversationId}`);
    setIsLoading(false);
  };

  return (
    <>
        {!sidebarOpen && (
          <Toolbar className="absolute top-4 left-4"/>
        )}


        <div className="flex flex-col gap-4 p-4 py-8 max-w-4xl mx-auto hidden">
          <div className="flex flex-col gap-1 p-6">
            {/* <p className="text-[11px] text-gray-11 font-mono">
              You
            </p> */}
            <p className="text-sm text-gray-11">
              Hello mate how are you
            </p>
          </div>

          <div className="relative flex flex-col gap-1 p-px bg-gray-3 dark:bg-gray-2 rounded w-max max-w-4xl">
            <div className="relative flex flex-col gap-1 bg-gray-1 p-6 rounded">
              <p className="z-10 absolute -top-2 left-4 text-[11px] text-gray-11 font-mono uppercase font-medium bg-gray-1 px-2 rounded-md">
                Claude 4 Opus
              </p>
              <p className="text-sm text-gray-12">
              Ex dolore qui nulla mollit culpa magna nostrud. Deserunt consequat sit elit reprehenderit. Culpa aute quis irure labore aliquip est dolore nostrud occaecat pariatur ullamco ea fugiat laborum elit. Nisi amet anim magna consectetur id enim velit laborum esse qui. Veniam velit magna enim sunt cillum do laborum. Cillum voluptate ad ut.
              </p>

              <p className="z-10 absolute -bottom-2 left-4 text-[11px] flex flex-row items-center gap-1 text-gray-11 font-mono uppercase font-medium bg-gray-1 px-2 rounded-md">
              <DiamondsFour size={12} className="text-teal-9" weight="fill" />
              25
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-1 p-6">
            {/* <p className="text-[11px] text-gray-11 font-mono">
              You
            </p> */}
            <p className="text-sm text-gray-11">
              Hello mate how are you
            </p>
          </div>

          <div className="relative flex flex-col gap-1 p-px bg-gray-3 dark:bg-gray-2 rounded w-max max-w-4xl">
            <div className="relative flex flex-col gap-1 bg-gray-1 p-6 rounded">
              <p className="z-10 absolute -top-2 left-4 text-[11px] text-gray-11 font-mono uppercase font-medium bg-gray-1 px-2 rounded-md">
                openai/gpt-4.1-nano
              </p>
              <p className="text-sm text-gray-12">
              Ex dolore qui nulla mollit culpa magna nostrud. Deserunt consequat sit elit reprehenderit. Culpa aute quis irure labore aliquip est dolore nostrud occaecat pariatur ullamco ea fugiat laborum elit. Nisi amet anim magna consectetur id enim velit laborum esse qui. Veniam velit magna enim sunt cillum do laborum. Cillum voluptate ad ut.
              </p>

              <p className="z-10 absolute -bottom-2 left-4 text-[11px] flex flex-row items-center gap-1 text-gray-11 font-mono uppercase font-medium bg-gray-1 px-2 rounded-md">
              <DiamondsFour size={12} className="text-teal-9" weight="fill" />
              25
              </p>
            </div>
          </div>
        </div>


          <div className="flex flex-col gap-4 p-4 py-8 max-w-4xl mx-auto justify-center items-center h-dvh transition-all duration-300">

            <motion.div 
              layout
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="relative flex flex-col gap-1 items-center text-center mb-4"
            >
              <p className="text-sm text-gray-11"> 
                What's on your mind?
              </p>
              <p className="text-xs text-gray-10">
              Send a message to start a new conversation.
              </p>
            </motion.div>

            {!hasApiKey() && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Link
                  href="/settings"
                  className={`flex items-center gap-2 p-2.5 bg-gray-2 dark:bg-gray-2 border border-gray-3 dark:border-gray-3 rounded-lg text-xs max-w-md transition-all duration-300 hover:bg-gray-3 dark:hover:bg-gray-3 cursor-pointer hover:border-gray-4 dark:hover:border-gray-4 ${
                    shouldHighlight ? 'animate-pulse border-red-6 dark:border-red-6 bg-red-3 dark:bg-red-3' : ''
                  }`}
                >
                  <Warning size={14} weight="duotone" className={`flex-shrink-0 transition-colors duration-300 ${
                    shouldHighlight ? 'text-red-10 dark:text-red-11' : 'text-gray-10'
                  }`} />
                  <span className={`transition-colors duration-300 ${
                    shouldHighlight ? 'text-red-11 dark:text-red-12' : 'text-gray-11'
                  }`}>
                    Add your {selectedModel.split('/')[0]} API key to continue
                    <span className={`ml-1 font-medium transition-colors ${
                      shouldHighlight ? 'text-red-12 dark:text-red-12' : 'text-gray-12'
                    }`}>
                      →
                    </span>
                  </span>
                </Link>
              </motion.div>
            )}
            
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-2.5 bg-red-2 dark:bg-red-3 border border-red-3 dark:border-red-6 rounded-lg text-xs max-w-md"
              >
                <Warning size={14} weight="duotone" className="text-red-10 dark:text-red-11 flex-shrink-0" />
                <span className="text-red-11 dark:text-red-12">{errorMessage}</span>
              </motion.div>
            )}

            <AnimatedMessageInput
              value={input}
              onChange={handleInputChange}
              onSubmit={handleSubmit}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              isLoading={isLoading}
              layoutId="message-input"
            />
          </div>
          </>
  )
}