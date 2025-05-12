import { UIMessage } from "ai";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Components } from 'react-markdown';
import type { ClassAttributes, HTMLAttributes } from "react"; // Import necessary types
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { CircleNotch, Clock, DiamondsFour, Hourglass } from "@phosphor-icons/react";
// Define the type for props passed to the custom code component
// Combines standard HTML attributes for <code> with react-markdown specific props
type CodeProps = ClassAttributes<HTMLElement> &
  HTMLAttributes<HTMLElement> & {
    node?: any; // Keep node for potential future use, though not used directly now
    inline?: boolean;
  };


// Define the custom code component
const CodeBlock: Components['code'] = ({ node, inline, className, children, ...props }: CodeProps) => {
  const match = /language-(\w+)/.exec(className || '');
  return !inline && match ? (
    <SyntaxHighlighter
      style={atomDark as any}
      customStyle={{
        borderRadius: "10px",
      }}
      language={match[1]}
      PreTag="div"
      codeTagProps={{
        className: "font-mono text-sm"
      }}
    >
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  ) : (

    <code className={className} {...props}>
      {children}
    </code>
  );
};


export default function Message({ message, annotations }: { message: UIMessage, annotations: any }) {

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

  return(
    <div className={`${baseClass} ${message.role === "user" ? userClass : aiClass}`}>
      {message.role === "assistant" && modelName && (
        <motion.div className="text-sm text-sage-11 font-mono font-medium mb-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {String(modelName)} 
        </motion.div>
      )}

      {message.content ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <ReactMarkdown
            children={message.content}
            components={{ code: CodeBlock }}
          />
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex flex-row items-center gap-2">
          <CircleNotch size={12} weight="bold" className="text-teal-9 animate-spin" />
          <p className="text-sage-11 font-mono text-xs font-medium">Generating...</p>
        </motion.div>
      )}

      <div className="flex flex-row items-center gap-4 mt-4">
        {message.role === "assistant" && creditsConsumed && (
          <motion.div className="flex flex-row items-center gap-1 text-sage-11 font-mono font-medium" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <DiamondsFour size={12} weight="fill" className="text-teal-9" />
            <p className="text-xs text-teal-11 dark:text-teal-5 font-medium">
              {String(creditsConsumed)}
            </p>
          </motion.div>
        )}
      </div>
    </div>
    );
}