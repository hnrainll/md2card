/** Use the browser's local calendar date, rather than UTC. Empty means today. */
export function localDate(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function authorDate(value: string): string {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : localDate();
}
