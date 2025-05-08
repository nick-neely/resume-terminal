import {
  VFS,
  VFSNode,
  changeDirectory,
  listDirectory,
  readFile,
  getCurrentDirectory,
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
  copy: async (args: string[], vfs: VFS) => {
    if (args.length !== 1) {
      return {
        output:
          "Usage: copy <field> (where field is email, website, linkedin, or github)",
        updatedVfs: vfs,
      };
    }

    const field = args[0].toLowerCase();
    const contact =
      vfs.root.children?.personalInfo?.children?.contact?.children;

    if (!contact) {
      return {
        output: "Contact information not found",
        updatedVfs: vfs,
      };
    }

    const fieldMap: { [key: string]: string } = {
      email: "email.txt",
      website: "website.txt",
      linkedin: "linkedin.txt",
      github: "github.txt",
    };

    const fieldName = fieldMap[field];
    if (!fieldName) {
      return {
        output: `Invalid field. Available fields: ${Object.keys(fieldMap).join(
          ", "
        )}`,
        updatedVfs: vfs,
      };
    }

    const file = contact[fieldName];
    if (!file || file.type !== "file" || !file.content) {
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
          error instanceof Error ? error.message : "Unknown error"
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

  grep: async (args: string[], vfs: VFS) => {
    if (args.length !== 1) {
      return {
        output: "Usage: grep <keyword>",
        updatedVfs: vfs,
      };
    }

    const keyword = args[0].toLowerCase();
    const currentDir = getCurrentDirectory(vfs);
    let matches = "";
    let anyMatches = false;

    // Helper function to recursively search files
    const searchFiles = (node: VFSNode, path: string[] = []) => {
      if (node.type === "file" && node.content) {
        if (node.content.toLowerCase().includes(keyword)) {
          anyMatches = true;
          matches += `${path.join("/")}/${node.name}: ${node.content}\n`;
        }
      } else if (node.type === "directory" && node.children) {
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

    return {
      output: matches.trim(),
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
    description: "Change current directory",
    usage: "cd <directory> | cd..",
    parameters: [
      {
        name: "directory",
        type: "string",
        required: true,
        description: "The directory to change to",
      },
    ],
    action: commandHandlers.cd,
  },
  ls: {
    name: "ls",
    description: "List contents of current directory",
    usage: "ls",
    parameters: [],
    action: commandHandlers.ls,
  },
  cat: {
    name: "cat",
    description: "Display file contents",
    usage: "cat <file>",
    parameters: [
      {
        name: "file",
        type: "string",
        required: true,
        description: "The file to display",
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
  grep: {
    name: "grep",
    description: "Search for a specified pattern within files",
    usage: "grep <keyword>",
    parameters: [
      {
        name: "keyword",
        type: "string",
        required: true,
        description: "The search term to look for in files",
      },
    ],
    action: commandHandlers.grep,
  },
  copy: {
    name: "copy",
    description: "Copy contact information to clipboard",
    usage: "copy <field>",
    parameters: [
      {
        name: "field",
        type: "string",
        required: true,
        description: "The field to copy (email, website, linkedin, github)",
      },
    ],
    action: async (args: string[], vfs: VFS) => {
      if (args.length !== 1) {
        return {
          output:
            "Usage: copy <field> (where field is email, website, linkedin, or github)",
          updatedVfs: vfs,
        };
      }

      const field = args[0].toLowerCase();
      const contact =
        vfs.root.children?.personalInfo?.children?.contact?.children;

      if (!contact) {
        return {
          output: "Contact information not found",
          updatedVfs: vfs,
        };
      }

      const fieldMap: { [key: string]: string } = {
        email: "email.txt",
        website: "website.txt",
        linkedin: "linkedin.txt",
        github: "github.txt",
      };

      const fieldName = fieldMap[field];
      if (!fieldName) {
        return {
          output: `Invalid field. Available fields: ${Object.keys(
            fieldMap
          ).join(", ")}`,
          updatedVfs: vfs,
        };
      }

      const file = contact[fieldName];
      if (!file || file.type !== "file" || !file.content) {
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
            error instanceof Error ? error.message : "Unknown error"
          }`,
          updatedVfs: vfs,
        };
      }
    },
  },
};
