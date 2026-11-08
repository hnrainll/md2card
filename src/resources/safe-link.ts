/** Return only browser navigation targets that cannot execute script URLs. */
export function safeLinkHref(value: string): string | undefined {
  const url = value.trim();
  if (!url || /[\u0000-\u001f\u007f]/.test(url)) return undefined;
  try {
    const parsed = new URL(url, 'https://md2card.invalid/');
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:' || parsed.protocol === 'mailto:') {
      return url;
    }
  } catch {
    // Invalid URLs stay as text instead of becoming clickable links.
  }
  return undefined;
}
