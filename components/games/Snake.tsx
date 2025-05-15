import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import ArcadeCabinet from '../ArcadeCabinet';
import { 
  SnakeGameState, SnakeDirection, SnakeSegment,
  initSnakeGameState, moveSnake, generateSnakeFood, getSnakeScore, changeSnakeDirection,
  getSnakeHighScore, updateSnakeHighScore
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
  
  // For tracking key presses and handling focus
  const lastKeyPressRef = useRef<string | null>(null);
  const gameGridRef = useRef<HTMLDivElement>(null);
  
  // Reset game
  const resetGame = useCallback(() => {
    setGameState(initSnakeGameState(GRID_WIDTH, GRID_HEIGHT));
    setIsGameActive(true);
    setScore(0);
    setGameSpeed(250);
  }, []);

  // Change snake direction (with validation)
  const changeDirection = useCallback((newDirection: SnakeDirection) => {
    if (!isGameActive) return;
    
    setGameState(prev => {
      // Use the utility function to prevent 180° turns
      const updatedState = changeSnakeDirection(prev, newDirection);
      return updatedState;
    });
  }, [isGameActive]);
  
  // Handle keyboard input for movement and game over actions
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Skip handling if focus is on an input or textarea element (terminal input)
    if (document.activeElement instanceof HTMLInputElement || 
        document.activeElement instanceof HTMLTextAreaElement) {
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
    if (isGameActive && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D'].includes(e.key)) {
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
  }, [isGameActive, changeDirection, resetGame]);

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
      setGameState(prevState => {
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
            setGameSpeed(prevSpeed => Math.max(60, prevSpeed - 10));
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
  
  // Reset high score and game
  const resetHighScore = () => {
    setHighScore(0);
    resetGame();
  };
  
  // Render game cells
  const renderGrid = () => {
    const { snake, food } = gameState;
    const cells = [];
    
    // Helper to check if a position is part of the snake
    const isSnakeSegment = (x: number, y: number): boolean => {
      return snake.some(segment => segment.x === x && segment.y === y);
    };
    
    // Helper to check if a position is the snake's head
    const isSnakeHead = (x: number, y: number): boolean => {
      return snake.length > 0 && snake[0].x === x && snake[0].y === y;
    };
    
    // Create grid cells
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        // Determine cell class based on its content
        // Base cell styles - darker background to create better contrast with snake
        let cellClass = "border-[0.5px] border-terminal-black/25 bg-terminal-black/30";
        
        if (isSnakeHead(x, y)) {
          cellClass = "border-2 border-terminal-green bg-terminal-green shadow-[0_0_6px_#00ff80] rounded-md relative overflow-hidden";
        } else if (isSnakeSegment(x, y)) {
          cellClass = "border border-terminal-green bg-terminal-green shadow-[0_0_3px_#00ff80] rounded relative overflow-hidden";
        } else if (food && food.x === x && food.y === y) {
          cellClass = "animate-pulse bg-yellow-300 border border-yellow-400 rounded-full shadow-[0_0_4px_#ffcc00]";
        }
        
        cells.push(
          <div
            key={`${x}-${y}`}
            className={cellClass}
            style={{
              gridColumnStart: x + 1,
              gridRowStart: y + 1,
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              ...(isSnakeHead(x, y) || isSnakeSegment(x, y) ? {
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 1.5px, rgba(0, 255, 128, 0.25) 1.5px, rgba(0, 255, 128, 0.25) 3px)'
              } : {})
            }}
          />
        );
      }
    }
    
    return cells;
  };
  
  // Game status message
  const status = isGameActive
    ? "Use arrow keys or WASD to play"
    : "Game Over";
  
  return (
    <ArcadeCabinet title="SNAKE">
      <div className="flex flex-col items-center gap-2">
        {/* Header with Score and Status */}
        <div className="w-full flex justify-between items-center gap-4 px-2">
          {/* Score Display */}
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

          {/* Game Status */}
          <div className="text-terminal-green font-mono text-right">
            <div>{status}</div>
            <div className="text-xs opacity-70">
              Level: {Math.floor(score / 5) + 1}
            </div>
          </div>
        </div>
        
        {/* Game Grid */}
        <div
          ref={gameGridRef}
          tabIndex={0}
          className="relative grid w-full border border-terminal-green/30 bg-terminal-black/70 rounded overflow-hidden shadow-inner focus:outline-none focus:ring-1 focus:ring-terminal-green/50"
          onFocus={(e) => e.currentTarget.focus()}
          style={{
            gridTemplateColumns: `repeat(${GRID_WIDTH}, ${CELL_SIZE}px)`,
            gridTemplateRows: `repeat(${GRID_HEIGHT}, ${CELL_SIZE}px)`,
            maxWidth: `${GRID_WIDTH * CELL_SIZE}px`,
            margin: '0 auto',
            backgroundImage: 'linear-gradient(rgba(0, 255, 128, 0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 128, 0.015) 1px, transparent 1px)',
            backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
            padding: '1px',
          }}
        >
          {renderGrid()}
          {!isGameActive && (
            <div className="absolute inset-0 flex items-center justify-center z-10 select-none">
              <div className="absolute inset-0 bg-terminal-black/80 backdrop-blur-sm rounded" />
              <div className="relative flex flex-col items-center justify-center p-6">
                <div className="text-2xl font-bold text-terminal-green drop-shadow mb-2">GAME OVER</div>
                <div className="text-lg text-terminal-green mb-1">Score: {score}</div>
                <button
                  onClick={resetGame}
                  className="mt-2 px-4 py-2 border border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-terminal-black font-mono text-base rounded transition-colors"
                >
                  Play Again
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Game Control Buttons */}
        <div className="flex flex-row items-center gap-3 mt-2">
          <button
            onClick={resetGame}
            className="px-4 py-2 border border-terminal-green text-terminal-green 
                     hover:bg-terminal-green hover:text-terminal-black transition-colors
                     font-mono text-sm rounded"
          >
            {isGameActive ? 'Restart Game' : 'New Game'}
          </button>

          {!isGameActive && (
            <button
              onClick={resetHighScore}
              className="px-4 py-1 border border-terminal-green/50 text-terminal-green/50
                       hover:border-terminal-green hover:text-terminal-green
                       transition-colors font-mono text-xs rounded"
            >
              Reset High Score
            </button>
          )}
        </div>
      </div>
    </ArcadeCabinet>
  );
};

export default Snake;
