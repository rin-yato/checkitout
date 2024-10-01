import { BookMarked } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex h-screen flex-col justify-center text-center">
      <h1 className="mb-10 text-5xl font-serif italic">Checkitout</h1>
      <Link
        href="/docs"
        className="text-fd-foreground bg-gray-100 text-lg rounded px-4 py-2 w-fit mx-auto flex items-center justify-center gap-x-2 hover:brightness-95"
      >
        See Documentation <BookMarked size={18} />
      </Link>
    </main>
  );
}
