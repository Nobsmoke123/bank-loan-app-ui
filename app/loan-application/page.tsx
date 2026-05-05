"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, applyForLoan } from "@/lib/store";
import Navbar from "@/components/Navbar";

export default function LoanApplicationPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const [form, setForm] = useState({ amount: "", durationInMonths: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState<{ monthly: number; total: number } | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.replace("/login");
      return;
    }
    setUser(currentUser);
  }, [router]);

  useEffect(() => {
    const amount = parseFloat(form.amount);
    const months = parseInt(form.durationInMonths);
    if (amount > 0 && months > 0) {
      const monthlyRate = 0.12 / 12;
      const monthly = (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
      const total = monthly * months;
      setPreview({ monthly: Math.round(monthly * 100) / 100, total: Math.round(total * 100) / 100 });
    } else {
      setPreview(null);
    }
  }, [form.amount, form.durationInMonths]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    applyForLoan(user.id, user.name, user.email, parseFloat(form.amount), parseInt(form.durationInMonths));
    setSuccess(true);
    setLoading(false);
    setTimeout(() => router.push("/dashboard"), 2000);
  }

  if (!user) return null;

  if (success) {
    return (
      <div className="page-container">
        <Navbar userName={user.name} />
        <div className="max-w-lg mx-auto px-6 py-24 text-center animate-fade-in">
          <div className="w-16 h-16 bg-emerald flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-2xl">✓</span>
          </div>
          <h2 className="font-display text-3xl text-ink mb-3">Application Submitted</h2>
          <p className="text-ink/50">Your loan application has been received and is under review. Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  const durations = [3, 6, 12, 18, 24, 36, 48, 60];

  return (
    <div className="page-container">
      <Navbar userName={user.name} />

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-10 animate-fade-in">
          <div className="w-8 h-0.5 bg-gold mb-4" />
          <h1 className="font-display text-4xl text-ink">Loan Application</h1>
          <p className="text-ink/50 mt-2">Fill in the details below to submit your application</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Form */}
          <div className="lg:col-span-3 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="bg-white border border-slate/10 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="label">Loan Amount (₦)</label>
                  <input
                    type="number"
                    required
                    min="10000"
                    max="10000000"
                    step="1000"
                    placeholder="e.g. 500,000"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="input-field font-mono"
                  />
                  <p className="text-xs text-ink/40 mt-1.5">Min: ₦10,000 — Max: ₦10,000,000</p>
                </div>

                <div>
                  <label className="label">Duration (Months)</label>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {durations.map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setForm({ ...form, durationInMonths: String(d) })}
                        className={`py-2.5 text-sm font-mono border transition-colors ${
                          form.durationInMonths === String(d)
                            ? "bg-slate text-cream border-slate"
                            : "border-slate/20 text-ink/60 hover:border-slate/50 hover:text-ink"
                        }`}
                      >
                        {d}mo
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    required
                    min="1"
                    max="84"
                    placeholder="Or enter custom months"
                    value={form.durationInMonths}
                    onChange={(e) => setForm({ ...form, durationInMonths: e.target.value })}
                    className="input-field font-mono"
                  />
                </div>

                <button type="submit" disabled={loading} className="btn-gold w-full">
                  {loading ? (
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

          {/* Preview */}
          <div className="lg:col-span-2 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="bg-slate text-cream p-6 sticky top-6">
              <div className="text-xs tracking-widest uppercase text-cream/40 mb-5">Loan Preview</div>

              {preview ? (
                <div className="space-y-5">
                  <div>
                    <div className="text-cream/50 text-xs mb-1">Loan Amount</div>
                    <div className="font-mono text-2xl text-gold">₦{parseFloat(form.amount).toLocaleString()}</div>
                  </div>
                  <div className="w-full h-px bg-cream/10" />
                  <div>
                    <div className="text-cream/50 text-xs mb-1">Duration</div>
                    <div className="font-mono text-xl">{form.durationInMonths} months</div>
                  </div>
                  <div className="w-full h-px bg-cream/10" />
                  <div>
                    <div className="text-cream/50 text-xs mb-1">Interest Rate</div>
                    <div className="font-mono text-xl">12% p.a.</div>
                  </div>
                  <div className="w-full h-px bg-cream/10" />
                  <div>
                    <div className="text-cream/50 text-xs mb-1">Monthly Payment</div>
                    <div className="font-mono text-2xl text-gold">₦{preview.monthly.toLocaleString()}</div>
                  </div>
                  <div className="bg-cream/10 p-4">
                    <div className="text-cream/50 text-xs mb-1">Total Repayment</div>
                    <div className="font-mono text-xl">₦{preview.total.toLocaleString()}</div>
                    <div className="text-cream/30 text-xs mt-1">
                      Interest: ₦{(preview.total - parseFloat(form.amount)).toLocaleString()}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-cream/30 text-sm text-center py-10">
                  Enter an amount and duration to see a preview
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
