// Utility functions for Terminal component

export function filterAutocompleteMatches(options: string[], prefix: string) {
  return options.filter((name) => name.toLowerCase().startsWith(prefix.toLowerCase()));
}

export function shouldResetAutocomplete(
  options: string[],
  matches: string[],
  prefix: string,
  currentPrefix: string | null
) {
  return (
    options.length !== matches.length ||
    !options.every((v, i) => v === matches[i]) ||
    currentPrefix !== prefix
  );
}

export function getNextAutocompleteIndex(current: number | null, length: number) {
  if (length === 0) return null;
  return current === null ? 0 : (current + 1) % length;
}

export function updateInputWithMatch(inputParts: string[], match: string): string {
  inputParts[inputParts.length - 1] = match;
  return inputParts.join(' ');
}
