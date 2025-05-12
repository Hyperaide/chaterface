'use client';

import { useState, useRef, useEffect } from "react";
import { useDatabase } from "@/providers/database-provider";
import { useKey } from "@/providers/key-provider";
import { useRouter } from 'next/navigation';
import { DateTime } from "luxon";
import { id, InstaQLEntity } from "@instantdb/react";
import Button from "@/components/button";
import ApiKeyInput from "@/components/api-key-input";
import Logo from "@/components/logo";
import { Lora } from "next/font/google";
import IntroductionModal from "@/components/IntroductionModal";
import { AnimatePresence } from "motion/react";
import ChatInput from "@/components/ChatInput";
import NewMessageInput from "@/components/NewMessageInput";
import { useNewConversation } from "@/providers/new-conversation-provider";
import { useChat } from "@ai-sdk/react";
import { useAuth } from "@/providers/auth-provider";
import { AppSchema } from "@/instant.schema";
import MessageList from "@/components/MessageList";
import { startBackgroundJob } from "@/lib/background-jobs";
const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type Message = InstaQLEntity<AppSchema, "messages">;

export default function Home() {
  const { db } = useDatabase();
  const { providerKeys } = useKey();
  const router = useRouter();
  const { user, sessionId } = useAuth();
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false); // Changed from isStreaming for clarity
  const [conversationId, setConversationId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { getProviderKey } = useKey();
  const [selectedModel, setSelectedModel] = useState<string>('openai/gpt-4.1-nano');

  const [dbMessages, setDbMessages] = useState<Message[]>([]);

  const conversationIdRef = useRef<string>('');

  const { data } = db.useQuery({
    conversations: {
      $: {
        where: { id: conversationId }
      },
      messages: {}
    }
  }, {
    ruleParams: {
      sessionId: sessionId ?? ''
    }
  });

  useEffect(() => {
    if(conversationId && data && !data?.conversations[0]){
      setDbMessages(data?.conversations[0]?.messages ?? []);
    }
  }, [data]);
  
  const { messages, input, handleInputChange, append, setInput, status } = useChat({
    api: '/api/chat',
    headers: {
      'Authorization': `Bearer ${getProviderKey(selectedModel)}`,
      'X-Session-Id': sessionId ?? '',
      'X-Token': user?.refresh_token ?? ''
    },
    body: {
      model: selectedModel
    },
    onError: async (error) => {
      setIsProcessing(false);
      setErrorMessage(error.message);
    },
    onFinish: async (message) => {
      setIsProcessing(false);
      const aiMessageId = id();
      const currentConversationId = conversationIdRef.current; // Get the latest value

      if(currentConversationId){ // Check using the ref's value
        await db.transact(db.tx.messages[aiMessageId].ruleParams({ sessionId: sessionId }).update({
          content: message.content,
          role: "assistant",
          createdAt: DateTime.now().toISO(),
          model: selectedModel
        }).link({ conversation: currentConversationId })); // Use the ref's value
      } else {
         console.error("onFinish executed but conversationIdRef.current was empty.");
         // Optionally handle this error case, though it shouldn't happen if createMessage runs first
      }
    }
  });

  // const { newConversationMessage, setNewConversationMessage, setNewConversationId } = useNewConversation();

  // Get the current provider from the selected model
  const currentProvider = selectedModel.split('/')[0] as keyof typeof providerKeys;

  const getPlaceholder = () => {
    if (!providerKeys[currentProvider]) {
      return `Please set your ${currentProvider} API key first...`;
    }
    return "Start a new chat...";
  };

  async function createMessage(content: string) {
    setIsProcessing(true);
    setErrorMessage(null);

    if(!conversationId){
      const generatedNewConversationId = id();
      setConversationId(generatedNewConversationId);
      conversationIdRef.current = generatedNewConversationId;

      // create conversation
      await db.transact(db.tx.conversations[generatedNewConversationId].update({
        createdAt: DateTime.now().toISO(),
        name: content.slice(0, 20).trim(),
        sessionId: sessionId ?? ''
      }));

      await db.transact(db.tx.messages[id()].ruleParams({ sessionId: sessionId }).update({
        content: content,
        role: "user",
        createdAt: DateTime.now().toISO(),
        model: selectedModel
      }).link({ conversation: generatedNewConversationId }));

      await startBackgroundJob(`${window.location.origin}/api/name-conversation`, {
        conversationId: generatedNewConversationId,
        firstMessageContent: content
      });
    }else{
      await db.transact(db.tx.messages[id()].ruleParams({ sessionId: sessionId }).update({
        content: content,
        role: "user",
        createdAt: DateTime.now().toISO(),
        model: selectedModel
      }).link({ conversation: conversationId }));
    }

    append({
      role: "user",
      content: content,
      parts: [{
        type: "text",
        text: content
      }]
    });

    setInput('');
  }

  return (
    <div className="w-full h-screen flex flex-col relative items-center justify-center">

      {!user && (
        <IntroductionModal />
      )}

      {conversationId ? (
        <div className="flex flex-col w-full h-full">
          <div className="flex-1 overflow-y-auto pt-24 h-full">
            <MessageList messages={messages} messagesOnDB={data?.conversations[0]?.messages ?? []} />
          </div>
        </div>
      ) : (
        <div className="overflow-y-auto px-4 pt-6 flex items-center justify-center">
          <div className="text-center">
              <h2 className="text-xl font-medium text-sage-12">What's on your mind?</h2>
              <p className="text-sage-11 text-sm font-mono mt-1">Send a message to start a new conversation.</p>
          </div>
        </div>
      )}

      
      <NewMessageInput input={input} handleInputChange={handleInputChange} createMessage={createMessage} selectedModel={selectedModel} setSelectedModel={setSelectedModel} onHomepage={conversationId ? false : true} isProcessing={isProcessing} errorMessage={errorMessage} setInput={setInput} />
    </div>
  );
}
