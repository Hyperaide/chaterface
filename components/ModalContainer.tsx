"use client";

import { AnimatePresence, motion } from 'motion/react';
import { useModal } from '@/providers/modal-provider';

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
          {/* Background */}
          <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className={`bg-sage-1/80 backdrop-blur h-screen w-screen absolute inset-0 z-20 ${profile?.theme === 'dark' ? 'dark' : ''}`}></motion.div>
          {/* Modal */}
          <FloatingFocusManager context={context}>
            <div
              ref={refs.setFloating}
              {...getFloatingProps({
                "aria-labelledby": labelId,
                "aria-describedby": descriptionId
              })}
              className={`z-40 ${profile?.theme === 'dark' ? 'dark' : ''}`}
            >
              {modal}
            </div>
          </FloatingFocusManager>
        </>
      )}
    </AnimatePresence>
  );
}