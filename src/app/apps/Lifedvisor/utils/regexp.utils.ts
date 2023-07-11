const memoizedEscapedRegExp = new Map<string, string>()

export function escapeRegExp(string: string): string {
  let memoized = memoizedEscapedRegExp.get(string);
  if ( ! memoized ) {
    memoized = string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    memoizedEscapedRegExp.set(string, memoized)
  }
  return memoized
}
