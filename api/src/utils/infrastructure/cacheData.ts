import redis from "src/utils/infrastructure/redis";

type DbFetchCallback<T> = () => Promise<T | null>;

export async function cacheData<T>(
  key: string,
  dbFetch: DbFetchCallback<T | null>,
  TTL: number = 30
): Promise<T | null> {
  const cached = await redis.get(key);

  if (cached) return cached === "null" ? null : JSON.parse(cached);

  const data = await dbFetch();

  if (!data) return null;

  await redis.set(key, JSON.stringify(data), {
    expiration: { type: "EX", value: TTL },
  });

  return data;
}
