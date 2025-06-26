import { InstaQLEntity } from "@instantdb/react";
import { inspect } from "util";
import { AppSchema } from "@/instant.schema";
import { UIMessage } from "ai";
import Message from "@/components/message";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

type MessageEntityType = InstaQLEntity<AppSchema, "messages">;

export default function MessageList({ messages, messagesOnDB }: { messages: UIMessage[], messagesOnDB: MessageEntityType[] }) {
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessageRef.current && lastMessage && lastMessage.role === "user") {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [messages]);

  return (
    <motion.div className="flex flex-col gap-4 w-full max-w-4xl mx-auto overflow-y-auto pb-[80vh]"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
    >
      {messages.map((message, index) => (
        <Message 
          key={index} 
          message={message} 
          annotations={message.annotations} 
          ref={index === messages.length - 1 ? lastMessageRef : null} 
        />
      ))}
    </motion.div>
  );
}