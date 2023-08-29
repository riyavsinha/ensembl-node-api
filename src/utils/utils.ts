
export function booleanToInt(bool: boolean | undefined): number | undefined {
  return bool === undefined ? undefined : +bool;
}