export function generateShareUrl(slug: string): string {
  return window.location.origin + '/share/' + slug;
}
