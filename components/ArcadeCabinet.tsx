import React from 'react';

interface ArcadeCabinetProps {
  children: React.ReactNode;
  title: string;
}

const ArcadeCabinet: React.FC<ArcadeCabinetProps> = ({ children, title }) => {
  return (
    <div className="relative w-full max-w-3xl mx-auto my-2">
      {/* Outer Cabinet with Metallic Border */}
      <div className="relative bg-terminal-black rounded-xl overflow-hidden
                    border-4 border-[#2a2a2a] shadow-[0_0_32px_2px_rgba(0,255,128,0.15)]
                    before:absolute before:inset-0 before:border-2 before:border-[#404040]/50 before:rounded-lg before:m-0.5">
        {/* Arcade Marquee with Elaborate Styling */}
        <div className="relative h-16 bg-gradient-to-b from-terminal-black via-[#1a1a1a] to-terminal-black overflow-hidden">
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
                <h2 className="font-mono font-black text-2xl uppercase tracking-[0.2em] px-6
                           bg-gradient-to-r from-terminal-green via-[#00ff99] to-terminal-green
                           bg-clip-text text-transparent animate-gradient-x
                           drop-shadow-[0_0_8px_rgba(0,255,128,0.5)]
                           after:content-[attr(data-text)]
                           after:absolute after:left-0 after:top-0
                           after:w-full after:h-full after:opacity-50
                           after:blur-sm"
                    data-text={title}>
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
          <div className="relative rounded-lg overflow-hidden
                       border-2 border-[#333] shadow-[0_0_0_1px_#1a1a1a,inset_0_0_0_1px_#1a1a1a]
                       before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,0,0.08),transparent_80%)]
                       before:pointer-events-none before:z-10">
            {/* Enhanced Scanlines Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] pointer-events-none z-20" />
            
            {/* Screen Glare */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.02)_0%,transparent_50%)] pointer-events-none z-30" />

            {/* Screen Content */}
            <div className="relative bg-terminal-background min-h-[260px] p-4 flex items-center justify-center
                         shadow-[inset_0_0_20px_rgba(0,255,0,0.15),inset_0_2px_2px_rgba(0,0,0,0.2)]
                         border border-[#222]">
              {children}
            </div>
          </div>
        </div>

        {/* Cabinet Controls with Metallic Finish */}
        <div className="px-6 py-3 bg-gradient-to-b from-[#1a1a1a] via-terminal-black to-terminal-black border-t border-[#333]">
          <div className="flex items-center justify-center gap-12">
            {/* Enhanced Joystick */}
            <div className="relative group">
              <div className="w-8 h-8 rounded-full 
                           bg-gradient-to-br from-[#2a2a2a] via-[#333] to-[#222]
                           border-2 border-[#444]
                           shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]
                           group-hover:from-[#333] group-hover:to-[#2a2a2a]
                           transition-colors duration-150" />
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-5
                           bg-gradient-to-b from-[#2a2a2a] to-[#222]
                           group-hover:from-[#333] group-hover:to-[#2a2a2a]
                           transition-colors duration-150" />
            </div>

            {/* Enhanced Buttons */}
            <div className="flex gap-6">
              {[...Array(3)].map((_, i) => (
                <button
                  key={i}
                  className="w-6 h-6 rounded-full 
                           bg-gradient-to-br from-terminal-green/90 to-terminal-green/70
                           border-2 border-[#333]
                           shadow-[inset_0_1px_2px_rgba(255,255,255,0.2),0_1px_1px_rgba(0,0,0,0.3)]
                           hover:from-terminal-green hover:to-terminal-green/80
                           active:shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)]
                           transition-all duration-150"
                />
              ))}
            </div>
          </div>
          
          {/* Control Instructions */}
          <div className="mt-3 text-[#666] text-xs font-mono text-center tracking-wide
                        border border-[#333] rounded px-3 py-1.5 bg-[#1a1a1a]/50">
            Use keyboard or click to play
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArcadeCabinet;
