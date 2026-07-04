# Bookmarks — debugging exercise

A tiny bookmarks manager built with **Next.js 14 (App Router)**, **TypeScript**,
**NextAuth**, **Drizzle ORM + PostgreSQL**, and **Redis**. Users sign in, view a
paginated list of their bookmarks, and add or delete them.

It works... mostly. QA filed a handful of bug reports (below). Your job is to
**find and fix them**, and to talk through your reasoning as you go. We care far
more about *how* you diagnose each issue than about raw speed.

## Running it

If you opened this in the provided Codespace, everything is already installed and
the database is seeded. Just start the dev server:

```bash
npm run dev
```

Then open the forwarded **port 3000**.

**Sign in** with one of the demo accounts (password is `password` for both):

- `alice`
- `bob`

Useful commands:

```bash
npm run dev        # start the app
npm run db:reset   # wipe + reseed the database (handy while testing)
```

## Reported issues

1. **Duplicate bookmarks.** Adding a bookmark sometimes creates two identical
   copies.
2. **List doesn't update.** After adding or deleting a bookmark, the list on
   screen doesn't change until you manually reload the page.
3. **Wrong counter.** The "You have N bookmarks" badge is frequently wrong — it
   doesn't update after you add or delete, and can disagree with the page count.
4. **Missing / empty pages.** Some of your most recent bookmarks never show up on
   page 1, and the last page can be empty.

We're also interested in any **correctness, security, or quality** problems you
notice along the way, even if they aren't in the list above.

## Ground rules

- You may use whatever you'd normally use, including AI tools — just **share your
  screen and think out loud** so we can follow your reasoning.
- Fix the bugs in whatever order you like. If you get stuck, say so — hints are
  fine and don't count against you.
- Aim for correct, minimal fixes you can explain.

## Where things live

```
app/
  page.tsx                     home page (list + pagination + counter)
  login/page.tsx               sign-in
  components/                  AddBookmarkForm, DeleteButton, SignOutButton
  api/
    auth/[...nextauth]/        NextAuth handler
    bookmarks/route.ts         POST (create)
    bookmarks/[id]/route.ts    DELETE
lib/
  auth.ts                      NextAuth config + demo users
  db.ts                        Drizzle client
  schema.ts                    bookmarks table
  bookmarks.ts                 list + count queries
  redis.ts                     cached bookmark count
```
