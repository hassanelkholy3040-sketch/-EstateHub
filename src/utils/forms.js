export function getFirstInvalidFieldId(errors, prefix) {
  const field = Object.keys(errors || {}).find((key) => Boolean(errors[key]))
  return field ? `${prefix}-${field}` : null
}
