"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { signup } from "@/app/actions/auth";

export default function RegisterForm() {
  const [state, action, pending] = useActionState(signup, undefined);
  const [form, setForm] = useState({ email: "", name: "", password: "" });

  return (
    <div className="min-h-screen bg-cream flex">
      <div className="hidden lg:flex lg:w-1/2 bg-ink flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(201,168,76,0.08)_0%,_transparent_60%)]" />

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
            Your financial
            <br />
            future starts here.
          </h1>
          <p className="text-cream/50 text-lg leading-relaxed max-w-sm">
            Join customers who manage their loans and repayments in one place.
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
              Create an account
            </h2>
            <p className="text-ink/50 text-sm">
              Get started in less than a minute
            </p>
          </div>

          <form action={action} className="space-y-5">
            <div>
              <label className="label" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="John Doe"
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                className="input-field"
              />
              {state?.errors?.name && (
                <p className="text-danger text-sm mt-2">{state.errors.name[0]}</p>
              )}
            </div>

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
                placeholder="Minimum 8 characters"
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
