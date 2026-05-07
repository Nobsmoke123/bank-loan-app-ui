import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-container min-h-screen flex items-center justify-center px-6 py-16">
      <div className="max-w-xl w-full bg-white border border-slate/10 p-8 text-center">
        <div className="w-10 h-0.5 bg-gold mx-auto mb-6" />
        <p className="text-sm tracking-[0.2em] uppercase text-ink/40 mb-3">
          404
        </p>
        <h1 className="font-display text-4xl text-ink mb-3">
          Page not found
        </h1>
        <p className="text-ink/50 mb-8">
          The page you requested could not be found, or the loan may no longer
          be available.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/loans" className="btn-primary">
            View loans
          </Link>
          <Link href="/dashboard" className="btn-outline">
            Go to dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
