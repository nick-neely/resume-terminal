import {
  VFS,
  VFSNode,
  changeDirectory,
  getCurrentDirectory,
  listDirectory,
  readFile,
} from '@/utils/virtualFileSystem';

export type CommandParameter = {
  name: string;
  type: 'string' | 'number' | 'boolean';
  required: boolean;
  description: string;
};

export type CommandAction = (
  args: string[],
  vfs: VFS
) => Promise<{ output: string; updatedVfs: VFS }>;

export interface Command {
  name: string;
  description: string;
  usage: string;
  parameters: CommandParameter[];
  action: CommandAction;
}

export interface CommandRegistry {
  [key: string]: Command;
}

const commandHandlers = {
  coffee: async (_args: string[], vfs: VFS) => {
    // Secret coffee command: returns coffee-output for animation
    return {
      output: JSON.stringify({
        type: 'coffee-output',
        duration: 60000, // Updated duration to 60 seconds
      }),
      updatedVfs: vfs,
    };
  },
  matrix: async (args: string[], vfs: VFS) => {
    // Optionally allow user to specify lines/columns
    let lines = 12;
    let columns = 32;
    if (args.length === 2 && !isNaN(Number(args[0])) && !isNaN(Number(args[1]))) {
      lines = Math.max(4, Math.min(32, Number(args[0])));
      columns = Math.max(8, Math.min(64, Number(args[1])));
    }
    return {
      output: JSON.stringify({
        type: 'matrix-output',
        lines,
        columns,
      }),
      updatedVfs: vfs,
    };
  },
  tree: async (args: string[], vfs: VFS) => {
    if (args.length > 0) {
      return {
        output: 'Usage: tree',
        updatedVfs: vfs,
      };
    }

    const currentDir = getCurrentDirectory(vfs);
    let output = '/\n';

    const buildTree = (node: VFSNode, prefix: string, isLast: boolean) => {
      const pointer = isLast ? '└── ' : '├── ';
      output += prefix + pointer + node.name + (node.type === 'directory' ? '/' : '') + '\n';
      if (node.type === 'directory' && node.children) {
        const childEntries = Object.entries(node.children);
        childEntries.forEach(([_, child], idx) => {
          const lastChild = idx === childEntries.length - 1;
          buildTree(child, prefix + (isLast ? '    ' : '│   '), lastChild);
        });
      }
    };

    const entries = Object.entries(currentDir.children ?? {});
    entries.forEach(([_, node], idx) => {
      const isLast = idx === entries.length - 1;
      buildTree(node, '', isLast);
    });

    return {
      output: JSON.stringify({
        type: 'text-output',
        content: output.trimEnd(),
      }),
      updatedVfs: vfs,
    };
  },
  copy: async (args: string[], vfs: VFS) => {
    if (args.length !== 1) {
      return {
        output: 'Usage: copy <field> (where field is email, website, linkedin, or github)',
        updatedVfs: vfs,
      };
    }

    const field = args[0].toLowerCase();
    const contact = vfs.root.children?.personalInfo?.children?.contact?.children;

    if (!contact) {
      return {
        output: 'Contact information not found',
        updatedVfs: vfs,
      };
    }

    const fieldMap: { [key: string]: string } = {
      email: 'email.txt',
      website: 'website.txt',
      linkedin: 'linkedin.txt',
      github: 'github.txt',
    };

    const fieldName = fieldMap[field];
    if (!fieldName) {
      return {
        output: `Invalid field. Available fields: ${Object.keys(fieldMap).join(', ')}`,
        updatedVfs: vfs,
      };
    }

    const file = contact[fieldName];
    if (!file || file.type !== 'file' || !file.content) {
      return {
        output: `Field not found: ${field}`,
        updatedVfs: vfs,
      };
    }

    try {
      await navigator.clipboard.writeText(file.content);
      return {
        output: `Copied ${field} to clipboard`,
        updatedVfs: vfs,
      };
    } catch (error) {
      return {
        output: `Failed to copy to clipboard: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        updatedVfs: vfs,
      };
    }
  },
  help: async (args: string[], vfs: VFS) => {
    if (args.length === 0) {
      return {
        output: Object.values(commands)
          .map((cmd) => `${cmd.name}: ${cmd.description}`)
          .join('\n'),
        updatedVfs: vfs,
      };
    } else {
      const cmd = commands[args[0]];
      return {
        output: cmd
          ? `${cmd.name}: ${cmd.description}\nUsage: ${cmd.usage}`
          : `Unknown command: ${args[0]}`,
        updatedVfs: vfs,
      };
    }
  },

  about: async (_args: string[], vfs: VFS) => {
    return {
      output:
        'ResumeTerminal v1.0\nAn interactive command-line interface for exploring a personal resume.\nCreated with Next.js, React, and TypeScript.',
      updatedVfs: vfs,
    };
  },

  grep: async (args: string[], vfs: VFS) => {
    if (args.length !== 1) {
      return {
        output: 'Usage: grep <keyword>',
        updatedVfs: vfs,
      };
    }

    const keyword = args[0].toLowerCase();
    const currentDir = getCurrentDirectory(vfs);
    let matches: { path: string; content: string; line: string }[] = [];
    let anyMatches = false;

    // Helper function to recursively search files
    const searchFiles = (node: VFSNode, path: string[] = []) => {
      if (node.type === 'file' && node.content) {
        const content = node.content.toLowerCase();
        if (content.includes(keyword)) {
          const lines = node.content.split('\n');
          lines.forEach((line, index) => {
            if (line.toLowerCase().includes(keyword)) {
              matches.push({
                path: `${path.join('/')}/${node.name}`,
                content: line,
                line: `Line ${index + 1}`,
              });
              anyMatches = true;
            }
          });
        }
      } else if (node.type === 'directory' && node.children) {
        Object.entries(node.children).forEach(([name, child]) => {
          searchFiles(child, [...path, name]);
        });
      }
    };

    searchFiles(currentDir);

    if (!anyMatches) {
      return {
        output: `No matches found for '${keyword}'`,
        updatedVfs: vfs,
      };
    }

    // Format the output as a special JSON string that our Terminal component will recognize
    const grepData = {
      type: 'grep-output',
      matches: matches.map(({ path, content, line }) => ({
        path,
        content,
        line,
        keyword,
      })),
    };

    return {
      output: JSON.stringify(grepData),
      updatedVfs: vfs,
    };
  },

  cd: async (args: string[], vfs: VFS) => {
    try {
      // Handle 'cd..' as 'cd ..'
      const path = args[0] === 'cd..' ? '..' : args[0] || '/';
      const updatedVfs = changeDirectory(vfs, path);
      return {
        output: `Changed directory to /${updatedVfs.currentPath.join('/')}`,
        updatedVfs,
      };
    } catch (error) {
      return { output: (error as Error).message, updatedVfs: vfs };
    }
  },

  ls: async (_args: string[], vfs: VFS) => {
    try {
      const currentDir = getCurrentDirectory(vfs);
      const items = Object.entries(currentDir.children ?? {}).map(([name, node]) => ({
        name,
        type: node.type,
      }));
      return {
        output: JSON.stringify({
          type: 'grid-output',
          items,
        }),
        updatedVfs: vfs,
      };
    } catch (error) {
      return { output: (error as Error).message, updatedVfs: vfs };
    }
  },

  cat: async (args: string[], vfs: VFS) => {
    if (args.length === 0) {
      return { output: 'Usage: cat <filename>', updatedVfs: vfs };
    }

    try {
      const content = readFile(vfs, args[0]);
      if (content.includes('\n')) {
        // Multi-line: show as bulleted list
        return {
          output: JSON.stringify({
            type: 'list-output',
            items: content.split('\n').filter((line) => line.trim() !== ''),
          }),
          updatedVfs: vfs,
        };
      } else {
        // Single line: show as plain text
        return {
          output: JSON.stringify({
            type: 'text-output',
            content: content,
          }),
          updatedVfs: vfs,
        };
      }
    } catch (error) {
      return { output: (error as Error).message, updatedVfs: vfs };
    }
  },

  clear: async (_args: string[], vfs: VFS) => {
    return { output: 'CLEAR_TERMINAL', updatedVfs: vfs };
  },

  pwd: async (_args: string[], vfs: VFS) => {
    return { output: `/${vfs.currentPath.join('/')}`, updatedVfs: vfs };
  },
};

export const commands: CommandRegistry = {
  coffee: {
    name: 'coffee',
    description: '', // Secret: leave blank so it doesn't show in help
    usage: 'coffee',
    parameters: [],
    action: commandHandlers.coffee,
  },
  help: {
    name: 'help',
    description: 'Display information about available commands',
    usage: 'help [command]',
    parameters: [
      {
        name: 'command',
        type: 'string',
        required: false,
        description: 'Specific command to get help for',
      },
    ],
    action: async (args: string[], vfs: VFS) => {
      // Filter out secret commands (like coffee) from help
      const filteredCommands = Object.values(commands).filter(
        (cmd) => cmd.name !== 'coffee' && cmd.description !== ''
      );
      if (args.length === 0) {
        return {
          output: filteredCommands.map((cmd) => `${cmd.name}: ${cmd.description}`).join('\n'),
          updatedVfs: vfs,
        };
      } else {
        const cmd = commands[args[0]];
        return {
          output:
            cmd && cmd.name !== 'coffee' && cmd.description !== ''
              ? `${cmd.name}: ${cmd.description}\nUsage: ${cmd.usage}`
              : `Unknown command: ${args[0]}`,
          updatedVfs: vfs,
        };
      }
    },
  },
  about: {
    name: 'about',
    description: 'Display information about this ResumeTerminal',
    usage: 'about',
    parameters: [],
    action: commandHandlers.about,
  },
  matrix: {
    name: 'matrix',
    description: 'Enter Matrix mode with green rain effect',
    usage: 'matrix [lines] [columns]',
    parameters: [
      {
        name: 'lines',
        type: 'number',
        required: false,
        description: 'Number of lines (default 12, min 4, max 32)',
      },
      {
        name: 'columns',
        type: 'number',
        required: false,
        description: 'Number of columns (default 32, min 8, max 64)',
      },
    ],
    action: commandHandlers.matrix,
  },
  cd: {
    name: 'cd',
    description: 'Change current directory',
    usage: 'cd <directory> | cd..',
    parameters: [
      {
        name: 'directory',
        type: 'string',
        required: true,
        description: 'The directory to change to',
      },
    ],
    action: commandHandlers.cd,
  },
  ls: {
    name: 'ls',
    description: 'List contents of current directory',
    usage: 'ls',
    parameters: [],
    action: commandHandlers.ls,
  },
  cat: {
    name: 'cat',
    description: 'Display file contents',
    usage: 'cat <file>',
    parameters: [
      {
        name: 'file',
        type: 'string',
        required: true,
        description: 'The file to display',
      },
    ],
    action: commandHandlers.cat,
  },
  clear: {
    name: 'clear',
    description: 'Clear the terminal screen',
    usage: 'clear',
    parameters: [],
    action: commandHandlers.clear,
  },
  pwd: {
    name: 'pwd',
    description: 'Print current working directory',
    usage: 'pwd',
    parameters: [],
    action: commandHandlers.pwd,
  },
  grep: {
    name: 'grep',
    description: 'Search for a specified pattern within files',
    usage: 'grep <keyword>',
    parameters: [
      {
        name: 'keyword',
        type: 'string',
        required: true,
        description: 'The search term to look for in files',
      },
    ],
    action: commandHandlers.grep,
  },
  tree: {
    name: 'tree',
    description: 'Display the directory structure in a tree format',
    usage: 'tree',
    parameters: [],
    action: commandHandlers.tree,
  },
  copy: {
    name: 'copy',
    description: 'Copy contact information to clipboard',
    usage: 'copy <field>',
    parameters: [
      {
        name: 'field',
        type: 'string',
        required: true,
        description: 'The field to copy (email, website, linkedin, github)',
      },
    ],
    action: commandHandlers.copy,
  },
};
