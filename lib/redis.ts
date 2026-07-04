import { createClient, type RedisClientType } from "redis";
import { eq, sql } from "drizzle-orm";
import { db } from "./db";
import { bookmarks } from "./schema";

// Reuse a single Redis connection across HMR reloads in dev.
const globalForRedis = globalThis as unknown as {
  redisClient?: RedisClientType;
};

async function getRedis(): Promise<RedisClientType> {
  if (!globalForRedis.redisClient) {
    const client: RedisClientType = createClient({ url: process.env.REDIS_URL });
    client.on("error", (err) => console.error("Redis error", err));
    await client.connect();
    globalForRedis.redisClient = client;
  }
  return globalForRedis.redisClient;
}

const countKey = (userId: string) => `bookmarks:count:${userId}`;

/**
 * Returns the number of bookmarks for a user, using Redis as a read-through cache
 * so we don't hit the database for the header badge on every page render.
 */
export async function getBookmarkCount(userId: string): Promise<number> {
  const redis = await getRedis();

  const cached = await redis.get(countKey(userId));
  if (cached !== null) return Number(cached);

  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(bookmarks)
    .where(eq(bookmarks.userId, userId));

  const count = row?.count ?? 0;
  await redis.set(countKey(userId), String(count));
  return count;
}
