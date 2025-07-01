"use client";

import { AnimatePresence, motion } from 'motion/react';
import { useModal } from '@/providers/modal-provider';
import { useTheme } from '@/providers/theme-provider';

import { 
  useFloating,
  useDismiss,
  useRole,
  useInteractions,
  useId,
  FloatingFocusManager
} from '@floating-ui/react';
import { useAuth } from '@/providers/auth-provider';

export function ModalContainer() {
  const { isOpen, modal, hideModal } = useModal();
  const { profile } = useAuth();
  const { theme } = useTheme();

  // Add floating UI hooks
  const {refs, context} = useFloating({
    open: isOpen,
    onOpenChange: (open) => {
      if (!open) hideModal();
    }
  });

  const dismiss = useDismiss(context, {
    outsidePressEvent: 'mousedown'
  });
  const role = useRole(context);

  const {getFloatingProps} = useInteractions([
    dismiss,
    role
  ]);

  // Generate IDs for accessibility
  const labelId = useId();
  const descriptionId = useId();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background Overlay */}
          <motion.div 
            initial={{opacity: 0}} 
            animate={{opacity: 1}} 
            exit={{opacity: 0}} 
            className={`fixed inset-0 w-screen h-screen bg-gray-1/50 z-50 ${theme === 'dark' ? 'dark' : ''}`}
          />
          {/* Modal Content */}
          <FloatingFocusManager context={context}>
            <div
              ref={refs.setFloating}
              {...getFloatingProps({
                "aria-labelledby": labelId,
                "aria-describedby": descriptionId
              })}
              className={`fixed inset-0 z-60 flex p-20 justify-center pointer-events-none ${theme === 'dark' ? 'dark' : ''}`}
            >
              <div className="pointer-events-auto">
                {modal}
              </div>
            </div>
          </FloatingFocusManager>
        </>
      )}
    </AnimatePresence>
  );
}