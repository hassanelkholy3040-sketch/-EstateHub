export function sanitizeUserProperties(value, isValidProperty, builtInIds) {
  if (!Array.isArray(value)) return []
  const seen = new Set()
  return value.filter((property) => {
    if (!isValidProperty(property) || builtInIds.has(property.id) || seen.has(property.id)) return false
    seen.add(property.id)
    return true
  })
}

export function sanitizeFavoriteIds(value, validIds) {
  if (!Array.isArray(value)) return []
  return [...new Set(value.filter((id) => typeof id === 'string' && validIds.has(id)))]
}

export function toggleFavoriteId(favorites, id, validIds) {
  if (!validIds.has(id)) return { accepted: false, favorites }
  return {
    accepted: true,
    favorites: favorites.includes(id) ? favorites.filter((favoriteId) => favoriteId !== id) : [...favorites, id],
  }
}

export function insertUserProperty(customProperties, property, isValidProperty, builtInIds) {
  if (!isValidProperty(property) || builtInIds.has(property.id) || customProperties.some((item) => item.id === property.id)) return null
  return [property, ...customProperties]
}

export function createUniquePropertyId(existingIds, createCandidate = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`) {
  let id
  do { id = `eh-user-${createCandidate()}` } while (existingIds.has(id))
  return id
}
