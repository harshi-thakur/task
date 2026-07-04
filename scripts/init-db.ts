import postgres from "postgres";

async function main() {
  const sql = postgres(process.env.DATABASE_URL!, { onnotice: () => {} });

  // Wait for Postgres to accept connections (it may still be starting up).
  for (let i = 0; i < 20; i++) {
    try {
      await sql`select 1`;
      break;
    } catch {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  await sql`
    CREATE TABLE IF NOT EXISTS bookmarks (
      id serial PRIMARY KEY,
      user_id text NOT NULL,
      title text NOT NULL,
      url text NOT NULL,
      description text,
      created_at timestamp NOT NULL DEFAULT now()
    )
  `;

  await sql.end();
  console.log("[init-db] bookmarks table ready");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
