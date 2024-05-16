export function parseQueryValueAsString(
  queryValue?: string | string[]
): string {
  if (Array.isArray(queryValue)) {
    return queryValue[0] ?? "";
  }
  return queryValue ?? "";
}
