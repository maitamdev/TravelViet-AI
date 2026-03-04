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
