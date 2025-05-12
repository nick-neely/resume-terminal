import React, { useEffect, useState } from 'react';

interface CoffeeOutputProps {
  duration?: number; // ms
}

// Define cup levels - from empty to full
// Define cup levels - from empty to full (9 frames)
// Improved ASCII art with wavy surface and progressive shading
const CUP_LEVELS = [
  // Level 0: empty
  [
    '         ( ( (       ) ) )         ',
    '       .-----------------_       ',
    '      |                 | ]      ',
    '      |                 |  ]     ',
    '      |                 |   ]    ',
    '      |                 |  ]     ',
    '      |                 |_]      ',
    '      |                 |        ',
    '       \\               /         ',
    '        \\             /          ',
    '         \\___________/           ',
    '          `-----------            ',
  ],
  // Level 1: tiny drip
  [
    '         ( ( (       ) ) )         ',
    '       .~~~~~~●~~~~~~~~. _     ',
    '      | ░░░░░░░░░░░░░░░ | ]      ',
    '      |                 |  ]     ',
    '      |                 |   ]    ',
    '      |                 |  ]     ',
    '      |                 |_]      ',
    '      |                 |        ',
    '       \\               /         ',
    '        \\             /          ',
    '         \\___________/           ',
    '          `-----------            ',
  ],
  // Level 2
  [
    '         ( ( (       ) ) )         ',
    '       .~~~~~●●~~~~~~~.  _    ',
    '      | ░░░░░░░░░░░░░░░ | ]      ',
    '      | ░░░░░░░░░░░░░░░ |  ]     ',
    '      |                 |   ]    ',
    '      |                 |  ]     ',
    '      |                 |_]      ',
    '      |                 |        ',
    '       \\               /         ',
    '        \\             /          ',
    '         \\___________/           ',
    '          `-----------            ',
  ],
  // Level 3
  [
    '         ( ( (       ) ) )         ',
    '       .~~~~●●●~~~~~~~~  _    ',
    '      | ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ | ]      ',
    '      | ░░░░░░░░░░░░░░░ |  ]     ',
    '      | ░░░░░░░░░░░░░░░ |   ]    ',
    '      |                 |  ]     ',
    '      |                 |_]      ',
    '      |                 |        ',
    '       \\               /         ',
    '        \\             /          ',
    '         \\___________/           ',
    '          `-----------            ',
  ],
  // Level 4: about half
  [
    '         ( ( (       ) ) )         ',
    '       .~~~●●●●●~~~~~~~  _     ',
    '      | ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ | ]      ',
    '      | ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ |  ]     ',
    '      | ░░░░░░░░░░░░░░░ |   ]    ',
    '      | ░░░░░░░░░░░░░░░ |  ]     ',
    '      |                 |_]      ',
    '      |                 |        ',
    '       \\               /         ',
    '        \\             /          ',
    '         \\___________/           ',
    '          `-----------            ',
  ],
  // Level 5
  [
    '         ( ( (       ) ) )         ',
    '       .~~●●●●●●~~~~~~~. _     ',
    '      | ███████████████ | ]      ',
    '      | ███████████████ |  ]     ',
    '      | ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ |   ]    ',
    '      | ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ |  ]     ',
    '      | ░░░░░░░░░░░░░░░ |_]      ',
    '      |                 |        ',
    '       \\               /         ',
    '        \\             /          ',
    '         \\___________/           ',
    '          `-----------            ',
  ],
  // Level 6
  [
    '         ( ( (       ) ) )         ',
    '       .~●●●●●●●~~~~~~~. _     ',
    '      | ███████████████ | ]      ',
    '      | ███████████████ |  ]     ',
    '      | ███████████████ |   ]    ',
    '      | ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ |  ]     ',
    '      | ░░░░░░░░░░░░░░░ |_]      ',
    '      | ░░░░░░░░░░░░░░░ |        ',
    '       \\               /         ',
    '        \\             /          ',
    '         \\___________/           ',
    '          `-----------            ',
  ],
  // Level 7
  [
    '         ( ( (       ) ) )         ',
    '       .●●●●●●●●●~~~~~.  _    ',
    '      | ███████████████ | ]      ',
    '      | ███████████████ |  ]     ',
    '      | ███████████████ |   ]    ',
    '      | ███████████████ |  ]     ',
    '      | ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ |_]      ',
    '      | ░░░░░░░░░░░░░░░ |        ',
    '       \\               /         ',
    '        \\             /          ',
    '         \\___________/           ',
    '          `-----------            ',
  ],
  // Level 8: full
  [
    '         ( ( (       ) ) )         ',
    '       .●●●●●●●●●●●●●.   _   ',
    '      | ███████████████ | ]      ',
    '      | ███████████████ |  ]     ',
    '      | ███████████████ |   ]    ',
    '      | ███████████████ |  ]     ',
    '      | ███████████████ |_]      ',
    '      | ███████████████ |        ',
    '       \\               /         ',
    '        \\             /          ',
    '         \\___________/           ',
    '          `-----------            ',
  ],
];

const MAX_LEVEL = CUP_LEVELS.length - 1;

export const CoffeeOutput: React.FC<CoffeeOutputProps> = ({ duration = 60000 }) => {
  const [level, setLevel] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (level < MAX_LEVEL) {
      const timeout = setTimeout(() => setLevel(level + 1), duration / MAX_LEVEL);
      return () => clearTimeout(timeout);
    } else {
      setTimeout(() => setDone(true), 500);
    }
  }, [level, duration]);

  const cup = CUP_LEVELS[level];

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] font-mono text-[28px] select-none">
      <pre className="leading-6 mb-3 text-amber-300 drop-shadow-lg">
        {cup.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </pre>
      <div className="text-sm text-zinc-400 mt-3 animate-pulse">
        {done ? 'Enjoy your break! ☕' : 'Brewing your coffee...'}
      </div>
    </div>
  );
};
