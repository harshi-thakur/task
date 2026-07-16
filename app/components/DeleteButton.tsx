"use client";

import { useRouter } from "next/navigation";

export default function DeleteButton({ id }: { id: number }) {
  const router = useRouter();

  async function handleDelete() {
   const res = await fetch(`/api/bookmarks/${id}`, { method: "DELETE" });
    if(res.ok) router.refresh();  
  }

  return (
    <button
      onClick={handleDelete}
      className="text-xs font-medium text-red-600 hover:text-red-800"
    >
      Delete
    </button>
  );
}
