import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Two demo accounts. Both use the password "password".
export const DEMO_USERS = [
  { id: "u_alice", username: "alice", name: "Alice", email: "alice@example.com" },
  { id: "u_bob", username: "bob", name: "Bob", email: "bob@example.com" },
];

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = DEMO_USERS.find((u) => u.username === credentials?.username);
        if (user && credentials?.password === "password") {
          return { id: user.id, name: user.name, email: user.email };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) session.user.id = token.id;
      return session;
    },
  },
  pages: { signIn: "/login" },
};
