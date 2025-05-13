import { motion, useMotionValue, useAnimation, useDragControls } from 'framer-motion';
import React from 'react';

interface TerminalDragMotionProps {
  children: (dragControls: ReturnType<typeof useDragControls>) => React.ReactNode;
}

/**
 * Wraps terminal in a playful, fluid, draggable container.
 * Only allows drag from the top bar (via dragControls).
 */
export const TerminalDragMotion: React.FC<TerminalDragMotionProps> = ({ children }) => {
  const dragControls = useDragControls();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const controls = useAnimation();

  // Playful resistance: bounce back if dragged too far
  const handleDragEnd = (_e: any, info: any) => {
    if (Math.abs(info.point.x) > 120 || Math.abs(info.point.y) > 60) {
      controls.start({ x: 0, y: 0, rotate: 0, transition: { type: 'spring', stiffness: 400, damping: 20 } });
    } else {
      controls.start({ rotate: [0, 6, -6, 0], transition: { duration: 0.5, type: 'spring', bounce: 0.7 } });
    }
  };

  return (
    <motion.div
      style={{ x, y, touchAction: 'none', zIndex: 50 }}
      animate={controls}
      drag
      dragListener={false} // Only drag with controls
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0.08}
      dragConstraints={{ left: -40, right: 40, top: -18, bottom: 18 }}
      onDragEnd={handleDragEnd}
      className="relative select-none"
    >
      {children(dragControls)}
    </motion.div>
  );
};
