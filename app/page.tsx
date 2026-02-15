import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-black text-white">
      <h1 className="text-4xl font-bold">Real-Time Poll App</h1>
      <Link
        href="/create"
        className="bg-white text-black px-6 py-3 rounded-lg"
      >
        Create a Poll
      </Link>
    </main>
  );
}
