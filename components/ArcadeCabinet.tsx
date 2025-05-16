'use client';
import { motion } from 'framer-motion';
import type React from 'react';

interface ArcadeCabinetProps {
  children: React.ReactNode;
  title: string;
}

const ArcadeCabinet: React.FC<ArcadeCabinetProps> = ({ children, title }) => {
  return (
    <div className="relative w-full max-w-3xl mx-auto mt-0 mb-1">
      {/* Outer Cabinet with Metallic Border */}
      <div
        className="relative bg-terminal-black rounded-xl overflow-hidden
                    border-4 border-[#2a2a2a] shadow-[0_0_32px_2px_rgba(0,255,128,0.15)]
                    before:absolute before:inset-0 before:border-2 before:border-[#404040]/50 before:rounded-lg before:m-0.5"
      >
        {/* Arcade Marquee with Elaborate Styling */}
        <div className="relative h-12 bg-gradient-to-b from-terminal-black via-[#1a1a1a] to-terminal-black overflow-hidden">
          {/* Decorative Background Patterns */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_16px_16px,#1a1a1a_2px,transparent_4px)] bg-repeat bg-[length:24px_24px]" />
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_45%,#333_45%,#333_55%,transparent_55%)] bg-[length:8px_8px]" />
          </div>

          {/* Title Container */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Glowing Background Bar */}
            <div className="absolute w-4/5 h-8 bg-terminal-green/5 blur-xl transform -skew-x-12" />

            {/* Main Title */}
            <div className="relative px-8 py-2 transform -skew-x-12">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-terminal-green/10 blur-md" />

              {/* Title Text */}
              <div className="relative transform skew-x-12">
                <h2
                  className="font-mono font-black text-2xl uppercase tracking-[0.2em] px-6
                           bg-gradient-to-r from-terminal-green via-[#00ff99] to-terminal-green
                           bg-clip-text text-transparent animate-gradient-x
                           drop-shadow-[0_0_8px_rgba(0,255,128,0.5)]
                           after:content-[attr(data-text)]
                           after:absolute after:left-0 after:top-0
                           after:w-full after:h-full after:opacity-50
                           after:blur-sm"
                  data-text={title}
                >
                  {title}
                </h2>
              </div>
            </div>
          </div>

          {/* Edge Lighting Effects */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-terminal-green/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-terminal-green/20 to-transparent" />
        </div>

        {/* Screen Bezel with Enhanced CRT Effect */}
        <div className="p-4 bg-gradient-to-b from-[#1a1a1a] to-terminal-black">
          <div
            className="relative rounded-lg overflow-hidden
                       border-2 border-[#333] shadow-[0_0_0_1px_#1a1a1a,inset_0_0_0_1px_#1a1a1a]
                       before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,0,0.08),transparent_80%)]
                       before:pointer-events-none before:z-10"
          >
            {/* Enhanced Scanlines Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] pointer-events-none z-20" />

            {/* Screen Glare */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.02)_0%,transparent_50%)] pointer-events-none z-30" />

            {/* Screen Content */}
            <div
              className="relative bg-terminal-background min-h-[260px] p-4 flex items-center justify-center
                         shadow-[inset_0_0_20px_rgba(0,255,0,0.15),inset_0_2px_2px_rgba(0,0,0,0.2)]
                         border border-[#222]"
            >
              {children}
            </div>
          </div>
        </div>

        {/* Cabinet Controls with Metallic Finish */}
        <div className="px-6 py-2 bg-gradient-to-b from-[#1a1a1a] via-terminal-black to-terminal-black border-t border-[#333]">
          <div className="flex items-center justify-center gap-12">
            {/* Enhanced Joystick */}
            <div className="relative w-12 h-12">
              {/* Joystick Base */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                          w-10 h-10 rounded-full bg-[#222] border-2 border-[#333]
                          shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
              />

              {/* Draggable Joystick */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing"
                drag
                dragConstraints={{
                  top: -4,
                  right: 4,
                  bottom: 4,
                  left: -4,
                }}
                dragElastic={0.15}
                dragTransition={{
                  bounceStiffness: 600,
                  bounceDamping: 20,
                }}
                dragMomentum={false}
                whileDrag={{ scale: 1.05 }}
                animate={{ scale: 1 }}
              >
                <div
                  className="w-6 h-6 rounded-full 
                            bg-gradient-to-br from-[#2a2a2a] via-[#333] to-[#222]
                            border-2 border-[#444]
                            shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.2)]"
                />
              </motion.div>
            </div>

            {/* Enhanced Buttons */}
            <div className="flex gap-6">
              {['A', 'B', 'C'].map((label, i) => (
                <div key={i} className="relative">
                  {/* No glow effect on hover */}

                  {/* The actual button */}
                  <motion.button
                    whileHover={{
                      scale: 1.08,
                    }}
                    whileTap={{
                      scale: 0.95,
                      backgroundColor: '#1a1a1a',
                      borderWidth: '2px',
                      borderStyle: 'solid',
                    }}
                    initial={{
                      backgroundColor: '#333',
                      borderColor: '#444',
                      borderWidth: '2px',
                      borderStyle: 'solid',
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 15,
                    }}
                    className="relative w-6 h-6 rounded-full cursor-pointer z-10
                              shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_1px_1px_rgba(0,0,0,0.3)]
                              focus:outline-none focus-visible:ring-1 focus-visible:ring-terminal-green/50"
                  >
                    {/* Button label */}
                    <motion.span
                      className="absolute inset-0 flex items-center justify-center text-xs font-mono"
                      initial={{ color: '#666' }}
                      whileHover={{ color: '#00ff99' }}
                      whileTap={{ color: '#00ff99', opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {label}
                    </motion.span>
                  </motion.button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArcadeCabinet;
