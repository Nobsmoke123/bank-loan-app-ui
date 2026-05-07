"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { loginAction } from "@/app/actions/auth";

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);
  const [form, setForm] = useState({ email: "", password: "" });

  return (
    <div className="min-h-screen bg-cream flex">
      <div className="hidden lg:flex lg:w-1/2 bg-slate flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-8 h-8 bg-gold flex items-center justify-center">
            <span className="text-ink font-display font-bold">L</span>
          </div>
          <span className="font-display font-semibold text-xl text-cream tracking-tight">
            Loan App
          </span>
        </div>

        <div className="relative z-10">
          <div className="w-12 h-0.5 bg-gold mb-8" />
          <h1 className="font-display text-5xl text-cream leading-tight mb-6">
            Smart lending,
            <br />
            simplified.
          </h1>
          <p className="text-cream/50 text-lg leading-relaxed max-w-sm">
            Manage loan applications, track repayments, and process requests
            from a single dashboard.
          </p>
        </div>

        <div className="relative z-10 flex gap-8">
          {[
            ["2.4K+", "Loans Processed"],
            ["98%", "Approval Rate"],
            ["N2B+", "Disbursed"],
          ].map(([value, label]) => (
            <div key={label}>
              <div className="font-display text-2xl text-gold">{value}</div>
              <div className="text-cream/40 text-xs tracking-wide mt-1">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-in">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-slate flex items-center justify-center">
              <span className="text-cream font-display font-bold">L</span>
            </div>
            <span className="font-display font-semibold text-xl text-ink">
              Loan App
            </span>
          </div>

          <div className="mb-10">
            <div className="w-8 h-0.5 bg-gold mb-6" />
            <h2 className="font-display text-3xl text-ink mb-2">
              Welcome back
            </h2>
            <p className="text-ink/50 text-sm">Sign in to your account</p>
          </div>

          <form action={action} className="space-y-5">
            <div>
              <label className="label" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                className="input-field"
              />
              {state?.errors?.email && (
                <p className="text-danger text-sm mt-2">{state.errors.email[0]}</p>
              )}
            </div>

            <div>
              <label className="label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                value={form.password}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
                className="input-field"
              />
              {state?.errors?.password && (
                <p className="text-danger text-sm mt-2">
                  {state.errors.password[0]}
                </p>
              )}
            </div>

            {state?.message && (
              <div className="bg-danger/10 border border-danger/20 px-4 py-3 text-danger text-sm whitespace-pre-line">
                {state.message}
              </div>
            )}

            <button
              type="submit"
              disabled={pending}
              className="btn-primary w-full mt-2"
            >
              {pending ? (
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
            <Link
              href="/register"
              className="text-slate font-medium underline underline-offset-4"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
