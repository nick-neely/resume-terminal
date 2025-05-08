import { getResumeData } from "./resumeParser";

type FileContent = string;

interface VFSNode {
  name: string;
  type: "file" | "directory";
  content?: FileContent;
  children?: { [name: string]: VFSNode };
}

interface VFS {
  root: VFSNode;
  currentPath: string[];
}

let initialVFS: VFS;

try {
  const parsedResume = getResumeData();
  if (!parsedResume) throw new Error("Failed to parse resume data");

  initialVFS = {
    root: {
      name: "/",
      type: "directory",
      children: {
        personalInfo: {
          name: "personalInfo",
          type: "directory",
          children: {
            "name.txt": {
              name: "name.txt",
              type: "file",
              content: parsedResume.personalInfo.name,
            },
            "title.txt": {
              name: "title.txt",
              type: "file",
              content: parsedResume.personalInfo.title,
            },
            contact: {
              name: "contact",
              type: "directory",
              children: Object.fromEntries(
                Object.entries(parsedResume.personalInfo.contact).map(
                  ([key, value]) => [
                    `${key}.txt`,
                    {
                      name: `${key}.txt`,
                      type: "file",
                      content: value || "",
                    },
                  ]
                )
              ),
            },
            ...(parsedResume.personalInfo.currentEmployer
              ? {
                  "currentEmployer.txt": {
                    name: "currentEmployer.txt",
                    type: "file",
                    content: parsedResume.personalInfo.currentEmployer,
                  },
                }
              : {}),
          },
        },
        "about.txt": {
          name: "about.txt",
          type: "file",
          content: parsedResume.about,
        },
        experience: {
          name: "experience",
          type: "directory",
          children: Object.fromEntries(
            parsedResume.experience.map((job, index) => [
              `${job.company.replace(/\s+/g, "_")}_${index + 1}`,
              {
                name: `${job.company.replace(/\s+/g, "_")}_${index + 1}`,
                type: "directory",
                children: {
                  "position.txt": {
                    name: "position.txt",
                    type: "file",
                    content: job.position,
                  },
                  "location.txt": {
                    name: "location.txt",
                    type: "file",
                    content: job.location,
                  },
                  "startDate.txt": {
                    name: "startDate.txt",
                    type: "file",
                    content: job.startDate,
                  },
                  "endDate.txt": {
                    name: "endDate.txt",
                    type: "file",
                    content: job.endDate,
                  },
                  "responsibilities.txt": {
                    name: "responsibilities.txt",
                    type: "file",
                    content: job.responsibilities.join("\n"),
                  },
                },
              },
            ])
          ),
        },
        skills: {
          name: "skills",
          type: "directory",
          children: {
            "technical.txt": {
              name: "technical.txt",
              type: "file",
              content: parsedResume.skills.technical.join(", "),
            },
            "soft.txt": {
              name: "soft.txt",
              type: "file",
              content: parsedResume.skills.soft.join(", "),
            },
          },
        },
        projects: {
          name: "projects",
          type: "directory",
          children: Object.fromEntries(
            parsedResume.projects.map((proj, index) => [
              `project${index + 1}.txt`,
              {
                name: `project${index + 1}.txt`,
                type: "file",
                content: `${proj.name}\n${proj.description}`,
              },
            ])
          ),
        },
        education: {
          name: "education",
          type: "directory",
          children: {
            "university.txt": {
              name: "university.txt",
              type: "file",
              content: parsedResume.education.university,
            },
            "certifications.txt": {
              name: "certifications.txt",
              type: "file",
              content: parsedResume.education.certifications.join("\n"),
            },
          },
        },
      },
    },
    currentPath: [],
  };
} catch (error) {
  console.error("Error parsing resume data:", error);
  // Gracefully handle parsing or validation errors
  initialVFS = {
    root: {
      name: "/",
      type: "directory",
      children: {},
    },
    currentPath: [],
  };
}

// Function to get the current directory
function getCurrentDirectory(vfs: VFS): VFSNode {
  let current = vfs.root;
  for (const dir of vfs.currentPath) {
    if (current.children && current.children[dir]) {
      current = current.children[dir];
    } else {
      throw new Error("Invalid path");
    }
  }
  return current;
}

// Function to resolve a path (handling '..' and '/')
function resolvePath(vfs: VFS, path: string): string[] {
  if (path === "/") {
    return [];
  }

  const parts = path.split("/").filter((part) => part !== "");
  const newPath = [...vfs.currentPath];

  for (const part of parts) {
    if (part === "..") {
      if (newPath.length > 0) {
        newPath.pop();
      }
    } else {
      newPath.push(part);
    }
  }

  return newPath;
}

// Function to change directory
function changeDirectory(vfs: VFS, path: string): VFS {
  const newPath = resolvePath(vfs, path);
  let current = vfs.root;

  for (const dir of newPath) {
    if (
      current.children &&
      current.children[dir] &&
      current.children[dir].type === "directory"
    ) {
      current = current.children[dir];
    } else {
      throw new Error(`Directory not found: ${path}`);
    }
  }

  return { ...vfs, currentPath: newPath };
}

// Function to list directory contents
function listDirectory(vfs: VFS): string[] {
  const currentDir = getCurrentDirectory(vfs);
  if (currentDir.type !== "directory" || !currentDir.children) {
    return [];
  }
  return Object.keys(currentDir.children);
}

// Function to read file contents
function readFile(vfs: VFS, filename: string): string {
  const currentDir = getCurrentDirectory(vfs);
  if (currentDir.type !== "directory" || !currentDir.children) {
    throw new Error("Not a directory");
  }
  const file = currentDir.children[filename];
  if (!file || file.type !== "file" || !file.content) {
    throw new Error(`File not found: ${filename}`);
  }
  return file.content;
}

export {
  changeDirectory,
  getCurrentDirectory,
  initialVFS,
  listDirectory,
  readFile,
};

export type {
  VFS,
  VFSNode,
};
