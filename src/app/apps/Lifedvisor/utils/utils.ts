export function isNullish(val: any | null | undefined): val is null|undefined {
  return (val === null) || (val === undefined);
}
