'use client';

import type React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ArcadeCabinet from '../ArcadeCabinet';
import {
  type HangmanGameState,
  initHangmanGame,
  processHangmanGuess,
  calculateHangmanScore,
  getHangmanHighScore,
  updateHangmanHighScore,
} from '../../utils/gameUtils';

const Hangman: React.FC = () => {
  // Game state
  const [gameState, setGameState] = useState<HangmanGameState>(initHangmanGame());
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(getHangmanHighScore());
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize game
  const resetGame = useCallback(() => {
    setGameState(initHangmanGame());
    setScore(0);
  }, []);

  // Process a letter guess
  const makeGuess = useCallback(
    (letter: string) => {
      if (!letter || gameState.gameStatus !== 'playing') return;

      // Only process alphabetical characters
      if (/^[a-zA-Z]$/.test(letter)) {
        setGameState((prevState) => {
          const newState = processHangmanGuess(prevState, letter);

          // If game is won, calculate and update score
          if (newState.gameStatus === 'won' && prevState.gameStatus === 'playing') {
            const newScore = calculateHangmanScore(newState);
            setScore(newScore);

            // Update high score if needed
            if (newScore > highScore) {
              setHighScore(newScore);
              updateHangmanHighScore(newScore);
            }
          }

          return newState;
        });
      }
    },
    [gameState.gameStatus, highScore]
  );

  // Handle keyboard input
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Skip if focus is in an input field that's not our game input
      if (
        document.activeElement instanceof HTMLInputElement &&
        document.activeElement !== inputRef.current
      ) {
        return;
      }

      if (gameState.gameStatus !== 'playing') {
        // If game is over, space/enter starts a new game
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          resetGame();
        }
        return;
      }

      // For single-letter key presses, process as guesses
      if (e.key.length === 1 && /^[a-zA-Z]$/.test(e.key)) {
        makeGuess(e.key);
      }
    },
    [gameState.gameStatus, makeGuess, resetGame]
  );

  // Set up keyboard event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    // Auto-focus the game when it mounts
    if (containerRef.current) {
      containerRef.current.focus();
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Handle input field change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 0) {
      makeGuess(value[value.length - 1]);
      e.target.value = ''; // Clear after processing
    }
  };

  // Render hangman figure based on wrong guesses
  const renderHangman = () => {
    const { wrongGuesses } = gameState;
    const maxWrongGuesses = gameState.maxWrongGuesses;
    const isGameLost = gameState.gameStatus === 'lost';

    // Hangman figure parts
    const parts = [
      // Base - thicker with rounded ends
      <motion.line
        key="base"
        x1="10"
        y1="140"
        x2="90"
        y2="140"
        strokeWidth="5"
        strokeLinecap="round"
        stroke="currentColor"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      />,

      // Vertical post - thicker with rounded ends
      <motion.line
        key="post"
        x1="30"
        y1="20"
        x2="30"
        y2="140"
        strokeWidth="5"
        strokeLinecap="round"
        stroke="currentColor"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      />,

      // Horizontal beam
      <motion.line
        key="beam"
        x1="30"
        y1="20"
        x2="90"
        y2="20"
        strokeWidth="5"
        strokeLinecap="round"
        stroke="currentColor"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />,

      // Rope
      <motion.line
        key="rope"
        x1="90"
        y1="20"
        x2="90"
        y2="40"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="2 2"
        stroke="currentColor"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      />,

      // Head
      <motion.g
        key="head"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <circle cx="90" cy="50" r="10" fill="none" strokeWidth="2.5" stroke="currentColor" />
        {isGameLost && (
          <>
            {/* X eyes when game is lost */}
            <motion.path
              d="M85 47 L89 51 M89 47 L85 51"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            />
            <motion.path
              d="M91 47 L95 51 M95 47 L91 51"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            />
            {/* Sad mouth */}
            <motion.path
              d="M86 56 Q90 53 94 56"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            />
          </>
        )}
      </motion.g>,

      // Body
      <motion.line
        key="body"
        x1="90"
        y1="60"
        x2="90"
        y2="90"
        strokeWidth="2.5"
        strokeLinecap="round"
        stroke="currentColor"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      />,

      // Left arm
      <motion.path
        key="leftArm"
        d="M90 70 Q80 75 70 80"
        fill="none"
        strokeWidth="2.5"
        strokeLinecap="round"
        stroke="currentColor"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      />,

      // Right arm
      <motion.path
        key="rightArm"
        d="M90 70 Q100 75 110 80"
        fill="none"
        strokeWidth="2.5"
        strokeLinecap="round"
        stroke="currentColor"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.7 }}
      />,

      // Left leg
      <motion.path
        key="leftLeg"
        d="M90 90 Q80 105 70 120"
        fill="none"
        strokeWidth="2.5"
        strokeLinecap="round"
        stroke="currentColor"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.8 }}
      />,

      // Right leg
      <motion.path
        key="rightLeg"
        d="M90 90 Q100 105 110 120"
        fill="none"
        strokeWidth="2.5"
        strokeLinecap="round"
        stroke="currentColor"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.9 }}
      />,
    ];

    // Calculate how many parts to show based on wrong guesses ratio
    const partsToShow = Math.min(Math.ceil((wrongGuesses / maxWrongGuesses) * 10), parts.length);

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0, 255, 128, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 128, 0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* Hangman figure */}
        <svg
          width="160"
          height="160"
          viewBox="0 0 160 160"
          className={`relative z-10 ${
            gameState.gameStatus === 'lost'
              ? 'text-red-500/90 drop-shadow-[0_0_8px_rgba(255,0,0,0.3)]'
              : 'text-terminal-green/90 drop-shadow-[0_0_8px_rgba(0,255,128,0.2)]'
          }`}
        >
          <g transform="translate(10, 5)">{parts.slice(0, partsToShow)}</g>
        </svg>

        {/* Wrong guesses indicator */}
        <div className="absolute bottom-1 right-1 text-xs font-mono text-terminal-green/60">
          {wrongGuesses}/{maxWrongGuesses}
        </div>
      </div>
    );
  };

  // Format the word with spaces between characters
  const formatWord = (word: string) => {
    return word.split('').join(' ');
  };

  // Render keyboard with letter states
  const renderKeyboard = () => {
    const rows = [
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
      ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
    ];

    return (
      <div className="flex flex-col items-center gap-1 sm:gap-1.5 mt-3 sm:mt-4 w-full max-w-full overflow-hidden">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-0.5 sm:gap-1.5 justify-center w-full">
            {row.map((letter) => {
              // Determine letter state
              const upperLetter = letter.toUpperCase();
              const isGuessed = gameState.guessedLetters.includes(upperLetter);
              const isCorrect = isGuessed && gameState.word.toUpperCase().includes(upperLetter);
              const isIncorrect = isGuessed && !gameState.word.toUpperCase().includes(upperLetter);

              return (
                <motion.button
                  key={letter}
                  onClick={() => makeGuess(letter)}
                  disabled={isGuessed || gameState.gameStatus !== 'playing'}
                  className={`w-7 h-8 sm:w-8 sm:h-9 md:w-9 md:h-10 flex items-center justify-center font-mono text-xs sm:text-sm rounded-md
                    ${
                      isCorrect
                        ? 'bg-green-900/80 text-terminal-green border-terminal-green font-bold shadow-[0_0_8px_rgba(0,255,128,0.3)]'
                        : isIncorrect
                          ? 'bg-red-900/30 text-red-400 border-red-500/50 shadow-[0_0_5px_rgba(255,0,0,0.2)]'
                          : 'bg-terminal-black/70 text-terminal-green/90 border-terminal-green/40 hover:bg-terminal-green/10 hover:border-terminal-green/60'
                    } 
                    ${gameState.gameStatus !== 'playing' && !isGuessed ? 'opacity-40' : ''}
                    border transition-all duration-150`}
                  whileHover={
                    gameState.gameStatus === 'playing' && !isGuessed ? { scale: 1.05, y: -2 } : {}
                  }
                  whileTap={gameState.gameStatus === 'playing' && !isGuessed ? { scale: 0.95 } : {}}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.2,
                    delay: 0.03 * (rowIndex * 10 + row.indexOf(letter)),
                  }}
                >
                  {letter}
                </motion.button>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  // Get game status message
  const getStatusMessage = () => {
    const { gameStatus, word, wrongGuesses, maxWrongGuesses } = gameState;
    if (gameStatus === 'won') {
      return `You won!`;
    } else if (gameStatus === 'lost') {
      return `Game over!`;
    }

    // More dynamic message based on remaining guesses
    const remaining = maxWrongGuesses - wrongGuesses;
    if (remaining <= 2) {
      return `${remaining} ${remaining === 1 ? 'guess' : 'guesses'} left!`;
    }
    return `${remaining} guesses left`;
  };

  return (
    <ArcadeCabinet title="HANGMAN">
      <div
        ref={containerRef}
        className="flex flex-col items-center gap-2 sm:gap-3 relative w-full"
        tabIndex={0}
        aria-label="Hangman Game"
      >
        {/* Mobile-optimized header with Score and Status */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 px-1 sm:px-2">
          {/* Score Display - Simplified for mobile */}
          <div className="flex items-center gap-3 bg-terminal-black/60 rounded-md border border-terminal-green/30 px-2 py-1 sm:px-3 sm:py-1.5 shadow-inner w-full sm:w-auto">
            <div className="flex items-center gap-1 font-mono">
              <span className="text-terminal-green/70 text-xs sm:text-sm">SCORE</span>
              <span className="text-lg sm:text-xl text-terminal-green font-bold tabular-nums">
                {score}
              </span>
            </div>
            <div className="text-terminal-green/30 text-xs">|</div>
            <div className="flex items-center gap-1 font-mono">
              <span className="text-terminal-green/70 text-xs sm:text-sm">HIGH</span>
              <span className="text-lg sm:text-xl text-terminal-green/90 font-bold tabular-nums">
                {highScore}
              </span>
            </div>

            {/* Mobile-only status indicator */}
            <div className="ml-auto sm:hidden">
              <span
                className={`text-xs font-mono px-2 py-0.5 rounded-sm ${
                  gameState.gameStatus === 'lost'
                    ? 'text-red-400 bg-red-900/20 border border-red-500/30'
                    : gameState.maxWrongGuesses - gameState.wrongGuesses <= 2 &&
                        gameState.gameStatus === 'playing'
                      ? 'text-yellow-400 bg-yellow-900/10 border border-yellow-500/30'
                      : 'text-terminal-green bg-terminal-black/60 border border-terminal-green/30'
                }`}
              >
                {getStatusMessage()}
              </span>
            </div>
          </div>

          {/* Game Status - Desktop only */}
          <div
            className={`hidden sm:block text-right font-mono px-3 py-1.5 rounded-md border ${
              gameState.gameStatus === 'lost'
                ? 'text-red-400 border-red-500/30 bg-red-900/20'
                : gameState.maxWrongGuesses - gameState.wrongGuesses <= 2 &&
                    gameState.gameStatus === 'playing'
                  ? 'text-yellow-400 border-yellow-500/30 bg-yellow-900/10'
                  : 'text-terminal-green border-terminal-green/30 bg-terminal-black/60'
            }`}
          >
            {getStatusMessage()}
          </div>
        </div>

        {/* Game Content - Optimized for mobile */}
        <div className="flex flex-col md:flex-row w-full items-center justify-center gap-3 sm:gap-6 p-2 sm:p-4 bg-terminal-black/80 border border-terminal-green/40 rounded-md shadow-inner">
          {/* Hangman Drawing - Smaller on mobile */}
          <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-terminal-black/90 border border-terminal-green/30 rounded-md overflow-hidden">
            {renderHangman()}
          </div>

          {/* Word Display - Responsive sizing */}
          <div className="flex flex-col items-center gap-2 sm:gap-4 flex-1">
            <div className="relative w-full">
              {/* Decorative elements */}
              <div className="absolute -top-2 sm:-top-3 left-1/2 transform -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-terminal-green/30 to-transparent"></div>
              <div className="absolute -bottom-2 sm:-bottom-3 left-1/2 transform -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-terminal-green/30 to-transparent"></div>

              {/* Word display - Responsive text size */}
              <motion.div
                className="text-xl sm:text-2xl md:text-3xl font-mono tracking-wider py-2 sm:py-3 px-3 sm:px-6 bg-terminal-black/60 border border-terminal-green/20 rounded-md shadow-inner"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={gameState.maskedWord} // Re-animate when word changes
              >
                {formatWord(gameState.maskedWord)}
              </motion.div>
            </div>

            {/* Hidden Input for Mobile - Enhanced styling */}
            <div
              className={`relative mt-1 sm:mt-2 w-full max-w-xs ${isInputFocused ? 'mb-1 sm:mb-2' : ''}`}
              onClick={() => inputRef.current?.focus()}
            >
              <input
                ref={inputRef}
                type="text"
                className="opacity-0 absolute inset-0 w-full h-10"
                onChange={handleInputChange}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                aria-label="Type a letter"
                maxLength={1}
                autoCapitalize="off"
                disabled={gameState.gameStatus !== 'playing'}
              />
              {isInputFocused ? (
                <div className="text-terminal-green/80 text-xs sm:text-sm text-center bg-terminal-black/40 border border-terminal-green/30 rounded-md py-1 sm:py-2 px-2 sm:px-4">
                  Type a letter to guess
                </div>
              ) : (
                <div className="border border-dashed border-terminal-green/40 rounded-md py-1 sm:py-2 px-2 sm:px-4 text-terminal-green/70 text-xs sm:text-sm text-center bg-terminal-black/40 hover:bg-terminal-black/60 transition-colors">
                  Tap to type a letter
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Keyboard - Optimized for mobile */}
        {renderKeyboard()}

        {/* Game Over Overlay */}
        <AnimatePresence>
          {gameState.gameStatus !== 'playing' && (
            <motion.div
              className="absolute inset-0 bg-terminal-black/80 backdrop-blur-sm rounded-md z-10 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-terminal-black/95 border border-terminal-green/50 rounded-lg p-4 sm:p-6 max-w-xs flex flex-col items-center shadow-lg shadow-terminal-green/10"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', damping: 15 }}
              >
                <motion.div
                  className={`text-xl sm:text-2xl font-bold mb-2 sm:mb-3 ${gameState.gameStatus === 'won' ? 'text-terminal-green' : 'text-red-500'}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {gameState.gameStatus === 'won' ? 'YOU WON!' : 'GAME OVER'}
                </motion.div>

                <motion.div
                  className="text-terminal-green mb-1 sm:mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  The word was:
                </motion.div>

                <motion.div
                  className="text-xl sm:text-2xl font-mono tracking-wider text-terminal-green mb-3 sm:mb-4 border-b border-terminal-green/30 pb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {gameState.word}
                </motion.div>

                {gameState.gameStatus === 'won' && (
                  <motion.div
                    className="text-terminal-green/80 mb-3 sm:mb-4 bg-terminal-green/10 px-3 sm:px-4 py-1 sm:py-2 rounded-md border border-terminal-green/30"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Score: {score} points
                  </motion.div>
                )}

                <motion.button
                  onClick={resetGame}
                  className="px-4 py-2 border border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-terminal-black transition-colors font-mono text-base rounded-md"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  Play Again
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile-optimized Instructions and Controls */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 mt-1 px-1">
          {/* Instructions - Centered on mobile, left on desktop */}
          {gameState.gameStatus === 'playing' && (
            <div className="text-terminal-green/70 text-xs font-mono border border-terminal-green/20 bg-terminal-black/40 px-2 py-1 sm:px-3 sm:py-1.5 rounded-md w-full sm:w-auto text-center sm:text-left">
              Type or click letters to guess
            </div>
          )}

          {/* Game Control Buttons - Centered on mobile, right on desktop */}
          <button
            onClick={resetGame}
            className="px-4 py-1.5 border border-terminal-green text-terminal-green 
                     hover:bg-terminal-green hover:text-terminal-black transition-colors
                     font-mono text-sm rounded-md w-full sm:w-auto sm:ml-auto"
            aria-label={gameState.gameStatus === 'playing' ? 'Start new game' : 'Play again'}
          >
            {gameState.gameStatus === 'playing' ? 'New Game' : 'Play Again'}
          </button>
        </div>
      </div>
    </ArcadeCabinet>
  );
};

export default Hangman;
