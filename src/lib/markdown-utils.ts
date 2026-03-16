// Markdown rendering utilities for chat and itinerary display
export function extractHeadings(markdown: string): { level: number; text: string; id: string }[] {
  const headings: { level: number; text: string; id: string }[] = [];
  const regex = /^(#{1,6})\s+(.+)$/gm;
  let match;
  while ((match = regex.exec(markdown)) !== null) {
    const text = match[2].trim();
    const id = text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
    headings.push({ level: match[1].length, text, id });
  }
  return headings;
}
export function extractLinks(markdown: string): { text: string; url: string }[] {
  const links: { text: string; url: string }[] = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  while ((match = regex.exec(markdown)) !== null) { links.push({ text: match[1], url: match[2] }); }
  return links;
}
export function extractCodeBlocks(markdown: string): { language: string; code: string }[] {
  const blocks: { language: string; code: string }[] = [];
  const regex = /```(\w*)\n([\s\S]*?)```/g;
  let match;
  while ((match = regex.exec(markdown)) !== null) { blocks.push({ language: match[1] || 'plaintext', code: match[2].trim() }); }
  return blocks;
}
export function countWords(markdown: string): number { const text = markdown.replace(/```[\s\S]*?```/g, '').replace(/[#*_~`\[\]()>|!-]/g, ''); return text.split(/\s+/).filter(Boolean).length; }
export function estimateReadingTime(markdown: string, wordsPerMinute = 200): number { return Math.max(1, Math.ceil(countWords(markdown) / wordsPerMinute)); }
export function stripMarkdown(markdown: string): string { return markdown.replace(/```[\s\S]*?```/g, '').replace(/[#*_~`\[\]()>|!]/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim(); }