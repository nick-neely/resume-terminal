export function getFormattedTime(): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(new Date());
}

export function getFormattedDirectory(path: string[]): string {
  return path.length === 0 ? "/" : "/" + path.join("/");
}
