import React, { useState } from 'react';
import ArcadeCabinet from '../ArcadeCabinet';

type Player = 'X' | 'O';
type Board = (Player | null)[];

const TicTacToe: React.FC = () => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | 'Draw' | null>(null);

  const checkWinner = (squares: Board): Player | 'Draw' | null => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ];

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }

    if (squares.every((square) => square !== null)) {
      return 'Draw';
    }

    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
  };

  const renderSquare = (index: number) => {
    const value = board[index];
    return (
      <button
        onClick={() => handleClick(index)}
        className={`
          w-16 h-16 border border-terminal-green/30
          flex items-center justify-center
          text-2xl font-bold font-mono
          hover:bg-terminal-green/10 transition-colors
          ${value === 'X' ? 'text-terminal-green' : 'text-terminal-yellow'}
        `}
      >
        {value}
      </button>
    );
  };

  return (
    <ArcadeCabinet title="TIC TAC TOE">
      <div className="flex flex-col items-center gap-4">
        {/* Game Status */}
        <div className="text-terminal-green font-mono mb-2">
          {winner
            ? winner === 'Draw'
              ? "It's a draw!"
              : `Player ${winner} wins!`
            : `Current player: ${currentPlayer}`}
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-3 gap-1 bg-terminal-green/30 p-1 rounded">
          {Array(9)
            .fill(null)
            .map((_, i) => (
              <div key={i}>{renderSquare(i)}</div>
            ))}
        </div>

        {/* Reset Button */}
        <button
          onClick={resetGame}
          className="mt-4 px-4 py-2 border border-terminal-green text-terminal-green 
                   hover:bg-terminal-green hover:text-terminal-black transition-colors
                   font-mono text-sm rounded"
        >
          Reset Game
        </button>
      </div>
    </ArcadeCabinet>
  );
};

export default TicTacToe;
