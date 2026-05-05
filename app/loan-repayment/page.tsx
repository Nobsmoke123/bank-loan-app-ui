"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, getLoans, makeRepayment, type Loan } from "@/lib/store";
import Navbar from "@/components/Navbar";

export default function LoanRepaymentPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const [activeLoans, setActiveLoans] = useState<Loan[]>([]);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  function loadLoans(userId: string) {
    const all = getLoans();
    const active = all.filter((l) => l.userId === userId && l.status === "active");
    setActiveLoans(active);
    if (active.length > 0 && !selectedLoan) {
      setSelectedLoan(active[0]);
    }
  }

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.replace("/login");
      return;
    }
    setUser(currentUser);
    loadLoans(currentUser.id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  async function handleRepayment(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedLoan || !user) return;
    setError("");
    setSuccessMsg("");

    const payAmount = parseFloat(amount);
    if (isNaN(payAmount) || payAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const result = makeRepayment(selectedLoan.id, payAmount);
    if (result.success) {
      setSuccessMsg(`Payment of ₦${payAmount.toLocaleString()} recorded successfully!`);
      setAmount("");
      loadLoans(user.id);
      // Re-select updated loan
      const updatedLoans = getLoans();
      const updated = updatedLoans.find((l) => l.id === selectedLoan.id);
      setSelectedLoan(updated || null);
    } else {
      setError(result.error || "Payment failed");
    }
    setLoading(false);
  }

  if (!user) return null;

  const totalDue = selectedLoan
    ? selectedLoan.amount + selectedLoan.amount * 0.12 * (selectedLoan.durationInMonths / 12)
    : 0;
  const remaining = selectedLoan ? totalDue - selectedLoan.paidAmount : 0;
  const progress = selectedLoan ? (selectedLoan.paidAmount / totalDue) * 100 : 0;

  return (
    <div className="page-container">
      <Navbar userName={user.name} />

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-10 animate-fade-in">
          <div className="w-8 h-0.5 bg-gold mb-4" />
          <h1 className="font-display text-4xl text-ink">Loan Repayment</h1>
          <p className="text-ink/50 mt-2">Make payments towards your active loans</p>
        </div>

        {activeLoans.length === 0 ? (
          <div className="bg-white border border-slate/10 p-16 text-center animate-fade-in">
            <div className="text-5xl mb-5">🎉</div>
            <h2 className="font-display text-2xl text-ink mb-3">No active loans</h2>
            <p className="text-ink/40 mb-8">You don&apos;t have any active loans to repay right now.</p>
            <button
              onClick={() => router.push("/loan-application")}
              className="btn-primary"
            >
              Apply for a Loan
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Loan selector */}
            <div className="lg:col-span-2 space-y-3 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <h2 className="text-xs tracking-widest uppercase text-ink/50 font-medium mb-4">Select Loan</h2>
              {activeLoans.map((loan) => {
                const due = loan.amount + loan.amount * 0.12 * (loan.durationInMonths / 12);
                const rem = due - loan.paidAmount;
                const prog = (loan.paidAmount / due) * 100;
                const isSelected = selectedLoan?.id === loan.id;
                return (
                  <button
                    key={loan.id}
                    onClick={() => { setSelectedLoan(loan); setError(""); setSuccessMsg(""); }}
                    className={`w-full text-left p-5 border transition-all ${
                      isSelected
                        ? "border-slate bg-slate text-cream"
                        : "border-slate/10 bg-white hover:border-slate/30"
                    }`}
                  >
                    <div className={`text-xs tracking-widest uppercase mb-2 ${isSelected ? "text-cream/50" : "text-ink/40"}`}>
                      Loan #{loan.id.slice(-6).toUpperCase()}
                    </div>
                    <div className={`font-mono text-xl font-semibold mb-1 ${isSelected ? "text-gold" : "text-ink"}`}>
                      ₦{loan.amount.toLocaleString()}
                    </div>
                    <div className={`text-sm mb-3 ${isSelected ? "text-cream/60" : "text-ink/50"}`}>
                      {loan.durationInMonths}mo · ₦{rem.toLocaleString()} remaining
                    </div>
                    <div className={`w-full h-1 rounded-full ${isSelected ? "bg-cream/20" : "bg-slate/10"}`}>
                      <div
                        className={`h-full rounded-full transition-all ${isSelected ? "bg-gold" : "bg-emerald"}`}
                        style={{ width: `${prog}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Payment form */}
            <div className="lg:col-span-3 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              {selectedLoan && (
                <>
                  {/* Loan details */}
                  <div className="bg-white border border-slate/10 p-6 mb-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                      {[
                        { label: "Principal", value: `₦${selectedLoan.amount.toLocaleString()}` },
                        { label: "Monthly", value: `₦${selectedLoan.monthlyPayment.toLocaleString()}` },
                        { label: "Paid", value: `₦${selectedLoan.paidAmount.toLocaleString()}` },
                        { label: "Remaining", value: `₦${Math.round(remaining).toLocaleString()}` },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <div className="text-xs tracking-widest uppercase text-ink/40 mb-1">{label}</div>
                          <div className="font-mono font-semibold text-ink">{value}</div>
                        </div>
                      ))}
                    </div>

                    {/* Progress bar */}
                    <div className="mt-5">
                      <div className="flex justify-between text-xs text-ink/40 mb-2">
                        <span>Repayment Progress</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate/10 rounded-full">
                        <div
                          className="h-full bg-emerald rounded-full transition-all duration-700"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment form */}
                  <div className="bg-white border border-slate/10 p-6">
                    <h3 className="font-display text-xl text-ink mb-5">Make a Payment</h3>
                    <form onSubmit={handleRepayment} className="space-y-4">
                      <div>
                        <label className="label">Payment Amount (₦)</label>
                        <input
                          type="number"
                          required
                          min="100"
                          step="100"
                          placeholder="Enter amount to pay"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="input-field font-mono"
                        />
                      </div>

                      {/* Quick amounts */}
                      <div className="flex gap-2 flex-wrap">
                        {[selectedLoan.monthlyPayment, selectedLoan.monthlyPayment * 3, Math.round(remaining)].map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setAmount(String(Math.round(amt)))}
                            className="text-xs px-3 py-2 border border-slate/20 text-ink/60 hover:border-slate/50 hover:text-ink transition-colors font-mono"
                          >
                            ₦{Math.round(amt).toLocaleString()}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-2 text-xs text-ink/40">
                        <span>Quick fill:</span>
                        <span>Monthly · 3× Monthly · Full Balance</span>
                      </div>

                      {error && (
                        <div className="bg-danger/10 border border-danger/20 px-4 py-3 text-danger text-sm">
                          {error}
                        </div>
                      )}

                      {successMsg && (
                        <div className="bg-emerald/10 border border-emerald/20 px-4 py-3 text-emerald text-sm">
                          {successMsg}
                        </div>
                      )}

                      <button type="submit" disabled={loading} className="btn-gold w-full">
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
                            Processing...
                          </span>
                        ) : (
                          "Confirm Payment"
                        )}
                      </button>
                    </form>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
