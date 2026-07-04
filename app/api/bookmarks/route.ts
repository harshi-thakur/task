import { db } from "@/lib/db";
import { bookmarks } from "@/lib/schema";

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, title, url, description } = body;

  if (!title || !url) {
    return Response.json(
      { error: "title and url are required" },
      { status: 400 }
    );
  }

  const [created] = await db
    .insert(bookmarks)
    .values({
      userId,
      title,
      url,
      description: description || null,
    })
    .returning();

  return Response.json(created, { status: 201 });
}
