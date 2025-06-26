'use client';

import { useParams } from "next/navigation";
import { useDatabase } from "@/providers/database-provider";
import { useKey } from "@/providers/key-provider";
import { useEffect, useState, useRef } from "react";
import { id, InstaQLEntity, id as newInstantId } from "@instantdb/react";
import { AppSchema } from "@/instant.schema";
import { useChat } from '@ai-sdk/react'
import { DateTime } from "luxon";
import ChatInput from "@/components/ChatInput";
import MessageList from "@/components/MessageList";
import NewMessageInput from "@/components/NewMessageInput";
import { UIMessage } from "ai";
import { useNewConversation } from "@/providers/new-conversation-provider";
import { calculateCreditCost, models } from "@/constants/models";
import { useAuth } from "@/providers/auth-provider";
import { useMessageStore } from "@/app/utils/message-store";
import ModelSelector from "@/components/ModelSelector";
import AnimatedMessageInput from "@/components/AnimatedMessageInput";
import { useSidebarStore } from "@/components/Sidebar";

type Conversation = InstaQLEntity<AppSchema, "conversations">;
type Message = InstaQLEntity<AppSchema, "messages">;
import { useRouter } from "next/navigation";
import Toolbar from "@/components/Toolbar";

export default function ConversationPage() {
  const message = useMessageStore((state: any) => state.message);
  const setMessage = useMessageStore((state: any) => state.setMessage);

  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : undefined;
  const { db } = useDatabase();
  const { getProviderKey } = useKey();
  const { user, sessionId } = useAuth();
  const [selectedModel, setSelectedModel] = useState<string>(models[0].id);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [initialMessages, setInitialMessages] = useState<any[]>([]);

  const hasRun = useRef(false);
  const { sidebarOpen } = useSidebarStore();

  useEffect(() => {
    if (message !== "" && !hasRun.current) {
      createMessage(message);
      setMessage("");
      hasRun.current = true;
    }
  }, []);


  const router = useRouter();
  const { data } = db.useQuery({
    conversations: {
      $: {
        where: { id: id as string }
      },
      messages: {}
    }
  }, {
    ruleParams: {
      sessionId: sessionId ?? ''
    }
  });

  useEffect(() => {
    
    async function getMessagesOnDB() {
      const messagesOnDB = await db.queryOnce({
        messages: {
          $: {
            where: {
              conversation: id as string
            }
          }
        }
      },
      {
        ruleParams: {
          sessionId: sessionId ?? ''
        }
      });

      setInitialMessages(messagesOnDB.data.messages.map((message) => ({
        role: message.role as "data" | "system" | "user" | "assistant",
        content: message.content,
        id: message.id,
        parts: [{
          type: "text",
          text: message.content
        }],
        annotations: [
          { model: message.model },
          { creditsConsumed: message.creditsConsumed ?? 0 }
        ]
      })));
    }

    if(!hasRun.current) {
      getMessagesOnDB();
    }
    hasRun.current = true;
  }, []);

  const { messages, input, handleInputChange, append, setInput, status } = useChat({
    api: '/api/chat',
    headers: {
      'Authorization': `Bearer ${getProviderKey(selectedModel)}`,
      'X-Session-Id': sessionId ?? '',
      'X-Token': user?.refresh_token ?? '',
    },
    body: {
      model: selectedModel
    },
    onError: async (error) => {
      setIsProcessing(false);
      setErrorMessage(error.message);
    },
    onFinish: async (message, options) => {
      setIsProcessing(false);
      const aiMessageId = newInstantId();
      await db.transact(db.tx.messages[aiMessageId].ruleParams({ sessionId: sessionId ?? '' }).update({
        content: message.content,
        role: "assistant",
        createdAt: DateTime.now().toISO(),
        model: selectedModel,
        creditsConsumed: calculateCreditCost(selectedModel, options.usage)
      }).link({ conversation: id as string }));
    },
    initialMessages: initialMessages
  });


  async function createMessage(content: string) {
    console.log('createMessage called');
    if (!id) {
      console.error('No conversation ID available');
      return;
    }

    setInput("");

    const newMessageId = newInstantId();
    
    // Create user message
    await db.transact(db.tx.messages[newMessageId].ruleParams({ sessionId: sessionId ?? '' }).update({
      content: content,
      createdAt: DateTime.now().toISO(),
      role: "user",
      model: selectedModel
    }).link({ conversation: id }));

    setIsProcessing(true);
    setErrorMessage(null);

    append({
      role: "user",
      content: content,
      parts: [{
        type: "text",
        text: content
      }]
    });
  }

  return (
    <div className="flex flex-col w-full h-full mx-auto relative">
      <div className="sticky top-0 z-10 left-0 right-0 p-4 border-b border-gray-3 dark:border-gray-2 flex flex-row gap-4 items-center justify-between">
        
        
        <div className="flex flex-row gap-4 items-center">
          {!sidebarOpen && (
            <Toolbar/>
          )}
          
          <p className="text-xs text-gray-11">
            {data?.conversations[0]?.name}
          </p>
        </div>
        <p className="text-tiny font-mono uppercase font-medium text-gray-11">
          {data?.conversations[0]?.messages.length} messages
        </p>
      </div>
      <div className="flex-1 overflow-y-auto pt-2 h-full">
        <MessageList messages={messages} messagesOnDB={data?.conversations[0]?.messages ?? []} />
      </div>
      
      <div className="flex flex-col gap-4 p-4  mx-auto w-full absolute bottom-0 bg-gradient-to-t from-gray-1 to-transparent via-20% via-gray-1">
        <AnimatedMessageInput
          value={input}
          onChange={handleInputChange}
          onSubmit={(e) => {
            e.preventDefault();
            createMessage(input);
          }}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          isLoading={isProcessing}
          layoutId="message-input"
        />
      </div>
      
    </div>
  );
}
