import React, { useState, useEffect, useCallback } from 'react';
import ArcadeCabinet from '../ArcadeCabinet';
import { TicTacToeBoard, getTicTacToeWinner, getTicTacToeComputerMove } from '../../utils/gameUtils';

type Player = 'X' | 'O';
type Board = (Player | null)[];

const TicTacToe: React.FC = () => {
  const [squares, setSquares] = useState<TicTacToeBoard>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isPlayerFirst, setIsPlayerFirst] = useState(true);
  const [isGameActive, setIsGameActive] = useState(true);
  const [score, setScore] = useState({ player: 0, computer: 0 });

  const playerSymbol = isPlayerFirst ? 'X' : 'O';
  const computerSymbol = isPlayerFirst ? 'O' : 'X';

  const makeMove = useCallback((index: number, symbol: string) => {
    if (!isGameActive || squares[index]) return;

    const newSquares = squares.slice();
    newSquares[index] = symbol;
    setSquares(newSquares);

    const winner = getTicTacToeWinner(newSquares);
    if (winner || newSquares.every(square => square !== null)) {
      setIsGameActive(false);
      if (winner) {
        // Update score based on winner
        setScore(prev => ({
          player: prev.player + (winner === playerSymbol ? 1 : 0),
          computer: prev.computer + (winner === computerSymbol ? 1 : 0)
        }));
      }
    } else {
      setIsPlayerTurn(!isPlayerTurn);
    };
  }, [squares, isGameActive, isPlayerTurn, playerSymbol, computerSymbol]);

  useEffect(() => {
    // If it's computer's turn, make a move after a short delay
    if (!isPlayerTurn && isGameActive) {
      const delay = 400 + Math.floor(Math.random() * 500); // 400ms - 900ms
      const timer = setTimeout(() => {
        const computerMove = getTicTacToeComputerMove(squares, computerSymbol);
        makeMove(computerMove, computerSymbol);
      }, delay); // Add a variable delay to make it feel more natural

      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, squares, isGameActive, computerSymbol, makeMove]);

  const handleClick = (i: number) => {
    if (!isPlayerTurn || !isGameActive || squares[i]) return;
    makeMove(i, playerSymbol);
  };

  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setIsPlayerFirst(!isPlayerFirst); // Alternate who goes first
    setIsPlayerTurn(!isPlayerFirst); // Next game, computer starts if player was first
    setIsGameActive(true);
  };

  const resetScore = () => {
    setScore({ player: 0, computer: 0 });
    resetGame();
  };

  const winner = getTicTacToeWinner(squares);
  const status = winner
    ? `${winner === playerSymbol ? 'You win!' : 'Computer wins!'}`
    : squares.every((square) => square)
    ? 'Draw!'
    : `${isPlayerTurn ? 'Your turn' : 'Computer thinking...'}`;

  return (
    <ArcadeCabinet title="TIC TAC TOE">
      <div className="flex flex-col items-center gap-4">
        {/* Header with Score and Status */}
        <div className="w-full flex justify-between items-center gap-4 px-2">
          {/* Score Display */}
          <div className="flex items-center gap-4 bg-terminal-black/50 rounded border border-terminal-green/30 px-3 py-1.5">
            <div className="flex items-center gap-2 font-mono">
              <span className="text-terminal-green/70 text-sm">YOU</span>
              <span className="text-xl text-terminal-green font-bold tabular-nums">{score.player}</span>
            </div>
            <div className="text-terminal-green/30 text-xs">VS</div>
            <div className="flex items-center gap-2 font-mono">
              <span className="text-xl text-terminal-green/90 font-bold tabular-nums">{score.computer}</span>
              <span className="text-terminal-green/70 text-sm">CPU</span>
            </div>
          </div>

          {/* Game Status */}
          <div className="text-terminal-green font-mono text-right">
            <div>{status}</div>
            <div className="text-xs opacity-70">
              Playing as {playerSymbol}
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-3 gap-1 bg-terminal-green/30 p-1 rounded">
          {squares.map((square: string | null, i: number) => (
            <button
              key={i}
              onClick={() => handleClick(i)}
              disabled={!isPlayerTurn || !isGameActive || !!square}
              className={`
                w-16 h-16 border-2 
                ${square === playerSymbol ? 'border-terminal-green' : 'border-terminal-green/30'}
                flex items-center justify-center
                text-2xl font-bold font-mono
                ${!square && isPlayerTurn && isGameActive ? 'hover:bg-terminal-green/10' : ''}
                ${square === playerSymbol ? 'text-terminal-green' : 'text-terminal-green/70'}
                transition-colors duration-150
              `}
            >
              {square}
            </button>
          ))}
        </div>

        {/* Reset Button */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={resetGame}
            className="px-4 py-2 border border-terminal-green text-terminal-green 
                     hover:bg-terminal-green hover:text-terminal-black transition-colors
                     font-mono text-sm rounded"
          >
            {isGameActive ? 'Reset Game' : 'New Game'}
          </button>

          {!isGameActive && (
            <button
              onClick={resetScore}
              className="px-4 py-1 border border-terminal-green/50 text-terminal-green/50
                       hover:border-terminal-green hover:text-terminal-green
                       transition-colors font-mono text-xs rounded"
            >
              Reset Score
            </button>
          )}
        </div>
      </div>
    </ArcadeCabinet>
  );
};

export default TicTacToe;
