export const removeGherkinKeywords = (stepText: string): string => {
  if (!stepText) return '';
  const trimmed = stepText.trim();
  const keywords = ['Given', 'When', 'Then', 'And', 'But'];
  const match = keywords.find((keyword) => trimmed.startsWith(`${keyword} `));
  return match ? trimmed.substring(match.length + 1) : trimmed;
};
