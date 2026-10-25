export function validImageUrl(value) {
  try {
    const url = new URL(value)
    return ['https:', 'http:'].includes(url.protocol)
  } catch { return false }
}

export function validatePropertyDraft(form, t, currentYear = new Date().getFullYear()) {
  const errors = {}
  const message = (key) => t(`add.validation.${key}`)
  const required = ['titleEn', 'titleAr', 'descriptionEn', 'descriptionAr', 'cityEn', 'cityAr', 'neighborhoodEn', 'neighborhoodAr']
  required.forEach((key) => { if (!form[key]?.trim()) errors[key] = message('required') })
  ;['titleEn', 'titleAr'].forEach((key) => { if (form[key]?.trim() && form[key].trim().length < 3) errors[key] = message('titleLength') })
  ;['descriptionEn', 'descriptionAr'].forEach((key) => { if (form[key]?.trim() && form[key].trim().length < 20) errors[key] = message('descriptionLength') })

  if (!form.price || !Number.isFinite(Number(form.price)) || Number(form.price) <= 0) errors.price = message('positive')
  if (!form.area || !Number.isFinite(Number(form.area)) || Number(form.area) <= 0) errors.area = message('positive')
  ;['bedrooms', 'bathrooms'].forEach((key) => {
    if (form[key] === '' || !Number.isFinite(Number(form[key])) || Number(form[key]) < 0 || !Number.isInteger(Number(form[key]))) errors[key] = message('nonNegative')
  })
  if (form.yearBuilt && (!Number.isFinite(Number(form.yearBuilt)) || Number(form.yearBuilt) < 1900 || Number(form.yearBuilt) > currentYear + 5 || !Number.isInteger(Number(form.yearBuilt)))) errors.yearBuilt = message('year')
  if (form.mainImage && !validImageUrl(form.mainImage)) errors.mainImage = message('url')
  const extras = typeof form.extraImages === 'string' ? form.extraImages.split(',').map((item) => item.trim()).filter(Boolean) : []
  if (extras.some((url) => !validImageUrl(url))) errors.extraImages = message('url')
  if (form.agentEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.agentEmail)) errors.agentEmail = message('email')
  return errors
}
