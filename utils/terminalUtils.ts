// Utility functions for Terminal component

interface HandleAutocompleteParams {
  cyclingPrefix: string;
  options: string[];
  inputParts: string[];
  autocompleteOptions: string[];
  autocompletePrefix: string | null;
  autocompleteIndex: number | null;
  setAutocompleteOptions: (opts: string[]) => void;
  setAutocompleteIndex: (idx: number | null) => void;
  setAutocompletePrefix: (prefix: string) => void;
  setInput: (input: string) => void;
  setHasUsedTab: (used: boolean) => void;
}

export function handleAutocomplete({
  cyclingPrefix,
  options,
  inputParts,
  autocompleteOptions,
  autocompletePrefix,
  autocompleteIndex,
  setAutocompleteOptions,
  setAutocompleteIndex,
  setAutocompletePrefix,
  setInput,
  setHasUsedTab,
}: HandleAutocompleteParams) {
  const matches = filterAutocompleteMatches(options, cyclingPrefix);
  if (matches.length > 0) {
    if (
      shouldResetAutocomplete(autocompleteOptions, matches, cyclingPrefix, autocompletePrefix)
    ) {
      setAutocompleteOptions(matches);
      setAutocompleteIndex(0);
      setAutocompletePrefix(cyclingPrefix);
      setInput(updateInputWithMatch(inputParts, matches[0]));
      setHasUsedTab(true);
    } else {
      const nextIndex = getNextAutocompleteIndex(autocompleteIndex, matches.length);
      setAutocompleteIndex(nextIndex);
      setInput(updateInputWithMatch(inputParts, matches[nextIndex ?? 0]));
      setHasUsedTab(true);
    }
  }
}

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
