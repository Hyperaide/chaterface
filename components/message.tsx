import { UIMessage } from "ai";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import SyntaxHighlighter from 'react-syntax-highlighter';

import { atomDark, solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { stackoverflowDark, stackoverflowLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import type { Components } from 'react-markdown';
import React, { type ClassAttributes, type HTMLAttributes } from "react"; // Import necessary types
import { motion } from "motion/react";
import { useState, useEffect, useMemo, useRef } from "react";
import { CircleNotch, Clock, DiamondsFour, Hourglass } from "@phosphor-icons/react";
// Define the type for props passed to the custom code component
// Combines standard HTML attributes for <code> with react-markdown specific props
type CodeProps = ClassAttributes<HTMLElement> &
  HTMLAttributes<HTMLElement> & {
    node?: any; // Keep node for potential future use, though not used directly now
    inline?: boolean;
  };

// Define a specific props type for CodeBlock, aligning with react-markdown
interface CustomCodeBlockProps extends HTMLAttributes<HTMLElement> {
  node?: any; 
  inline?: boolean; 
}

// Define the custom code component
const CodeBlock: Components['code'] = ({ node, inline, className, children, ...props }: CustomCodeBlockProps) => {
  const match = /language-(\w+)/.exec(className || '');
  const [currentChildren, setCurrentChildren] = useState(String(children));
  const [isHighlightingEnabled, setIsHighlightingEnabled] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setCurrentChildren(String(children));
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setIsHighlightingEnabled(false);
    timerRef.current = setTimeout(() => {
      setIsHighlightingEnabled(true);
    }, 300); 

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [children]);

  const syntaxHighlighterStyle: React.CSSProperties = useMemo(() => ({
    borderRadius: "10px",
    border: "1px solid rgb(50, 50, 50)",
    margin: "0",
    padding: "12px",
  }), []);

  const plainCodeStyle: React.CSSProperties = useMemo(() => ({
    ...syntaxHighlighterStyle,
    backgroundColor: "rgb(40,40,40)", 
    overflowX: "auto",
  }), [syntaxHighlighterStyle]);

  if (!inline && match) {
    if (isHighlightingEnabled) {
      return (
        <SyntaxHighlighter
          style={atomDark as any} 
          customStyle={syntaxHighlighterStyle}
          language={match[1]}
          codeTagProps={{
            className: "font-mono text-base"
          }}
        >
          {currentChildren.replace(/\n$/, '')}
        </SyntaxHighlighter>
      );
    } else {
      return (
        <pre style={plainCodeStyle} className="font-mono text-sm">
          <code className={className} {...props}>
            {currentChildren}
          </code>
        </pre>
      );
    }
  }

  return (
    <code className={className} {...props}>
      {children}
    </code>
  );
};


const Message = React.forwardRef<HTMLDivElement, { message: UIMessage, annotations: any }>(({ message, annotations }, ref) => {

  const [modelName, setModelName] = useState<string | null>(null);
  const [creditsConsumed, setCreditsConsumed] = useState<number | null>(null);

  useEffect(() => {
    if(annotations) {
      const modelAnnotation = annotations[0];
      if (modelAnnotation && typeof modelAnnotation.model === 'string' && modelAnnotation.model) {
        setModelName(modelAnnotation.model);
      }

      const creditsAnnotation = annotations[1];
      if (creditsAnnotation && typeof creditsAnnotation.creditsConsumed === 'number' && creditsAnnotation.creditsConsumed) {
        setCreditsConsumed(creditsAnnotation.creditsConsumed);
      }
    }
  }, [annotations]);

  const baseClass = "w-max max-w-2xl text-sage-12";
  const userClass = "ml-auto";
  const aiClass = "mr-auto";

  if(message.role === "user") {
    return(
      <div className="flex flex-col gap-1 p-6">
        <p className="text-base text-gray-11">
          {message.content}
        </p>
      </div>
    )
  }

  return(
    <div className="relative flex flex-col gap-1 p-px bg-gray-3 dark:bg-gray-2 rounded-md w-max max-w-4xl">
      <div className="relative flex flex-col gap-1 bg-gray-1 p-6 rounded">
        <p className="w-max z-10 absolute -top-2 left-4 text-[11px] text-gray-11 font-mono uppercase font-medium bg-gray-1 px-2 rounded-md">
          {String(modelName)}
        </p>
        <p className="text-base text-gray-12">
        {message.content ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div className="prose prose-sm dark:prose-invert prose-pre:m-0 prose-pre:bg-transparent prose-pre:p-0 max-w-none prose-p:text-sage-12 prose-p:mb-2 prose-headings:text-sage-12 prose-strong:text-sage-12 prose-a:text-teal-9 hover:prose-a:text-teal-10 prose-blockquote:text-sage-11">
              <ReactMarkdown
                children={message.content}
                components={{ code: CodeBlock }}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex flex-row items-center gap-2">
            <CircleNotch size={12} weight="bold" className="text-teal-9 animate-spin" />
            <p className="text-sage-11 font-mono text-xs font-medium">Generating...</p>
          </motion.div>
        )}
        </p>

        {message.role === "assistant" && creditsConsumed && (
        <p className="z-10 absolute -bottom-2 left-4 text-tiny flex flex-row items-center gap-1 text-gray-11 font-mono uppercase font-medium bg-gray-1 px-2 rounded-md">
        <DiamondsFour size={12} className="text-teal-9" weight="fill" />
          {String(creditsConsumed)}
          </p>
        )}
      </div>
    </div>
    );
});

Message.displayName = "Message"; // Add display name for better debugging
export default Message;