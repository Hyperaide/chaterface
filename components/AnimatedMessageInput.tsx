import { motion } from "framer-motion";
import ModelSelector from "./ModelSelector";
import React from "react";

interface AnimatedMessageInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  layoutId?: string;
}

const AnimatedMessageInput: React.FC<AnimatedMessageInputProps> = ({
  value,
  onChange,
  onSubmit,
  selectedModel,
  setSelectedModel,
  isLoading = false,
  disabled = false,
  layoutId = "message-input",
}) => {
  return (
    <motion.div
      layoutId={layoutId}
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="border-gray-3 w-full"
    >
      <div className="relative max-w-2xl w-full mx-auto bg-gray-3 dark:bg-gradient-to-b dark:from-gray-4 dark:to-gray-3 p-px rounded-xl border-gray-3 better-shadow">
        <div className="relative flex flex-col bg-white dark:bg-gray-2 rounded-xl">
          <form onSubmit={onSubmit} className="w-full h-full">
            <textarea
              className="w-full h-full bg-transparent outline-none p-4 text-base resize-none min-h-[60px] max-h-[200px] text-gray-12 placeholder:text-gray-11"
              placeholder="Ask me anything..."
              rows={3}
              value={value}
              onChange={onChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !disabled && !isLoading) {
                  e.preventDefault();
                  // Create a fake form event to pass to onSubmit
                  const form = e.currentTarget.closest('form');
                  if (form) {
                    const event = new Event('submit', { bubbles: true, cancelable: true });
                    form.dispatchEvent(event);
                  }
                }
              }}
              disabled={disabled || isLoading}
            />
            <div className="flex flex-row p-2 pb-2 justify-between items-center overflow-hidden ">
              <ModelSelector
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
              />
              <button
                type="submit"
                className="ml-auto bg-gray-2 hover:bg-gray-3 text-gray-12 border border-gray-3 transition-colors px-2 py-1 text-base rounded-md"
                disabled={disabled || isLoading || !value.trim()}
              >
                {isLoading ? "Sending..." : "Send"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default AnimatedMessageInput; 