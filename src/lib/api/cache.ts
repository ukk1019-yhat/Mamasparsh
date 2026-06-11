const cache = new Map<string, { data: unknown; expiry: number }>();

export function withCache<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const entry = cache.get(key);
  if (entry && entry.expiry > now) {
    return Promise.resolve(entry.data as T);
  }
  return fn().then((data) => {
    cache.set(key, { data, expiry: now + ttlMs });
    return data;
  });
}
