import {
  VFS,
  changeDirectory,
  listDirectory,
  readFile,
} from "@/utils/virtualFileSystem";

export type CommandParameter = {
  name: string;
  type: "string" | "number" | "boolean";
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
  help: async (args: string[], vfs: VFS) => {
    if (args.length === 0) {
      return {
        output: Object.values(commands)
          .map((cmd) => `${cmd.name}: ${cmd.description}`)
          .join("\n"),
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
        "ResumeTerminal v1.0\nAn interactive command-line interface for exploring a personal resume.\nCreated with Next.js, React, and TypeScript.",
      updatedVfs: vfs,
    };
  },

  cd: async (args: string[], vfs: VFS) => {
    try {
      // Handle 'cd..' as 'cd ..'
      const path = args[0] === "cd.." ? ".." : args[0] || "/";
      const updatedVfs = changeDirectory(vfs, path);
      return {
        output: `Changed directory to /${updatedVfs.currentPath.join("/")}`,
        updatedVfs,
      };
    } catch (error) {
      return { output: (error as Error).message, updatedVfs: vfs };
    }
  },

  ls: async (_args: string[], vfs: VFS) => {
    try {
      const contents = listDirectory(vfs);
      return {
        output: contents.length > 0 ? contents.join("\n") : "Empty directory",
        updatedVfs: vfs,
      };
    } catch (error) {
      return { output: (error as Error).message, updatedVfs: vfs };
    }
  },

  cat: async (args: string[], vfs: VFS) => {
    if (args.length === 0) {
      return { output: "Usage: cat <filename>", updatedVfs: vfs };
    }

    try {
      const content = readFile(vfs, args[0]);
      return { output: content, updatedVfs: vfs };
    } catch (error) {
      return { output: (error as Error).message, updatedVfs: vfs };
    }
  },

  clear: async (_args: string[], vfs: VFS) => {
    return { output: "CLEAR_TERMINAL", updatedVfs: vfs };
  },

  pwd: async (_args: string[], vfs: VFS) => {
    return { output: `/${vfs.currentPath.join("/")}`, updatedVfs: vfs };
  },
};

export const commands: CommandRegistry = {
  help: {
    name: "help",
    description: "Display information about available commands",
    usage: "help [command]",
    parameters: [
      {
        name: "command",
        type: "string",
        required: false,
        description: "Specific command to get help for",
      },
    ],
    action: commandHandlers.help,
  },
  about: {
    name: "about",
    description: "Display information about this ResumeTerminal",
    usage: "about",
    parameters: [],
    action: commandHandlers.about,
  },
  cd: {
    name: "cd",
    description: "Change the current directory",
    usage: "cd [directory]",
    parameters: [
      {
        name: "directory",
        type: "string",
        required: false,
        description: 'Directory to change to. Use ".." to go up one level.',
      },
    ],
    action: commandHandlers.cd,
  },
  ls: {
    name: "ls",
    description: "List contents of the current directory",
    usage: "ls",
    parameters: [],
    action: commandHandlers.ls,
  },
  cat: {
    name: "cat",
    description: "Display the contents of a file",
    usage: "cat <filename>",
    parameters: [
      {
        name: "filename",
        type: "string",
        required: true,
        description: "Name of the file to display",
      },
    ],
    action: commandHandlers.cat,
  },
  clear: {
    name: "clear",
    description: "Clear the terminal screen",
    usage: "clear",
    parameters: [],
    action: commandHandlers.clear,
  },
  pwd: {
    name: "pwd",
    description: "Print current working directory",
    usage: "pwd",
    parameters: [],
    action: commandHandlers.pwd,
  },
};
