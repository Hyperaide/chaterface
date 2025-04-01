import { InstaQLEntity } from "@instantdb/react";
import { inspect } from "util";
import { AppSchema } from "@/instant.schema";
import { UIMessage } from "ai";
import Message from "./message";
import { useEffect, useRef } from "react";

type Message = InstaQLEntity<AppSchema, "messages">;

export default function MessageList({ messages, messagesOnDB }: { messages: UIMessage[], messagesOnDB: Message[] }) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  console.log("messagesOnDB", messagesOnDB);
  console.log("messages", messages);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesOnDB]);

  return (
    <div className="flex flex-col gap-4 w-full max-w-4xl mx-auto overflow-y-auto pb-40">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}