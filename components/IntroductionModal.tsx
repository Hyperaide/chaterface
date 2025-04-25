import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/button';
import Logo from '@/components/logo';
import { Lora } from "next/font/google";
import { GithubLogo, ChatTeardropDots, Gear } from "@phosphor-icons/react/dist/ssr";
import { Code, User } from '@phosphor-icons/react';

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const IntroductionModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
          closeModal();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  const closeModal = () => {
    setIsOpen(false);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/25 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            ref={modalRef}
            className="bg-sage-2 p-2 rounded-xl better-shadow max-w-xl w-full border border-sage-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { delay: 0.2 } }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="flex flex-col w-full relative overflow-hidden rounded-lg"
              style={{
                backgroundImage: "url('/hero-noise.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="w-full">
                <div className="flex flex-row items-center w-full max-w-7xl mx-auto pt-8 pb-4 justify-between">
                  <div className="flex flex-row items-center w-max mx-auto gap-4 dark">
                    <Logo color="white"/>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center w-full max-w-7xl mx-auto py-4 pb-40 px-4">
                <h1 className={`${lora.className} text-2xl font-semibold text-sage-1 relative z-10`}>Your Interface to Intelligence</h1>
                <p className={`text-sm text-sage-5 relative z-10`}>Ground 0 is an AI learning platform for Visual and AUdio content.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 px-2 pb-2">
              <div className="flex flex-col gap-1 bg-sage-2 border border-sage-3 p-3 rounded-lg">
                <div className="flex items-center gap-1 mb-1">
                  <h3 className="text-sm font-semibold text-sage-12">Podcasts</h3>
                </div>
                <p className="text-xs text-sage-11">
                  Turn any topic into a Podcast from a single Prompt.
                </p>
              </div>

              <div className="flex flex-col gap-1 bg-sage-2 border border-sage-3 p-3 rounded-lg">
                <div className="flex items-center gap-1 mb-1">
                  {/* <ChatTeardropDots size={16} weight="bold" className="text-sage-12"/> */}
                  <h3 className="text-sm font-semibold text-sage-12">Visual Learning</h3>
                </div>
                <p className="text-xs text-sage-11">
                 You can create Explanatory Videos from any resource you want
                </p>
              </div>
            </div>
            <center>
               <Button size="small" href="#" className="mt-2 bg-sage-3 hover:bg-sage-4 text-sage-12 border border-sage-5" icon={<Code size={14} weight="bold" />}>Try it out</Button>
            </center>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroductionModal;