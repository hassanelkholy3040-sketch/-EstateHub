function getInternalSource(state) {
  const source = state?.from
  return typeof source === 'string' && source.startsWith('/') && !source.startsWith('//') ? source : '/properties'
}

export function getDetailBackTarget(state) {
  return getInternalSource(state)
}

export function getPropertiesTarget(state) {
  const source = getInternalSource(state)
  return source === '/properties' || source.startsWith('/properties?') ? source : '/properties'
}
