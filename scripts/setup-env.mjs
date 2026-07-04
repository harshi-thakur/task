import { writeFileSync } from "node:fs";

// Compute the public URL NextAuth should use. In GitHub Codespaces the app is
// reached through a forwarded *.app.github.dev URL; locally it's localhost.
const codespace = process.env.CODESPACE_NAME;
const domain =
  process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN || "app.github.dev";

const url = codespace
  ? `https://${codespace}-3000.${domain}`
  : "http://localhost:3000";

writeFileSync(".env.local", `NEXTAUTH_URL=${url}\n`);
console.log(`[setup-env] wrote .env.local  NEXTAUTH_URL=${url}`);
