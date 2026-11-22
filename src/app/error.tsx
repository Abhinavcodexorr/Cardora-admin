"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <button onClick={reset} className="text-sm underline">
        Try again
      </button>
    </main>
  );
}
