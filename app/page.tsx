"use client";

import Button from "@/components/button";
import IntroductionModal from "@/components/IntroductionModal";
import Logo from "@/components/logo";
import ModelSelector from "@/components/ModelSelector";
import { models } from "@/constants/models";
import { DiamondsFour, Folder } from "@phosphor-icons/react";
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

export const useMessageStore = create((set) => ({
  message: "",
  setMessage: (message: string) => set({ message }),
}))

export default function Page() {
  const { db } = useDatabase();
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, sessionId } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  const { sidebarOpen } = useSidebarStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    setIsLoading(true);
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


          <div className="flex flex-col gap-4 p-4 py-8 max-w-4xl mx-auto justify-center items-center h-dvh">

            <div className="flex flex-col gap-1 items-center text-center mb-4">
              <p className="text-sm text-gray-11"> 
                What's on your mind?
              </p>
              <p className="text-xs text-gray-10">
              Send a message to start a new conversation.
              </p>
            </div>

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