export function extractDescription(body: string, maxLen = 160): string | null {
  const lines = body.split('\n');
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith('#')) continue;
    if (line.startsWith('---')) continue;
    if (line.startsWith('|')) continue;
    if (line.startsWith('```')) continue;
    if (line.startsWith('!')) continue;
    if (/^\[[^\]]+\]\([^)]+\)$/.test(line)) continue;

    const clean = line
      .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/^[-*+]\s+/, '')
      .replace(/^>\s*/, '')
      .trim();

    if (clean.length < 30) continue;
    return clean.length > maxLen ? clean.slice(0, maxLen - 1) + '…' : clean;
  }
  return null;
}
