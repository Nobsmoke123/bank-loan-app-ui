"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, getLoans, updateLoanStatus, type Loan, type LoanStatus } from "@/lib/store";
import Navbar from "@/components/Navbar";

export default function LoanProcessingPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [filter, setFilter] = useState<"all" | LoanStatus>("all");
  const [processing, setProcessing] = useState<string | null>(null);

  function loadLoans() {
    setLoans(getLoans());
  }

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.replace("/login");
      return;
    }
    setUser(currentUser);
    loadLoans();
  }, [router]);

  async function handleAction(loanId: string, action: "active" | "rejected") {
    setProcessing(loanId);
    await new Promise((r) => setTimeout(r, 400));
    updateLoanStatus(loanId, action);
    loadLoans();
    setProcessing(null);
  }

  if (!user) return null;

  const filtered = filter === "all" ? loans : loans.filter((l) => l.status === filter);

  const filters: Array<{ value: "all" | LoanStatus; label: string; count: number }> = [
    { value: "all", label: "All", count: loans.length },
    { value: "pending", label: "Pending", count: loans.filter((l) => l.status === "pending").length },
    { value: "active", label: "Active", count: loans.filter((l) => l.status === "active").length },
    { value: "completed", label: "Completed", count: loans.filter((l) => l.status === "completed").length },
    { value: "rejected", label: "Rejected", count: loans.filter((l) => l.status === "rejected").length },
  ];

  return (
    <div className="page-container">
      <Navbar userName={user.name} />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8 animate-fade-in">
          <div className="w-8 h-0.5 bg-gold mb-4" />
          <h1 className="font-display text-4xl text-ink">Loan Processing</h1>
          <p className="text-ink/50 mt-2">Review and action all loan applications</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`flex-shrink-0 px-4 py-2.5 text-sm font-medium transition-colors flex items-center gap-2 ${
                filter === f.value
                  ? "bg-slate text-cream"
                  : "bg-white border border-slate/10 text-ink/60 hover:text-ink"
              }`}
            >
              {f.label}
              <span className={`text-xs font-mono px-1.5 py-0.5 rounded-full ${
                filter === f.value ? "bg-cream/20" : "bg-slate/10"
              }`}>
                {f.count}
              </span>
            </button>
          ))}
        </div>

        {/* Loans table */}
        <div className="bg-white border border-slate/10 overflow-hidden animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {filtered.length === 0 ? (
            <div className="p-16 text-center">
              <div className="text-4xl mb-4">📭</div>
              <p className="text-ink/40">No loans in this category</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate/10 bg-slate/[0.02]">
                    <th className="text-left px-6 py-4 text-xs tracking-widest uppercase text-ink/40 font-medium">Applicant</th>
                    <th className="text-left px-6 py-4 text-xs tracking-widest uppercase text-ink/40 font-medium">Amount</th>
                    <th className="text-left px-6 py-4 text-xs tracking-widest uppercase text-ink/40 font-medium hidden md:table-cell">Duration</th>
                    <th className="text-left px-6 py-4 text-xs tracking-widest uppercase text-ink/40 font-medium hidden lg:table-cell">Monthly</th>
                    <th className="text-left px-6 py-4 text-xs tracking-widest uppercase text-ink/40 font-medium">Status</th>
                    <th className="text-left px-6 py-4 text-xs tracking-widest uppercase text-ink/40 font-medium hidden lg:table-cell">Date</th>
                    <th className="text-right px-6 py-4 text-xs tracking-widest uppercase text-ink/40 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((loan) => (
                    <tr key={loan.id} className="border-b border-slate/5 hover:bg-slate/[0.01] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-medium text-ink text-sm">{loan.userName}</div>
                        <div className="text-ink/40 text-xs">{loan.userEmail}</div>
                      </td>
                      <td className="px-6 py-4 font-mono font-semibold text-ink">
                        ₦{loan.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-ink/60 hidden md:table-cell">{loan.durationInMonths}mo</td>
                      <td className="px-6 py-4 text-ink/60 font-mono hidden lg:table-cell">
                        ₦{loan.monthlyPayment.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={loan.status} />
                      </td>
                      <td className="px-6 py-4 text-ink/40 text-sm hidden lg:table-cell">
                        {new Date(loan.appliedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-end">
                          {loan.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleAction(loan.id, "active")}
                                disabled={processing === loan.id}
                                className="btn-success disabled:opacity-50"
                              >
                                {processing === loan.id ? "..." : "Approve"}
                              </button>
                              <button
                                onClick={() => handleAction(loan.id, "rejected")}
                                disabled={processing === loan.id}
                                className="btn-danger disabled:opacity-50"
                              >
                                {processing === loan.id ? "..." : "Reject"}
                              </button>
                            </>
                          )}
                          {loan.status === "active" && (
                            <span className="text-xs text-emerald font-medium">Active</span>
                          )}
                          {loan.status === "completed" && (
                            <span className="text-xs text-gold font-medium">Completed</span>
                          )}
                          {loan.status === "rejected" && (
                            <span className="text-xs text-danger/60 font-medium">Rejected</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary row */}
        {filtered.length > 0 && (
          <div className="mt-4 text-sm text-ink/40 text-right">
            Showing {filtered.length} of {loans.length} loans
          </div>
        )}
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber/10 text-amber border border-amber/20",
    active: "bg-emerald/10 text-emerald border border-emerald/20",
    completed: "bg-gold/10 text-gold border border-gold/20",
    rejected: "bg-danger/10 text-danger border border-danger/20",
  };
  return (
    <span className={`inline-block px-2.5 py-1 text-xs font-mono tracking-wide capitalize ${styles[status] || ""}`}>
      {status}
    </span>
  );
}
