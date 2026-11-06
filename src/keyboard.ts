type ShortcutEvent = Pick<KeyboardEvent, 'key' | 'ctrlKey' | 'metaKey' | 'altKey' | 'shiftKey' | 'isComposing'>;

/** A modifier prevents a printable character alone from stealing focus. */
export function isSearchShortcut(event: ShortcutEvent): boolean {
  return !event.isComposing && event.key.toLowerCase() === 'k' && (event.ctrlKey || event.metaKey) && !event.altKey && !event.shiftKey;
}
