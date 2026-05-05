"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const result = loginUser(form.email, form.password);
    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Login failed");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-8 h-8 bg-gold flex items-center justify-center">
            <span className="text-ink font-display font-bold">L</span>
          </div>
          <span className="font-display font-semibold text-xl text-cream tracking-tight">LoanVault</span>
        </div>

        <div className="relative z-10">
          <div className="w-12 h-0.5 bg-gold mb-8" />
          <h1 className="font-display text-5xl text-cream leading-tight mb-6">
            Smart lending,<br />simplified.
          </h1>
          <p className="text-cream/50 text-lg leading-relaxed max-w-sm">
            Manage loan applications, track repayments, and process requests — all in one refined platform.
          </p>
        </div>

        <div className="relative z-10 flex gap-8">
          {[["2.4K+", "Loans Processed"], ["98%", "Approval Rate"], ["₦2B+", "Disbursed"]].map(([val, label]) => (
            <div key={label}>
              <div className="font-display text-2xl text-gold">{val}</div>
              <div className="text-cream/40 text-xs tracking-wide mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-slate flex items-center justify-center">
              <span className="text-cream font-display font-bold">L</span>
            </div>
            <span className="font-display font-semibold text-xl text-ink">LoanVault</span>
          </div>

          <div className="mb-10">
            <div className="w-8 h-0.5 bg-gold mb-6" />
            <h2 className="font-display text-3xl text-ink mb-2">Welcome back</h2>
            <p className="text-ink/50 text-sm">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-field"
              />
            </div>

            {error && (
              <div className="bg-danger/10 border border-danger/20 px-4 py-3 text-danger text-sm">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-cream/40 border-t-cream rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-ink/50">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-slate font-medium underline underline-offset-4">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
