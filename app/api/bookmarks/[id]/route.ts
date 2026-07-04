import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { bookmarks } from "@/lib/schema";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return Response.json({ error: "invalid id" }, { status: 400 });
  }

  await db.delete(bookmarks).where(eq(bookmarks.id, id));

  return Response.json({ ok: true });
}
