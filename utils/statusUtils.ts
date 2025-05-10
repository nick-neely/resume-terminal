export function getFormattedTime(): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(new Date());
}

// Add status formatting helpers here as needed
export function formatWpm(wpm: number): string {
  return wpm > 0 ? `${wpm} wpm` : '';
}

export function getFormattedDirectory(path: string[]): string {
  return path.length === 0 ? '/' : '/' + path.join('/');
}

export function isValidCommand(input: string, availableCommands: Record<string, any>): boolean {
  const command = input.trim().split(' ')[0];
  return command in availableCommands;
}
