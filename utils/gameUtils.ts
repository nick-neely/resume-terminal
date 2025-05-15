export type TicTacToeBoard = (string | null)[];

// Check if there's a winner in TicTacToe
export const getTicTacToeWinner = (board: TicTacToeBoard): string | null => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};

// Get computer's move in TicTacToe
export const getTicTacToeComputerMove = (board: TicTacToeBoard, computerSymbol: string): number => {
  const humanSymbol = computerSymbol === 'X' ? 'O' : 'X';
  
  // First, check for immediate win
  const winningMove = findTicTacToeWinningMove(board, computerSymbol);
  if (winningMove !== -1) return winningMove;
  
  // Then, check if we need to block opponent
  const blockingMove = findTicTacToeWinningMove(board, humanSymbol);
  if (blockingMove !== -1) return blockingMove;
  
  // If center is open, take it
  if (board[4] === null) return 4;
  
  // Try to take corners
  const corners = [0, 2, 6, 8];
  const openCorners = corners.filter(i => board[i] === null);
  if (openCorners.length > 0) {
    return openCorners[Math.floor(Math.random() * openCorners.length)];
  }
  
  // Take any open side
  const sides = [1, 3, 5, 7];
  const openSides = sides.filter(i => board[i] === null);
  if (openSides.length > 0) {
    return openSides[Math.floor(Math.random() * openSides.length)];
  }
  
  // Take any remaining open space
  const openSpaces = board.map((square, i) => square === null ? i : -1).filter(i => i !== -1);
  return openSpaces[Math.floor(Math.random() * openSpaces.length)];
};

// Helper function to find a winning move for a given symbol in TicTacToe
const findTicTacToeWinningMove = (board: TicTacToeBoard, symbol: string): number => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  for (const [a, b, c] of lines) {
    const squares = [board[a], board[b], board[c]];
    const symbolCount = squares.filter(s => s === symbol).length;
    const nullCount = squares.filter(s => s === null).length;
    
    if (symbolCount === 2 && nullCount === 1) {
      // Find the empty position
      if (board[a] === null) return a;
      if (board[b] === null) return b;
      if (board[c] === null) return c;
    }
  }
  
  return -1;
};
