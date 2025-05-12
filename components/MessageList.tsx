import { InstaQLEntity } from "@instantdb/react";
import { inspect } from "util";
import { AppSchema } from "@/instant.schema";
import { UIMessage } from "ai";
import Message from "./message";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

type Message = InstaQLEntity<AppSchema, "messages">;

export default function MessageList({ messages, messagesOnDB }: { messages: UIMessage[], messagesOnDB: Message[] }) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesOnDB]);

  return (
    <motion.div className="flex flex-col gap-4 w-full max-w-4xl mx-auto overflow-y-auto pb-40"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
    >
      {messages.map((message, index) => (
        <Message key={index} message={message} annotations={message.annotations} />
      ))}
      <div ref={messagesEndRef} />
    </motion.div>
  );
}