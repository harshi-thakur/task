"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddBookmarkForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, title, url, description }),
    });

    setTitle("");
    setUrl("");
    setDescription("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 rounded-lg border border-gray-200 p-4 sm:flex-row sm:items-end"
    >
      <div className="flex flex-1 flex-col gap-1">
        <label className="text-xs font-medium text-gray-500">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Drizzle ORM docs"
          className="rounded border border-gray-300 px-2 py-1 text-sm"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <label className="text-xs font-medium text-gray-500">URL</label>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          placeholder="https://orm.drizzle.team"
          className="rounded border border-gray-300 px-2 py-1 text-sm"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <label className="text-xs font-medium text-gray-500">Description</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="optional"
          className="rounded border border-gray-300 px-2 py-1 text-sm"
        />
      </div>
      <button
        type="submit"
        className="rounded bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800"
      >
        Add bookmark
      </button>
    </form>
  );
}
