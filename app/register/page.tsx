"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/store";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const result = registerUser(form.name, form.email, form.password);
    if (result.success) {
      router.push("/login");
    } else {
      setError(result.error || "Registration failed");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-ink flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(201,168,76,0.08)_0%,_transparent_60%)]" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-8 h-8 bg-gold flex items-center justify-center">
            <span className="text-ink font-display font-bold">L</span>
          </div>
          <span className="font-display font-semibold text-xl text-cream tracking-tight">
            LoanApp
          </span>
        </div>

        <div className="relative z-10">
          <div className="w-12 h-0.5 bg-gold mb-8" />
          <h1 className="font-display text-5xl text-cream leading-tight mb-6">
            Your financial
            <br />
            future starts here.
          </h1>
          <p className="text-cream/50 text-lg leading-relaxed max-w-sm">
            Join thousands of users who manage their loans and build financial
            confidence with LoanVault.
          </p>
        </div>

        <div className="relative z-10">
          <div className="flex gap-3">
            {["Fast approval", "Flexible terms", "Secure platform"].map(
              (tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1.5 border border-cream/20 text-cream/50 tracking-wide"
                >
                  {tag}
                </span>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-in">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-slate flex items-center justify-center">
              <span className="text-cream font-display font-bold">L</span>
            </div>
            <span className="font-display font-semibold text-xl text-ink">
              LoanApp
            </span>
          </div>

          <div className="mb-10">
            <div className="w-8 h-0.5 bg-gold mb-6" />
            <h2 className="font-display text-3xl text-ink mb-2">
              Create an account
            </h2>
            <p className="text-ink/50 text-sm">
              Get started in less than a minute
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Full Name</label>
              <input
                type="text"
                required
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field"
              />
            </div>

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
                placeholder="Min. 6 characters"
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

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-cream/40 border-t-cream rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-ink/50">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-slate font-medium underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
