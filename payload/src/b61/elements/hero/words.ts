/** Hero > Changing words: "Learning, Missions, Athletics" (two to four, split on commas). */
export const splitWords = (v: unknown): string[] =>
  typeof v === 'string' ? v.split(',').map((w) => w.trim()).filter(Boolean).slice(0, 4) : []
