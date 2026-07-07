// Shared form helpers.
//
// onboarding/page.tsx defined a generic toggleArr<T> and profile/me/page.tsx
// defined a string-typed toggleArr; the function bodies were identical and
// every call site passes a string[]. The generic version below subsumes both
// and preserves behavior exactly at all existing call sites.
export function toggleArr<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
}
