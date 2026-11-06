export type StorageRead = { ok: true; value: unknown } | { ok: false };

// Access is inside try/catch: even the localStorage getter can throw.
export function readStoredValue(key: string): StorageRead {
  try {
    const raw = window.localStorage.getItem(key);
    return { ok: true, value: raw === null ? null : JSON.parse(raw) as unknown };
  } catch {
    return { ok: false };
  }
}
export function writeStoredValue(key: string, value: unknown): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
