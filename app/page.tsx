import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { getBookmarksPage, getTotalCount, PAGE_SIZE } from "@/lib/bookmarks";
import { getBookmarkCount } from "@/lib/redis";
import AddBookmarkForm from "@/app/components/AddBookmarkForm";
import DeleteButton from "@/app/components/DeleteButton";
import SignOutButton from "@/app/components/SignOutButton";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userId = session.user.id;
  const page = Math.max(1, Number(searchParams.page ?? "1") || 1);

  const [items, count, total] = await Promise.all([
    getBookmarksPage(userId, page),
    getBookmarkCount(userId),
    getTotalCount(userId),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Bookmarks</h1>
          <p className="text-sm text-gray-500">
            Signed in as {session.user.name}
            <span className="mx-2 text-gray-300">•</span>
            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">
              You have {count} bookmarks
            </span>
          </p>
        </div>
        <SignOutButton />
      </header>

      <div className="mb-8">
        <AddBookmarkForm userId={userId} />
      </div>

      <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
        {items.length === 0 && (
          <li className="p-4 text-sm text-gray-400">No bookmarks on this page.</li>
        )}
        {items.map((b) => (
          <li key={b.id} className="flex items-start justify-between gap-4 p-4">
            <div className="min-w-0">
              <a
                href={b.url}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-blue-700 hover:underline"
              >
                {b.title}
              </a>
              <div className="truncate text-xs text-gray-400">{b.url}</div>
              {b.description && (
                <p className="mt-1 text-sm text-gray-600">{b.description}</p>
              )}
            </div>
            <DeleteButton id={b.id} />
          </li>
        ))}
      </ul>

      <nav className="mt-4 flex items-center justify-between text-sm">
        <PageLink page={page - 1} disabled={page <= 1}>
          ← Previous
        </PageLink>
        <span className="text-gray-500">
          Page {page} of {totalPages}
        </span>
        <PageLink page={page + 1} disabled={page >= totalPages}>
          Next →
        </PageLink>
      </nav>
    </main>
  );
}

function PageLink({
  page,
  disabled,
  children,
}: {
  page: number;
  disabled: boolean;
  children: React.ReactNode;
}) {
  if (disabled) {
    return <span className="text-gray-300">{children}</span>;
  }
  return (
    <Link href={`/?page=${page}`} className="text-blue-700 hover:underline">
      {children}
    </Link>
  );
}
