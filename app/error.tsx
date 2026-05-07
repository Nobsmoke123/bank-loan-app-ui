"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
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
    <html lang="en">
      <body className="page-container">
        <main className="min-h-screen flex items-center justify-center px-6 py-16">
          <div className="max-w-xl w-full bg-white border border-slate/10 p-8 text-center">
            <div className="w-10 h-0.5 bg-gold mx-auto mb-6" />
            <h1 className="font-display text-4xl text-ink mb-3">
              Something went wrong
            </h1>
            <p className="text-ink/50 mb-8 whitespace-pre-line">
              {error.message || "We hit an unexpected problem while loading this page."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={reset} className="btn-primary">
                Try again
              </button>
              <Link href="/dashboard" className="btn-outline">
                Back to dashboard
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
