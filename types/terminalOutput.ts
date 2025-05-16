// Base interface for all terminal output types
export interface BaseOutput {
  type: string;
}

// Grep output type
export interface GrepOutput extends BaseOutput {
  type: 'grep-output';
  matches: {
    path: string;
    content: string;
    line: string;
    keyword: string;
  }[];
}

// Grid output type (for ls command)
export interface GridOutput extends BaseOutput {
  type: 'grid-output';
  items: {
    name: string;
    type: 'file' | 'directory';
  }[];
}

// Command output type (for showing entered commands)
export interface CommandOutput extends BaseOutput {
  type: 'command-output';
  command: string;
}

// Plain text output type (fallback for simple text)
export interface TextOutput extends BaseOutput {
  type: 'text-output';
  content: string;
}

// Coffee output type (for the secret coffee command)
export interface CoffeeOutputType extends BaseOutput {
  type: 'coffee-output';
  duration?: number;
}

// System Meltdown output type (for rm -rf / easter egg)
export interface SystemMeltdownOutput extends BaseOutput {
  static: any;
  type: 'system-meltdown-output';
}

// Union type of all possible outputs
// Matrix output type (for matrix command)
export interface MatrixOutput extends BaseOutput {
  type: 'matrix-output';
  lines?: number;
  columns?: number;
  cancelled?: boolean;
}
// List output type (for multi-line text files)
export interface ListOutput extends BaseOutput {
  type: 'list-output';
  items: string[];
}

export interface GameOutput extends BaseOutput {
  type: 'game-output';
  game: 'tictactoe' | 'snake' | 'hangman';
  state?: TicTacToeState | SnakeState | HangmanState;
}

export interface TicTacToeState {
  board: ('X' | 'O' | null)[];
  currentPlayer: 'X' | 'O';
  winner?: 'X' | 'O' | 'draw';
}

export interface SnakeState {
  snake: { x: number; y: number }[];
  direction: 'up' | 'down' | 'left' | 'right';
  food: { x: number; y: number };
  score: number;
}

export interface HangmanState {
  word: string;
  guessedLetters: string[];
  remainingAttempts: number;
}

export type TerminalOutputType =
  | GrepOutput
  | GridOutput
  | ListOutput
  | CommandOutput
  | TextOutput
  | MatrixOutput
  | CoffeeOutputType
  | SystemMeltdownOutput
  | GameOutput;
