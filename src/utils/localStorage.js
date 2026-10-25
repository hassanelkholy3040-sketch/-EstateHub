export function readLocalJson(key, fallback) {
  try {
    const storage = globalThis.localStorage
    const raw = storage?.getItem(key)
    return raw == null || raw === '' ? fallback : JSON.parse(raw)
  } catch { return fallback }
}

export function writeLocalJson(key, value) {
  try {
    const storage = globalThis.localStorage
    if (!storage) return false
    storage.setItem(key, JSON.stringify(value))
    return true
  } catch { return false }
}
