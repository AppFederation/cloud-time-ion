export function trimToNull(str: string): string | null {
  if ( ! str ) {
    return null
  }
  const trimmed = str . trim()
  if ( trimmed === '' ) {
    return null
  }
  return str
}

export function isNullishOrWhitespace(str: string): boolean {
  return trimToNull(str) === null
}
