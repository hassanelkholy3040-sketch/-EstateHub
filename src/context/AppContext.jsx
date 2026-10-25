import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { properties, isValidProperty } from '../data/properties'
import { readLocalJson, writeLocalJson } from '../utils/localStorage'
import { insertUserProperty, sanitizeFavoriteIds, sanitizeUserProperties, toggleFavoriteId } from '../utils/appState'

const AppContext = createContext(null)
const FAVORITES_KEY = 'estatehub-favorites'
const CUSTOM_KEY = 'estatehub-custom-properties'
const BUILT_IN_IDS = new Set(properties.map((item) => item.id))

export function AppProvider({ children }) {
  const [customProperties, setCustomProperties] = useState(() => sanitizeUserProperties(readLocalJson(CUSTOM_KEY, []), isValidProperty, BUILT_IN_IDS))
  const [favorites, setFavorites] = useState(() => {
    const validIds = new Set([...properties, ...customProperties].map((item) => item.id))
    return sanitizeFavoriteIds(readLocalJson(FAVORITES_KEY, []), validIds)
  })
  const allProperties = useMemo(() => [...customProperties, ...properties], [customProperties])
  const propertyRef = useRef(allProperties)
  const customRef = useRef(customProperties)
  const favoritesRef = useRef(favorites)
  propertyRef.current = allProperties
  customRef.current = customProperties
  favoritesRef.current = favorites

  const toggleFavorite = useCallback((id) => {
    const validIds = new Set(propertyRef.current.map((property) => property.id))
    const result = toggleFavoriteId(favoritesRef.current, id, validIds)
    if (!result.accepted) return false
    favoritesRef.current = result.favorites
    setFavorites(result.favorites)
    return writeLocalJson(FAVORITES_KEY, result.favorites)
  }, [])

  const clearFavorites = useCallback(() => {
    favoritesRef.current = []
    setFavorites([])
    return writeLocalJson(FAVORITES_KEY, [])
  }, [])

  const addProperty = useCallback((value) => {
    const next = insertUserProperty(customRef.current, value, isValidProperty, BUILT_IN_IDS)
    if (!next) return false
    customRef.current = next
    setCustomProperties(next)
    return writeLocalJson(CUSTOM_KEY, next)
  }, [])

  const value = useMemo(() => ({ properties: allProperties, favorites, toggleFavorite, clearFavorites, addProperty }), [allProperties, favorites, toggleFavorite, clearFavorites, addProperty])
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used inside AppProvider')
  return context
}
