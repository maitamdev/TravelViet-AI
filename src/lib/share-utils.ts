export function generateShareUrl(slug: string): string {
  return window.location.origin + '/share/' + slug;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return true;
  }
}

export function shareViaWebShare(data: { title: string; text: string; url: string }): boolean {
  if (navigator.share) {
    navigator.share(data).catch(() => {});
    return true;
  }
  return false;
}
