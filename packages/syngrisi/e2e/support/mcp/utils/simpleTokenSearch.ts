import type { Data, SearchResult } from './types';

export const simpleTokenSearch = (data: Data, pattern: string): SearchResult[] => {
  const patternTokens = pattern
    .toLowerCase()
    .split(/\s+/)
    .filter((token) => token.length > 2);

  const results: SearchResult[] = [];

  data.files.forEach((file) => {
    file.steps.forEach((step) => {
      try {
        const regex = new RegExp(step.pattern, 'i');
        if (regex.test(pattern)) {
          results.push({
            pattern: step.pattern,
            description: step.description,
            file: file.fileName,
            line: step.line,
            score: 1,
            matchedTokens: ['exact match'],
          });
          return;
        }
      } catch {
        // ignore invalid regex patterns
      }

      const searchText = step.pattern.toLowerCase();
      const matchedTokens = patternTokens.filter((token) => searchText.includes(token));

      if (matchedTokens.length > 0) {
        results.push({
          pattern: step.pattern,
          description: step.description,
          file: file.fileName,
          line: step.line,
          score: matchedTokens.length / patternTokens.length,
          matchedTokens,
        });
      }
    });
  });

  return results.sort((a, b) => b.score - a.score);
};
