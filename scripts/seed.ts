import postgres from "postgres";

const ALICE = [
  { title: "MDN Web Docs", url: "https://developer.mozilla.org", desc: "Web platform reference" },
  { title: "React docs", url: "https://react.dev", desc: "Official React documentation" },
  { title: "Next.js docs", url: "https://nextjs.org/docs", desc: "App Router guide" },
  { title: "TypeScript handbook", url: "https://www.typescriptlang.org/docs", desc: null },
  { title: "PostgreSQL manual", url: "https://www.postgresql.org/docs", desc: "SQL reference" },
  { title: "Redis docs", url: "https://redis.io/docs", desc: null },
  { title: "Tailwind CSS", url: "https://tailwindcss.com/docs", desc: "Utility classes" },
  { title: "Drizzle ORM", url: "https://orm.drizzle.team", desc: "Type-safe SQL" },
  { title: "NextAuth.js", url: "https://next-auth.js.org", desc: "Auth for Next.js" },
  { title: "Vercel", url: "https://vercel.com", desc: null },
  { title: "GitHub", url: "https://github.com", desc: "Where the code lives" },
  { title: "Stack Overflow", url: "https://stackoverflow.com", desc: null },
];

const BOB = [
  { title: "Hacker News", url: "https://news.ycombinator.com", desc: null },
  { title: "Kubernetes docs", url: "https://kubernetes.io/docs", desc: "Cluster orchestration" },
  { title: "Docker docs", url: "https://docs.docker.com", desc: null },
  { title: "AWS console", url: "https://console.aws.amazon.com", desc: "Cloud dashboard" },
  { title: "Terraform", url: "https://developer.hashicorp.com/terraform", desc: "IaC" },
  { title: "Prometheus", url: "https://prometheus.io/docs", desc: "Metrics" },
  { title: "Grafana", url: "https://grafana.com/docs", desc: "Dashboards" },
  { title: "Go docs", url: "https://go.dev/doc", desc: null },
  { title: "The Rust Book", url: "https://doc.rust-lang.org/book", desc: null },
  { title: "FastAPI", url: "https://fastapi.tiangolo.com", desc: "Python APIs" },
  { title: "Django docs", url: "https://docs.djangoproject.com", desc: null },
  { title: "nginx docs", url: "https://nginx.org/en/docs", desc: "Reverse proxy" },
];

async function seedUser(
  sql: postgres.Sql,
  userId: string,
  items: { title: string; url: string; desc: string | null }[]
) {
  // Stagger created_at by an hour each so ordering is deterministic; the last
  // item in the list is the newest.
  const base = Date.now() - 1000 * 60 * 60 * 24 * 20;
  for (let i = 0; i < items.length; i++) {
    const b = items[i];
    const createdAt = new Date(base + i * 60 * 60 * 1000);
    await sql`
      INSERT INTO bookmarks (user_id, title, url, description, created_at)
      VALUES (${userId}, ${b.title}, ${b.url}, ${b.desc}, ${createdAt})
    `;
  }
}

async function main() {
  const sql = postgres(process.env.DATABASE_URL!, { onnotice: () => {} });

  await sql`DELETE FROM bookmarks`;
  await seedUser(sql, "u_alice", ALICE);
  await seedUser(sql, "u_bob", BOB);

  await sql.end();
  console.log(
    `[seed] inserted ${ALICE.length} bookmarks for alice and ${BOB.length} for bob`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
