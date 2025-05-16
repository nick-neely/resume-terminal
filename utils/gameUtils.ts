// TIC TAC TOE GAME UTILITIES
export type TicTacToeBoard = (string | null)[];

// Check if there's a winner in TicTacToe
export const getTicTacToeWinner = (board: TicTacToeBoard): string | null => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6], // Diagonals
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
  const openCorners = corners.filter((i) => board[i] === null);
  if (openCorners.length > 0) {
    return openCorners[Math.floor(Math.random() * openCorners.length)];
  }

  // Take any open side
  const sides = [1, 3, 5, 7];
  const openSides = sides.filter((i) => board[i] === null);
  if (openSides.length > 0) {
    return openSides[Math.floor(Math.random() * openSides.length)];
  }

  // Take any remaining open space
  const openSpaces = board.map((square, i) => (square === null ? i : -1)).filter((i) => i !== -1);
  return openSpaces[Math.floor(Math.random() * openSpaces.length)];
};

// Helper function to find a winning move for a given symbol in TicTacToe
const findTicTacToeWinningMove = (board: TicTacToeBoard, symbol: string): number => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6], // Diagonals
  ];

  for (const [a, b, c] of lines) {
    const squares = [board[a], board[b], board[c]];
    const symbolCount = squares.filter((s) => s === symbol).length;
    const nullCount = squares.filter((s) => s === null).length;

    if (symbolCount === 2 && nullCount === 1) {
      // Find the empty position
      if (board[a] === null) return a;
      if (board[b] === null) return b;
      if (board[c] === null) return c;
    }
  }

  return -1;
};

// SNAKE GAME UTILITIES
export type SnakeDirection = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

// High Score Constants
export const SNAKE_HIGH_SCORE_KEY = 'snake_high_score';

// Get the current high score from localStorage
export const getSnakeHighScore = (): number => {
  const score = localStorage.getItem(SNAKE_HIGH_SCORE_KEY);
  return score ? parseInt(score, 10) : 0;
};

// Update the high score in localStorage if the new score is higher
export const updateSnakeHighScore = (score: number): void => {
  const currentHighScore = getSnakeHighScore();
  if (score > currentHighScore) {
    localStorage.setItem(SNAKE_HIGH_SCORE_KEY, score.toString());
  }
};

export type SnakeSegment = {
  x: number;
  y: number;
};

export type SnakeGameState = {
  snake: SnakeSegment[];
  food: SnakeSegment | null;
  direction: SnakeDirection;
  gridSize: { width: number; height: number };
};

// Initialize a new snake game state
export const initSnakeGameState = (width: number, height: number): SnakeGameState => {
  // Start with a 3-segment snake in the middle of the grid
  const centerX = Math.floor(width / 2);
  const centerY = Math.floor(height / 2);

  return {
    snake: [
      { x: centerX, y: centerY }, // Head
      { x: centerX - 1, y: centerY }, // Body
      { x: centerX - 2, y: centerY }, // Tail
    ],
    food: generateSnakeFood(width, height, [
      { x: centerX, y: centerY },
      { x: centerX - 1, y: centerY },
      { x: centerX - 2, y: centerY },
    ]),
    direction: 'RIGHT',
    gridSize: { width, height },
  };
};

// Generate food at a random position (not on the snake)
export const generateSnakeFood = (
  width: number,
  height: number,
  snake: SnakeSegment[]
): SnakeSegment => {
  // Create a set of occupied positions for fast lookup elsewhere in the game
  const occupiedPositions = new Set(snake.map((segment) => `${segment.x},${segment.y}`));

  // Create an array of all possible positions
  const allPositions: SnakeSegment[] = [];
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      allPositions.push({ x, y });
    }
  }

  // Filter out positions occupied by the snake
  const availablePositions = allPositions.filter(
    (pos) => !occupiedPositions.has(`${pos.x},${pos.y}`)
  );

  if (availablePositions.length === 0) {
    throw new Error('No available positions for food. The snake might be filling the entire grid.');
  }

  // Randomly pick one available position
  return availablePositions[Math.floor(Math.random() * availablePositions.length)];
};

// Move the snake in the current direction
export const moveSnake = (state: SnakeGameState): SnakeGameState => {
  const { snake, direction, food, gridSize } = state;
  const head = snake[0];

  // Calculate new head position based on direction
  let newHead: SnakeSegment;
  switch (direction) {
    case 'UP':
      newHead = { x: head.x, y: head.y - 1 };
      break;
    case 'DOWN':
      newHead = { x: head.x, y: head.y + 1 };
      break;
    case 'LEFT':
      newHead = { x: head.x - 1, y: head.y };
      break;
    case 'RIGHT':
      newHead = { x: head.x + 1, y: head.y };
      break;
  }

  // Check if snake hit a wall
  if (
    newHead.x < 0 ||
    newHead.x >= gridSize.width ||
    newHead.y < 0 ||
    newHead.y >= gridSize.height
  ) {
    return { ...state, snake: [] }; // Return empty snake to indicate game over
  }

  // Check if snake hit itself
  if (snake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
    return { ...state, snake: [] }; // Return empty snake to indicate game over
  }

  // Create new snake array with new head
  const newSnake = [newHead, ...snake];

  // Check if snake ate food
  let newFood = food;
  if (food && newHead.x === food.x && newHead.y === food.y) {
    // Generate new food
    newFood = generateSnakeFood(gridSize.width, gridSize.height, newSnake);
  } else {
    // Remove tail if didn't eat food
    newSnake.pop();
  }

  return {
    ...state,
    snake: newSnake,
    food: newFood,
  };
};

