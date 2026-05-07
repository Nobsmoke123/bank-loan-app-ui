"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { applyForLoanAction } from "@/app/actions/loans";
import type { Loan } from "@/lib/definitions";
import { formatCurrency } from "@/lib/format";

export default function LoanApplicationForm() {
  const router = useRouter();
  const [form, setForm] = useState({ amount: "", durationMonths: "" });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string[] | undefined>
  >({});
  const [preview, setPreview] = useState<{
    monthly: number;
    total: number;
  } | null>(null);
  const [submittedLoan, setSubmittedLoan] = useState<Loan | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const amount = Number(form.amount);
    const months = Number(form.durationMonths);

    if (amount > 0 && months > 0) {
      const monthlyRate = 0.12 / 12;
      const monthlyPayment =
        (amount *
          monthlyRate *
          Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);

      setPreview({
        monthly: Math.round(monthlyPayment * 100) / 100,
        total: Math.round(monthlyPayment * months * 100) / 100,
      });
      return;
    }

    setPreview(null);
  }, [form.amount, form.durationMonths]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setFieldErrors({});

    startTransition(async () => {
      const result = await applyForLoanAction({
        amount: Number(form.amount),
        durationMonths: Number(form.durationMonths),
      });

      if (!result.success) {
        setError(result.message);
        setFieldErrors(result.errors ?? {});
        return;
      }

      setSubmittedLoan(result.data);

      window.setTimeout(() => {
        router.push(`/loans/${result.data.id}`);
      }, 1400);
    });
  }

  if (submittedLoan) {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center animate-fade-in">
        <div className="w-16 h-16 bg-emerald flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-2xl">OK</span>
        </div>
        <h2 className="font-display text-3xl text-ink mb-3">
          Application Submitted
        </h2>
        <p className="text-ink/50">
          Your request for {formatCurrency(submittedLoan.amount)} has been sent.
          Opening the loan details now.
        </p>
      </div>
    );
  }

  const durations = [3, 6, 12, 18, 24, 36, 48, 60];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div
        className="lg:col-span-3 animate-fade-in"
        style={{ animationDelay: "0.1s" }}
      >
        <div className="bg-white border border-slate/10 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">Loan Amount (NGN)</label>
              <input
                type="number"
                required
                min="10000"
                max="10000000"
                step="1000"
                placeholder="e.g. 500000"
                value={form.amount}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    amount: event.target.value,
                  }))
                }
                className="input-field font-mono"
              />
              <p className="text-xs text-ink/40 mt-1.5">
                Min: N10,000 - Max: N10,000,000
              </p>
              {fieldErrors.amount && (
                <p className="text-danger text-sm mt-2">{fieldErrors.amount[0]}</p>
              )}
            </div>

            <div>
              <label className="label">Duration (Months)</label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {durations.map((duration) => (
                  <button
                    key={duration}
                    type="button"
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        durationMonths: String(duration),
                      }))
                    }
                    className={`py-2.5 text-sm font-mono border transition-colors ${
                      form.durationMonths === String(duration)
                        ? "bg-slate text-cream border-slate"
                        : "border-slate/20 text-ink/60 hover:border-slate/50 hover:text-ink"
                    }`}
                  >
                    {duration}mo
                  </button>
                ))}
              </div>
              <input
                type="number"
                required
                min="1"
                max="84"
                placeholder="Or enter custom months"
                value={form.durationMonths}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    durationMonths: event.target.value,
                  }))
                }
                className="input-field font-mono"
              />
              {fieldErrors.durationMonths && (
                <p className="text-danger text-sm mt-2">
                  {fieldErrors.durationMonths[0]}
                </p>
              )}
            </div>

            {error && (
              <div className="bg-danger/10 border border-danger/20 px-4 py-3 text-danger text-sm whitespace-pre-line">
                {error}
              </div>
            )}

            <button type="submit" disabled={isPending} className="btn-gold w-full">
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : (
                "Submit Application"
              )}
            </button>
          </form>
        </div>
      </div>

      <div
        className="lg:col-span-2 animate-fade-in"
        style={{ animationDelay: "0.2s" }}
      >
        <div className="bg-slate text-cream p-6 sticky top-6">
          <div className="text-xs tracking-widest uppercase text-cream/40 mb-5">
            Loan Preview
          </div>

          {preview ? (
            <div className="space-y-5">
              <div>
                <div className="text-cream/50 text-xs mb-1">Loan Amount</div>
                <div className="font-mono text-2xl text-gold">
                  {formatCurrency(form.amount)}
                </div>
              </div>
              <div className="w-full h-px bg-cream/10" />
              <div>
                <div className="text-cream/50 text-xs mb-1">Duration</div>
                <div className="font-mono text-xl">{form.durationMonths} months</div>
              </div>
              <div className="w-full h-px bg-cream/10" />
              <div>
                <div className="text-cream/50 text-xs mb-1">Interest Rate</div>
                <div className="font-mono text-xl">12% p.a.</div>
              </div>
              <div className="w-full h-px bg-cream/10" />
              <div>
                <div className="text-cream/50 text-xs mb-1">Estimated Monthly</div>
                <div className="font-mono text-2xl text-gold">
                  {formatCurrency(preview.monthly)}
                </div>
              </div>
              <div className="bg-cream/10 p-4">
                <div className="text-cream/50 text-xs mb-1">Estimated Total</div>
                <div className="font-mono text-xl">
                  {formatCurrency(preview.total)}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-cream/30 text-sm text-center py-10">
              Enter an amount and duration to see an estimate
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
