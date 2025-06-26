import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/button';
import Logo from '@/components/logo';
import { Lora } from "next/font/google";
import { Code } from '@phosphor-icons/react';
import ThemeToggle from '@/components/misc/ThemeToggle';

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
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-white/50 dark:bg-black/50 z-50 flex lg:items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            ref={modalRef}
            className="bg-gray-1 rounded-xl better-shadow max-w-2xl w-full border border-gray-3 overflow-auto relative"
            initial={{ opacity: 0, scale: 0.95, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 50, transition: { delay: 0.2 } }}
            transition={{ duration: 0.2 }}
          >
            <div className='flex flex-row px-4 py-2 bg-gray-2 border-b border-gray-3 justify-between sticky top-0 z-10'>
              <div className='flex flex-row items-center gap-2'>
                <div onClick={() => setIsOpen(false)} className='cursor-pointer h-3 w-3 bg-tomato-9 rounded-full flex items-center justify-center group'>
                  <div className='h-1 w-1 bg-tomato-12 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200'></div>
                </div>
                <div onClick={() => setIsOpen(false)} className='cursor-pointer h-3 w-3 bg-amber-9 rounded-full flex items-center justify-center group'>
                  <div className='h-1 w-1 bg-amber-12 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200'></div>
                </div>
                <div onClick={() => setIsOpen(false)} className='cursor-pointer h-3 w-3 bg-grass-9 rounded-full flex items-center justify-center group'>
                  <div className='h-1 w-1 bg-grass-12 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200'></div>
                </div>
              </div>
              <div className='flex flex-row items-center gap-px bg-gray-4 p-px rounded-md'>
                <ThemeToggle />
              </div>
            </div>

            <div className='w-full border-gray-3 border-b'>
              <div className='flex flex-row items-center gap-2 mx-auto'>
                <div
                  className="flex flex-col w-full relative overflow-hidden bg-hero"
                  style={{
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="w-full">
                    <div className="flex flex-row items-center w-full max-w-7xl mx-auto pt-8 pb-4 justify-between">
                      <div className="flex flex-row items-center w-max mx-auto gap-4 dark">
                        <Logo color="white" style="small" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center w-full max-w-7xl mx-auto py-4 pb-40 px-4 gap-1">
                    <h1 className={`text-2xl font-medium text-gray-2 relative z-10 dark:text-gray-12`}>Your Interface to Intelligence</h1>
                    <p className={`text-base text-gray-4 relative z-10 dark:text-gray-11`}>Chaterface is an open source chat interface for large language models.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className='w-full border-gray-3'>
              <div className='flex flex-col divide-y divide-gray-3 lg:divide-y-0 lg:grid grid-cols-1 md:grid-cols-3 border-gray-3 dark:border-gray-21 mx-auto'>
                <div className="flex flex-col gap-1 border-gray-3 dark:border-gray-2 lg:border-r p-8">
                  <div className="flex flex-col gap-1 mb-1">
                    <h3 className="text-base font-medium text-gray-12 text-pretty">Every AI model</h3>
                  </div>
                  <p className="text-xs text-gray-10 text-pretty">
                    All the latest AI models all in one place.
                  </p>
                </div>
                <div className="flex flex-col gap-1 border-gray-3 dark:border-gray-2 lg:border-r p-8">
                  <div className="flex flex-col gap-1 mb-1">
                    <h3 className="text-base font-medium text-gray-12 text-pretty">Credit based pricing</h3>
                  </div>
                  <p className="text-xs text-gray-10 text-pretty">
                    Just buy credits and pay for what you need.
                  </p>
                </div>
                <div className="flex flex-col gap-1 border-gray-3 p-8">
                  <div className="flex flex-col gap-1 mb-1">
                    <h3 className="text-base font-medium text-gray-12 text-pretty">Built For power users</h3>
                  </div>
                  <p className="text-xs text-gray-10 text-pretty">
                    Move fast with keyboard shortcuts.
                  </p>
                </div>
                <div className="flex flex-col gap-1 border-gray-3 dark:border-gray-2 lg:border-t p-10 col-span-3 items-center justify-center">
                  <div className="flex flex-col gap-1 items-center mb-1 mt-2">
                    <h3 className="text-sm font-medium text-gray-12 text-pretty">Open Source</h3>
                    <p className="text-xs text-gray-10 max-w-sm text-center">
                      Chaterface is fully open-source and built with mordern tech like Next.js, Tailwind CSS, Instant DB and Vercel's AI SDK.
                    </p>
                  </div>
                  <div className='flex flex-row gap-2 mt-2'>
                    <Button size="small" href="https://github.com/hyperaide/chaterface" target="_blank" className="w-max mt-2 bg-gray-3 hover:bg-gray-4 text-gray-12 border border-gray-5" icon={<Code size={14} weight="bold" />}>View Code</Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroductionModal;