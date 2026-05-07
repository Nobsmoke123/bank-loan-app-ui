"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { repayLoanAction } from "@/app/actions/loans";
import type { Loan } from "@/lib/definitions";
import { formatCurrency, formatDate } from "@/lib/format";
import LoanStatusBadge from "./LoanStatusBadge";

export default function LoanRepaymentView({
  initialLoans,
}: {
  initialLoans: Loan[];
}) {
  const [loans, setLoans] = useState(initialLoans);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(
    initialLoans.find((loan) => loan.status === "ACTIVE")?.id ?? null,
  );
  const [isPending, startTransition] = useTransition();

  const activeLoans = loans.filter(
    (loan) => loan.status === "ACTIVE" && Number(loan.outstandingBalance) > 0,
  );
  const selectedLoan =
    activeLoans.find((loan) => loan.id === selectedLoanId) ?? activeLoans[0] ?? null;

  function handleRepayment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedLoan) {
      return;
    }

    setError("");
    setSuccessMessage("");

    startTransition(async () => {
      const result = await repayLoanAction({
        loanId: selectedLoan.id,
        amount: Number(amount),
      });

      if (!result.success) {
        setError(result.message);
        return;
      }

      const updatedLoan = result.data;

      setLoans((current) =>
        current.map((loan) => (loan.id === updatedLoan.id ? updatedLoan : loan)),
      );
      setSuccessMessage(
        `Payment recorded. Remaining balance: ${formatCurrency(
          updatedLoan.outstandingBalance,
        )}.`,
      );
      setAmount("");

      if (
        Number(updatedLoan.outstandingBalance) <= 0 ||
        updatedLoan.status === "COMPLETED"
      ) {
        const nextLoan = activeLoans.find((loan) => loan.id !== updatedLoan.id);
        setSelectedLoanId(nextLoan?.id ?? null);
      }
    });
  }

  if (activeLoans.length === 0) {
    return (
      <div className="bg-white border border-slate/10 p-16 text-center animate-fade-in">
        <h2 className="font-display text-2xl text-ink mb-3">No active loans</h2>
        <p className="text-ink/40 mb-8">
          You do not have any active loans that need repayment right now.
        </p>
        <Link href="/loan-application" className="btn-primary">
          Apply for a Loan
        </Link>
      </div>
    );
  }

  const outstandingBalance = Number(selectedLoan?.outstandingBalance ?? 0);
  const quickAmounts = [
    Math.max(1000, Math.round(outstandingBalance * 0.25)),
    Math.max(1000, Math.round(outstandingBalance * 0.5)),
    Math.round(outstandingBalance),
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div
        className="lg:col-span-2 space-y-3 animate-fade-in"
        style={{ animationDelay: "0.1s" }}
      >
        <h2 className="text-xs tracking-widest uppercase text-ink/50 font-medium mb-4">
          Select Loan
        </h2>
        {activeLoans.map((loan) => {
          const isSelected = selectedLoan?.id === loan.id;

          return (
            <button
              key={loan.id}
              onClick={() => {
                setSelectedLoanId(loan.id);
                setError("");
                setSuccessMessage("");
              }}
              className={`w-full text-left p-5 border transition-all ${
                isSelected
                  ? "border-slate bg-slate text-cream"
                  : "border-slate/10 bg-white hover:border-slate/30"
              }`}
            >
              <div
                className={`text-xs tracking-widest uppercase mb-2 ${
                  isSelected ? "text-cream/50" : "text-ink/40"
                }`}
              >
                Loan #{loan.id.slice(-6).toUpperCase()}
              </div>
              <div
                className={`font-mono text-xl font-semibold mb-1 ${
                  isSelected ? "text-gold" : "text-ink"
                }`}
              >
                {formatCurrency(loan.amount)}
              </div>
              <div
                className={`text-sm mb-3 ${
                  isSelected ? "text-cream/60" : "text-ink/50"
                }`}
              >
                {loan.durationMonths}mo · {formatCurrency(loan.outstandingBalance)}{" "}
                remaining
              </div>
              <LoanStatusBadge status={loan.status} />
            </button>
          );
        })}
      </div>

      <div
        className="lg:col-span-3 animate-fade-in"
        style={{ animationDelay: "0.2s" }}
      >
        {selectedLoan && (
          <>
            <div className="bg-white border border-slate/10 p-6 mb-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {[
                  { label: "Principal", value: formatCurrency(selectedLoan.amount) },
                  {
                    label: "Outstanding",
                    value: formatCurrency(selectedLoan.outstandingBalance),
                  },
                  {
                    label: "Status",
                    value: selectedLoan.status,
                  },
                  {
                    label: "Created",
                    value: formatDate(selectedLoan.created_at),
                  },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="text-xs tracking-widest uppercase text-ink/40 mb-1">
                      {label}
                    </div>
                    <div className="font-mono font-semibold text-ink">{value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between">
                <LoanStatusBadge status={selectedLoan.status} />
                <Link
                  href={`/loans/${selectedLoan.id}`}
                  className="text-sm text-ink/50 hover:text-ink underline underline-offset-4"
                >
                  View details
                </Link>
              </div>
            </div>

            <div className="bg-white border border-slate/10 p-6">
              <h3 className="font-display text-xl text-ink mb-5">Make a Payment</h3>
              <form onSubmit={handleRepayment} className="space-y-4">
                <div>
                  <label className="label">Payment Amount (NGN)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="1"
                    placeholder="Enter amount to pay"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    className="input-field font-mono"
                  />
                </div>

                <div className="flex gap-2 flex-wrap">
                  {quickAmounts.map((quickAmount) => (
                    <button
                      key={quickAmount}
                      type="button"
                      onClick={() => setAmount(String(Math.min(quickAmount, outstandingBalance)))}
                      className="text-xs px-3 py-2 border border-slate/20 text-ink/60 hover:border-slate/50 hover:text-ink transition-colors font-mono"
                    >
                      {formatCurrency(Math.min(quickAmount, outstandingBalance))}
                    </button>
                  ))}
                </div>

                {error && (
                  <div className="bg-danger/10 border border-danger/20 px-4 py-3 text-danger text-sm whitespace-pre-line">
                    {error}
                  </div>
                )}

                {successMessage && (
                  <div className="bg-emerald/10 border border-emerald/20 px-4 py-3 text-emerald text-sm">
                    {successMessage}
                  </div>
                )}

                <button type="submit" disabled={isPending} className="btn-gold w-full">
                  {isPending ? (
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
  );
}
