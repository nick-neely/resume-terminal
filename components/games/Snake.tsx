'use client';

import type React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import ArcadeCabinet from '../ArcadeCabinet';
import {
  LucideArrowUp,
  LucideArrowDown,
  LucideArrowLeft,
  LucideArrowRight,

} from 'lucide-react';
import {
  type SnakeGameState,
  type SnakeDirection,
  initSnakeGameState,
  moveSnake,
  getSnakeScore,
  changeSnakeDirection,
  getSnakeHighScore,
  updateSnakeHighScore,
} from '../../utils/gameUtils';

const Snake: React.FC = () => {
  // Game grid size - optimize for terminal viewport
  const GRID_WIDTH = 20;
  const GRID_HEIGHT = 15;
  const CELL_SIZE = 18; // pixels

  // Game speed (milliseconds) - higher number = slower speed
  const [gameSpeed, setGameSpeed] = useState(250); // Starting slower for better player experience

  // Game state
  const [gameState, setGameState] = useState<SnakeGameState>(
    initSnakeGameState(GRID_WIDTH, GRID_HEIGHT)
  );
  const [isGameActive, setIsGameActive] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(getSnakeHighScore());
  const [isMobile, setIsMobile] = useState(false);

  // For tracking key presses and handling focus
  const lastKeyPressRef = useRef<string | null>(null);
  const gameGridRef = useRef<HTMLDivElement>(null);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset game
  const resetGame = useCallback(() => {
    setGameState(initSnakeGameState(GRID_WIDTH, GRID_HEIGHT));
    setIsGameActive(true);
    setScore(0);
    setGameSpeed(250);
  }, []);

  // Change snake direction (with validation)
  const changeDirection = useCallback(
    (newDirection: SnakeDirection) => {
      if (!isGameActive) return;

      setGameState((prev) => {
        // Use the utility function to prevent 180° turns
        const updatedState = changeSnakeDirection(prev, newDirection);
        return updatedState;
      });
    },
    [isGameActive]
  );

  // Handle keyboard input for movement and game over actions
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Skip handling if focus is on an input or textarea element (terminal input)
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (!isGameActive) {
        // Allow pressing Space or Enter to restart game
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          resetGame();
          return;
        }
      }
      // Prevent default actions for arrow keys and WASD
      if (
        isGameActive &&
        [
          'ArrowUp',
          'ArrowDown',
          'ArrowLeft',
          'ArrowRight',
          'w',
          'a',
          's',
          'd',
          'W',
          'A',
          'S',
          'D',
        ].includes(e.key)
      ) {
        e.preventDefault();
        // Change snake direction based on key
        switch (e.key.toLowerCase()) {
          case 'arrowup':
          case 'w':
            changeDirection('UP');
            break;
          case 'arrowdown':
          case 's':
            changeDirection('DOWN');
            break;
          case 'arrowleft':
          case 'a':
            changeDirection('LEFT');
            break;
          case 'arrowright':
          case 'd':
            changeDirection('RIGHT');
            break;
        }
      }
    },
    [isGameActive, changeDirection, resetGame]
  );

  // Add keyboard event listeners and handle auto-focus
  useEffect(() => {
    // Focus handling for keyboard input
    window.addEventListener('keydown', handleKeyDown, true); // true for capture phase

    // Auto-focus the game grid when the component mounts
    if (gameGridRef.current) {
      gameGridRef.current.focus();
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [handleKeyDown]);

  // Re-focus when the game state changes
  useEffect(() => {
    if (gameGridRef.current) {
      gameGridRef.current.focus();
    }
  }, [isGameActive]);

  // Update game state on each tick
  useEffect(() => {
    if (!isGameActive) return;

    const gameLoop = () => {
      setGameState((prevState) => {
        // Apply direction change if queued
        let newState = prevState;
        if (lastKeyPressRef.current) {
          newState = changeSnakeDirection(prevState, lastKeyPressRef.current as SnakeDirection);
          lastKeyPressRef.current = null;
        }

        // Move snake
        const updatedState = moveSnake(newState);

        // Check for game over
        if (updatedState.snake.length === 0) {
          setIsGameActive(false);
          return prevState; // Keep last valid state for display
        }

        // Update score
        const newScore = getSnakeScore(updatedState.snake);
        if (newScore > score) {
          setScore(newScore);
          if (newScore > highScore) {
            setHighScore(newScore);
            updateSnakeHighScore(newScore);
          }

          // Increase speed as snake grows
          if (newScore > 0 && newScore % 5 === 0) {
            setGameSpeed((prevSpeed) => Math.max(60, prevSpeed - 10));
          }
        }

        return updatedState;
      });
    };

    const gameInterval = setInterval(gameLoop, gameSpeed);
    return () => clearInterval(gameInterval);
  }, [isGameActive, score, highScore, gameSpeed]);

  // Set up keyboard event listeners
  useEffect(() => {
    // Add keyboard event listeners
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Render game cells
  const renderGrid = () => {
    const { snake, food } = gameState;
    const cells = [];

    // Helper to check if a position is part of the snake
    const isSnakeSegment = (x: number, y: number): boolean => {
      return snake.some((segment) => segment.x === x && segment.y === y);
    };

    // Helper to check if a position is the snake's head
    const isSnakeHead = (x: number, y: number): boolean => {
      return snake.length > 0 && snake[0].x === x && snake[0].y === y;
    };

    // Helper to get segment index (for gradient coloring)
    const getSegmentIndex = (x: number, y: number): number => {
      return snake.findIndex((segment) => segment.x === x && segment.y === y);
    };

    // Create grid cells
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        // Base cell styles - transparent background for better contrast
        let cellClass = 'bg-transparent';
        let cellStyle: React.CSSProperties = {};

        if (isSnakeHead(x, y)) {
          // Enhanced snake head with glow and better visibility
          cellClass = 'bg-terminal-green rounded-md relative overflow-hidden';
          cellStyle = {
            boxShadow: '0 0 8px rgba(0, 255, 128, 0.5), inset 0 0 4px rgba(255, 255, 255, 0.3)',
            border: '2px solid rgba(0, 255, 128, 0.9)',
          };
        } else if (isSnakeSegment(x, y)) {
          // Enhanced snake body with gradient based on position
          const segmentIndex = getSegmentIndex(x, y);
          const opacity = Math.max(0.5, 1 - segmentIndex * 0.03); // Fade slightly toward tail

          cellClass = 'bg-terminal-green rounded relative overflow-hidden';
          cellStyle = {
            boxShadow: `0 0 6px rgba(0, 255, 128, ${opacity * 0.3})`,
            border: `1.5px solid rgba(0, 255, 128, ${opacity * 0.8})`,
            backgroundColor: `rgba(0, 255, 128, ${opacity * 0.8})`,
          };
        } else if (food && food.x === x && food.y === y) {
          // Enhanced food with pulsing effect
          cellClass = 'rounded-full relative overflow-hidden';
          cellStyle = {
            backgroundColor: 'rgba(255, 204, 0, 0.9)',
            boxShadow: '0 0 8px rgba(255, 204, 0, 0.6), inset 0 0 4px rgba(255, 255, 255, 0.4)',
            border: '1.5px solid rgba(255, 220, 0, 0.9)',
          };
        }

        cells.push(
          <motion.div
            key={`${x}-${y}`}
            className={cellClass}
            initial={{ opacity: 1 }}
            animate={
              food && food.x === x && food.y === y
                ? {
                    scale: [1, 1.1, 1],
                    opacity: [0.8, 1, 0.8],
                  }
                : {}
            }
            transition={
              food && food.x === x && food.y === y
                ? {
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 1.5,
                  }
                : {}
            }
            style={{
              gridColumnStart: x + 1,
              gridRowStart: y + 1,
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              ...cellStyle,
            }}
          />
        );
      }
    }

    return cells;
  };

  // Mobile control button component
  const ControlButton = ({
    direction,
    icon,
  }: {
    direction: SnakeDirection;
    icon: React.ReactNode;
  }) => (
    <motion.button
      className="w-12 h-12 flex items-center justify-center bg-terminal-black/70 border border-terminal-green/50 rounded-full text-terminal-green/90 shadow-inner"
      whileTap={{ scale: 0.9, backgroundColor: 'rgba(0, 255, 128, 0.2)' }}
      onClick={() => changeDirection(direction)}
      aria-label={`Move ${direction.toLowerCase()}`}
    >
      {icon}
    </motion.button>
  );

  // Game status message
  const status = isGameActive ? '' : 'Game Over';

  return (
    <ArcadeCabinet title="SNAKE">
      <div className="flex flex-col items-center gap-1 sm:gap-2">
        {/* Header with Score and Status - Mobile Optimized */}
        {/* Mobile: Centered stacked score/high/level. Desktop: unchanged */}
        <div className="w-full">
          {isMobile ? (
            <div className="flex flex-col items-center w-full gap-0.5 px-1 pt-0.5">
              <div className="flex items-center justify-center gap-1 bg-terminal-black/50 rounded border border-terminal-green/30 px-2 py-0.5 w-fit mx-auto">
                <span className="text-terminal-green/70 text-[10px] font-mono">SCORE</span>
                <span className="text-base text-terminal-green font-bold tabular-nums">{score}</span>
                <span className="text-terminal-green/30 text-[10px]">|</span>
                <span className="text-terminal-green/70 text-[10px] font-mono">HIGH</span>
                <span className="text-base text-terminal-green/90 font-bold tabular-nums">{highScore}</span>
              </div>
              <div className="text-terminal-green/80 font-mono text-[11px] mt-0">Lvl: {Math.floor(score / 5) + 1}</div>
            </div>
          ) : (
            <div className="w-full flex flex-row justify-between items-center gap-4 px-2">
              <div className="flex items-center gap-4 bg-terminal-black/50 rounded border border-terminal-green/30 px-3 py-1.5">
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-terminal-green/70 text-sm">SCORE</span>
                  <span className="text-xl text-terminal-green font-bold tabular-nums">{score}</span>
                </div>
                <div className="text-terminal-green/30 text-xs">|</div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-terminal-green/70 text-sm">HIGH</span>
                  <span className="text-xl text-terminal-green/90 font-bold tabular-nums">{highScore}</span>
                </div>
              </div>
              <div className="text-terminal-green font-mono text-right">
                <div>{status}</div>
                <div className="text-xs opacity-70">Level: {Math.floor(score / 5) + 1}</div>
              </div>
            </div>
          )}
        </div>

        {/* Game Grid - Improved for better visibility and mobile scaling */}
        <div
          ref={gameGridRef}
          tabIndex={0}
          className="relative grid w-full border border-terminal-green/30 bg-terminal-black/90 rounded overflow-hidden shadow-inner focus:outline-none focus:ring-1 focus:ring-terminal-green/50"
          onFocus={(e) => e.currentTarget.focus()}
          style={{
            gridTemplateColumns: `repeat(${GRID_WIDTH}, ${CELL_SIZE}px)`,
            gridTemplateRows: `repeat(${GRID_HEIGHT}, ${CELL_SIZE}px)`,
            maxWidth: `${GRID_WIDTH * CELL_SIZE}px`,
            transform: isMobile ? 'scale(0.95)' : 'none', // Slightly scale down on mobile
            margin: '0 auto',
            // Softer grid lines with reduced opacity and subtle green tint
            backgroundImage: `
              linear-gradient(rgba(0, 255, 128, 0.03) 1px, transparent 1px), 
              linear-gradient(90deg, rgba(0, 255, 128, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
            padding: '1px',
          }}
        >
          {renderGrid()}
          {!isGameActive && (
            <div className="absolute inset-0 flex items-center justify-center z-10 select-none">
              <div className="absolute inset-0 bg-terminal-black/80 backdrop-blur-sm rounded" />
              <div className="relative flex flex-col items-center justify-center p-4 sm:p-6">
                <div className="text-xl sm:text-2xl font-bold text-terminal-green drop-shadow mb-1 sm:mb-2">
                  GAME OVER
                </div>
                <div className="text-base sm:text-lg text-terminal-green mb-1">Score: {score}</div>
                <button
                  onClick={resetGame}
                  className="mt-2 px-3 py-1.5 sm:px-4 sm:py-2 border border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-terminal-black font-mono text-sm sm:text-base rounded transition-colors"
                >
                  Play Again
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Controls or Desktop Instructions */}
        {isGameActive && (
          <>
            {isMobile ? (
              // Mobile touch controls
              <div className="mt-1 w-full flex flex-col items-center">
                {/* Top row - Up button */}
                <div className="mb-1">
                  <ControlButton direction="UP" icon={<LucideArrowUp size={20} />} />
                </div>

                {/* Middle row - Left and Right buttons */}
                <div className="flex items-center justify-center gap-6">
                  <ControlButton direction="LEFT" icon={<LucideArrowLeft size={20} />} />
                  <ControlButton direction="RIGHT" icon={<LucideArrowRight size={20} />} />
                </div>

                {/* Bottom row - Down button */}
                <div className="mt-1">
                  <ControlButton direction="DOWN" icon={<LucideArrowDown size={20} />} />
                </div>
              </div>
            ) : (
              // Desktop instructions
              <div className="mt-2 text-terminal-green/60 text-xs font-mono text-center opacity-70 select-none">
                Use <span className="font-bold">arrow keys</span> or{' '}
                <span className="font-bold">WASD</span> to play
              </div>
            )}
          </>
        )}


      </div>
    </ArcadeCabinet>
  );
};

export default Snake;
