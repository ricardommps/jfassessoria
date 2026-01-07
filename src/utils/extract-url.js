export function extractUrl(text) {
  if (!text) return null;

  const match = text.match(/https?:\/\/[^\s]+/i);
  return match ? match[0] : null;
}
