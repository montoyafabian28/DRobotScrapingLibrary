export function normalizeString (stringToNormalize, optionalNormalizer = undefined) {
  let normalized = stringToNormalize.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
  normalized = normalized.toLocaleLowerCase().trim()
  if (optionalNormalizer) {
    normalized = optionalNormalizer(normalized)
  }
  return normalized
}
