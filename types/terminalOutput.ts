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

export type TerminalOutputType =
  | GrepOutput
  | GridOutput
  | ListOutput
  | CommandOutput
  | TextOutput
  | MatrixOutput;
