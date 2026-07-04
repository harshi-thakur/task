import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bookmarks",
  description: "A tiny bookmarks manager",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
