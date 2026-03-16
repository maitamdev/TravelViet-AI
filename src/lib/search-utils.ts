export function fuzzySearch(query: string, items: string[]): string[] {
  const lower = query.toLowerCase();
  return items.filter((item) => {
    const itemLower = item.toLowerCase();
    if (itemLower.includes(lower)) return true;
    let qi = 0;
    for (let i = 0; i < itemLower.length && qi < lower.length; i++) {
      if (itemLower[i] === lower[qi]) qi++;
    }
    return qi === lower.length;
  });
}

export function highlightMatch(text: string, query: string): string {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp("(" + escaped + ")", "gi");
  return text.replace(regex, "<mark>$1</mark>");
}


export function normalizeVietnamese(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export function searchScore(query: string, text: string): number {
  const q = query.toLowerCase(); const t = text.toLowerCase();
  if (t === q) return 100;
  if (t.startsWith(q)) return 90;
  if (t.includes(q)) return 70 + (q.length / t.length) * 20;
  let qi = 0; let score = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) { if (t[i] === q[qi]) { qi++; score += 10; } }
  return qi === q.length ? score : 0;
}

export function sortByRelevance<T>(items: T[], query: string, getText: (item: T) => string): T[] {
  return items.map(item => ({ item, score: searchScore(query, getText(item)) })).filter(r => r.score > 0).sort((a, b) => b.score - a.score).map(r => r.item);
}

export function buildSearchIndex<T>(items: T[], getFields: (item: T) => string[]): Map<string, Set<number>> {
  const index = new Map<string, Set<number>>();
  items.forEach((item, idx) => {
    getFields(item).forEach(field => {
      const words = field.toLowerCase().split(/\s+/);
      words.forEach(word => { if (!index.has(word)) index.set(word, new Set()); index.get(word)!.add(idx); });
    });
  });
  return index;
}