import React from 'react';

const asciiLogo = String.raw`
          /^--^\     /^--^\     /^--^\
          \____/     \____/     \____/
         /      \   /      \   /      \
        |        | |        | |        |
         \__  __/   \__  __/   \__  __/
          |^|^|^|^|^|^\ \^|^|^|^/ /^|^|^|^|^\ \^|^|^|^|^|^|
          | | | | | | |\ \| | |/ /| | | | | |\ \ | | | | |
          ############/ /######\ \###########/ /###########
          | | | | | | \/| | | | \/| | | | | |\/ | | | | | |
          |_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|
`;

const signature = String.raw`
 ___      ___  _____ ____   ____  ____     ___  ___        ____   __ __      ____   ____   __  __  _ 
|   \    /  _]/ ___/|    | /    ||    \   /  _]|   \      |    \ |  |  |    |    \ |    | /  ]|  |/ ]
|    \  /  [_(   \_  |  | |   __||  _  | /  [_ |    \     |  o  )|  |  |    |  _  | |  | /  / |  ' / 
|  D  ||    _]\__  | |  | |  |  ||  |  ||    _]|  D  |    |     ||  ~  |    |  |  | |  |/  /  |    \ 
|     ||   [_ /  \ | |  | |  |_ ||  |  ||   [_ |     |    |  O  ||___, |    |  |  | |  /   \_ |     \
|     ||     |\    | |  | |     ||  |  ||     ||     |    |     ||     |    |  |  | |  \     ||  .  |
|_____||_____| \___||____||___,_||__|__||_____||_____|    |_____||____/     |__|__||____\____||__|\_|
                                                                                                     
`;

export const IdleSignature: React.FC = () => (
  <div
    className="w-full min-w-full h-full min-h-[60vh] flex flex-col items-center justify-center pointer-events-none select-none"
    aria-hidden="true"
  >
    <pre
      className="text-zinc-500 text-center font-mono leading-snug drop-shadow-lg"
      style={{ marginLeft: '-60px' }}
    >
      {asciiLogo}
    </pre>
    <pre
      className="text-zinc-200 text-xs font-mono drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)]"
      style={{
        transform: 'scale(0.6)',
        transformOrigin: 'top center',
        display: 'inline-block',
        marginRight: '-30px',
      }}
    >
      {signature}
    </pre>
  </div>
);
