export function mapVal<K extends string, V, mV>(
  rec: Record<K, V>,
  fn: (k: K, v: V) => mV
): Record<K, mV> {
  let result: Partial<Record<K, mV>> = {};
  for (const [k, v] of Object.entries(rec)) {
    const [key, value] = [k, v] as [K, V];
    const newValue = fn(key, value);
    result[key] = newValue;
  }
  return result as Record<K, mV>;
}