// Change the snake's direction (prevent 180° turns)
export const changeSnakeDirection = (
  state: SnakeGameState,
  newDirection: SnakeDirection
): SnakeGameState => {
  const { direction } = state;

  // Prevent 180° turns
  if (
    (direction === 'UP' && newDirection === 'DOWN') ||
    (direction === 'DOWN' && newDirection === 'UP') ||
    (direction === 'LEFT' && newDirection === 'RIGHT') ||
    (direction === 'RIGHT' && newDirection === 'LEFT')
  ) {
    return state;
  }

  return { ...state, direction: newDirection };
};

// Calculate score based on snake length
export const getSnakeScore = (snake: SnakeSegment[]): number => {
  return snake.length - 3; // Initial snake has 3 segments
};

// HANGMAN GAME UTILITIES
export const HANGMAN_HIGH_SCORE_KEY = 'hangman_high_score';

// Hangman Game types
export type HangmanGameState = {
  word: string; // The word to guess
  maskedWord: string; // The word with _ for unguessed letters
  guessedLetters: string[]; // Letters that have been guessed
  wrongGuesses: number; // Number of incorrect guesses
  maxWrongGuesses: number; // Max number of wrong guesses allowed
  gameStatus: 'playing' | 'won' | 'lost'; // Current game status
};

// List of words for hangman game (terminal/programming themed)
export const hangmanWordList = [
  'terminal',
  'command',
  'function',
  'variable',
  'algorithm',
  'browser',
  'compiler',
  'keyboard',
  'interface',
  'network',
  'database',
  'client',
  'server',
  'website',
  'protocol',
  'response',
  'request',
  'component',
  'module',
  'library',
  'framework',
  'javascript',
  'typescript',
  'react',
  'node',
  'frontend',
  'backend',
  'fullstack',
  'developer',
  'engineer',
  'syntax',
  'memory',
  'binary',
  'boolean',
  'integer',
  'string',
  'array',
  'object',
  'class',
  'method',
];

// Get the current high score from localStorage
export const getHangmanHighScore = (): number => {
  const score = localStorage.getItem(HANGMAN_HIGH_SCORE_KEY);
  return score ? parseInt(score, 10) : 0;
};

// Update the high score in localStorage if the new score is higher
export const updateHangmanHighScore = (score: number): void => {
  const currentHighScore = getHangmanHighScore();
  if (score > currentHighScore) {
    localStorage.setItem(HANGMAN_HIGH_SCORE_KEY, score.toString());
  }
};

// Calculate score for hangman (more points for words with fewer wrong guesses)
export const calculateHangmanScore = (state: HangmanGameState): number => {
  if (state.gameStatus !== 'won') return 0;

  // Base points for winning
  const basePoints = 100;

  // Bonus for using fewer wrong guesses (percentage of remaining guesses)
  const wrongGuessRatio = state.wrongGuesses / state.maxWrongGuesses;
  const wrongGuessPenalty = Math.round(50 * wrongGuessRatio);

  // Bonus for word length
  const wordLengthBonus = state.word.length * 5;

  return basePoints + wordLengthBonus - wrongGuessPenalty;
};

// Initialize a new hangman game
export const initHangmanGame = (): HangmanGameState => {
  // Select a random word from the word list
  const word = hangmanWordList[Math.floor(Math.random() * hangmanWordList.length)].toUpperCase();

  return {
    word,
    maskedWord: '_'.repeat(word.length),
    guessedLetters: [],
    wrongGuesses: 0,
    maxWrongGuesses: 6,
    gameStatus: 'playing',
  };
};

// Process a letter guess, update maskedWord and game status
export const processHangmanGuess = (state: HangmanGameState, letter: string): HangmanGameState => {
  // Uppercase for consistency
  const upperLetter = letter.toUpperCase();

  // If already guessed or game over, return current state
  if (state.guessedLetters.includes(upperLetter) || state.gameStatus !== 'playing') {
    return state;
  }

  // Add letter to guessed letters
  const newGuessedLetters = [...state.guessedLetters, upperLetter];

  // Check if letter is in the word
  const isCorrectGuess = state.word.includes(upperLetter);

  // Update wrong guesses if needed
  const newWrongGuesses = isCorrectGuess ? state.wrongGuesses : state.wrongGuesses + 1;

  // Update masked word to reveal correctly guessed letters
  let newMaskedWord = '';
  for (let i = 0; i < state.word.length; i++) {
    if (newGuessedLetters.includes(state.word[i])) {
      newMaskedWord += state.word[i];
    } else {
      newMaskedWord += '_';
    }
  }

  // Determine game status
  let newGameStatus: 'playing' | 'won' | 'lost' = state.gameStatus;
  if (newMaskedWord === state.word) {
    newGameStatus = 'won';
  } else if (newWrongGuesses >= state.maxWrongGuesses) {
    newGameStatus = 'lost';
  }

  return {
    ...state,
    guessedLetters: newGuessedLetters,
    wrongGuesses: newWrongGuesses,
    maskedWord: newMaskedWord,
    gameStatus: newGameStatus,
  };
};
