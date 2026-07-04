import { desc, eq, sql } from "drizzle-orm";
import { db } from "./db";
import { bookmarks } from "./schema";

export const PAGE_SIZE = Number(process.env.PAGE_SIZE ?? 5);

/** One page of a user's bookmarks, newest first. `page` is 1-based. */
export async function getBookmarksPage(userId: string, page: number) {
  const offset = page * PAGE_SIZE;

  return db
    .select()
    .from(bookmarks)
    .where(eq(bookmarks.userId, userId))
    .orderBy(desc(bookmarks.createdAt), desc(bookmarks.id))
    .limit(PAGE_SIZE)
    .offset(offset);
}

/** Total number of bookmarks for a user (used to compute the page count). */
export async function getTotalCount(userId: string): Promise<number> {
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(bookmarks)
    .where(eq(bookmarks.userId, userId));
  return row?.count ?? 0;
}
