import { Command, CommandRegistry } from '@/types/commands';
import { VFS } from './virtualFileSystem';

type ParsedCommand = {
  command: string;
  args: string[];
};

export function parseCommand(input: string): ParsedCommand {
  input = input.trim();

  // Special case for 'cd..'
  if (input.toLowerCase() === 'cd..') {
    return {
      command: 'cd',
      args: ['..'],
    };
  }

  const result: ParsedCommand = {
    command: '',
    args: [],
  };

  const regex = /[^\s"]+|"([^"]*)"/gi;
  let match;
  let index = 0;

  while ((match = regex.exec(input)) !== null) {
    const token = match[1] ? match[1] : match[0];

    if (index === 0) {
      result.command = token.toLowerCase();
    } else {
      result.args.push(token);
    }

    index++;
  }

  return result;
}

export function validateCommand(
  parsedCommand: ParsedCommand,
  commandRegistry: CommandRegistry
): boolean {
  return parsedCommand.command in commandRegistry;
}

export async function executeCommand(
  parsedCommand: ParsedCommand,
  commandRegistry: CommandRegistry,
  vfs: VFS
): Promise<{ output: string; updatedVfs: VFS }> {
  if (!validateCommand(parsedCommand, commandRegistry)) {
    return {
      output: `Error: '${parsedCommand.command}' is not a valid command. Type 'help' for a list of commands.`,
      updatedVfs: vfs,
    };
  }

  const command: Command = commandRegistry[parsedCommand.command];
  return await command.action(parsedCommand.args, vfs);
}
