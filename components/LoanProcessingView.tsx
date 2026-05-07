"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { processLoanAction } from "@/app/actions/loans";
import type { Loan, LoanStatus } from "@/lib/definitions";
import { formatCurrency, formatDate, formatNameFromEmail } from "@/lib/format";
import LoanStatusBadge from "./LoanStatusBadge";

type FilterValue = "ALL" | LoanStatus;

export default function LoanProcessingView({
  initialLoans,
}: {
  initialLoans: Loan[];
}) {
  const [loans, setLoans] = useState(initialLoans);
  const [filter, setFilter] = useState<FilterValue>("ALL");
  const [error, setError] = useState("");
  const [processingLoanId, setProcessingLoanId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredLoans =
    filter === "ALL" ? loans : loans.filter((loan) => loan.status === filter);

  const filters: Array<{ count: number; label: string; value: FilterValue }> = [
    { value: "ALL", label: "All", count: loans.length },
    {
      value: "PENDING",
      label: "Pending",
      count: loans.filter((loan) => loan.status === "PENDING").length,
    },
    {
      value: "ACTIVE",
      label: "Active",
      count: loans.filter((loan) => loan.status === "ACTIVE").length,
    },
    {
      value: "COMPLETED",
      label: "Completed",
      count: loans.filter((loan) => loan.status === "COMPLETED").length,
    },
    {
      value: "REJECTED",
      label: "Rejected",
      count: loans.filter((loan) => loan.status === "REJECTED").length,
    },
  ];

  function handleAction(loanId: string, status: "ACTIVE" | "REJECTED") {
    setError("");
    setProcessingLoanId(loanId);

    startTransition(async () => {
      const result = await processLoanAction({ loanId, status });

      if (!result.success) {
        setError(result.message);
        setProcessingLoanId(null);
        return;
      }

      setLoans((current) =>
        current.map((loan) => (loan.id === result.data.id ? result.data : loan)),
      );
      setProcessingLoanId(null);
    });
  }

  return (
    <div>
      <div
        className="flex gap-1 mb-6 overflow-x-auto animate-fade-in"
        style={{ animationDelay: "0.1s" }}
      >
        {filters.map((filterOption) => (
          <button
            key={filterOption.value}
            onClick={() => setFilter(filterOption.value)}
            className={`flex-shrink-0 px-4 py-2.5 text-sm font-medium transition-colors flex items-center gap-2 ${
              filter === filterOption.value
                ? "bg-slate text-cream"
                : "bg-white border border-slate/10 text-ink/60 hover:text-ink"
            }`}
          >
            {filterOption.label}
            <span
              className={`text-xs font-mono px-1.5 py-0.5 rounded-full ${
                filter === filterOption.value ? "bg-cream/20" : "bg-slate/10"
              }`}
            >
              {filterOption.count}
            </span>
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/20 px-4 py-3 text-danger text-sm mb-4 whitespace-pre-line">
          {error}
        </div>
      )}

      <div
        className="bg-white border border-slate/10 overflow-hidden animate-fade-in"
        style={{ animationDelay: "0.2s" }}
      >
        {filteredLoans.length === 0 ? (
          <div className="p-16 text-center">
            <p className="text-ink/40">No loans in this category</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate/10 bg-slate/[0.02]">
                  <th className="text-left px-6 py-4 text-xs tracking-widest uppercase text-ink/40 font-medium">
                    Applicant
                  </th>
                  <th className="text-left px-6 py-4 text-xs tracking-widest uppercase text-ink/40 font-medium">
                    Amount
                  </th>
                  <th className="text-left px-6 py-4 text-xs tracking-widest uppercase text-ink/40 font-medium hidden md:table-cell">
                    Duration
                  </th>
                  <th className="text-left px-6 py-4 text-xs tracking-widest uppercase text-ink/40 font-medium hidden lg:table-cell">
                    Outstanding
                  </th>
                  <th className="text-left px-6 py-4 text-xs tracking-widest uppercase text-ink/40 font-medium">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-xs tracking-widest uppercase text-ink/40 font-medium hidden lg:table-cell">
                    Date
                  </th>
                  <th className="text-right px-6 py-4 text-xs tracking-widest uppercase text-ink/40 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLoans.map((loan) => {
                  const applicantName =
                    loan.user?.name ??
                    (loan.user?.email
                      ? formatNameFromEmail(loan.user.email)
                      : "Customer");

                  return (
                    <tr
                      key={loan.id}
                      className="border-b border-slate/5 hover:bg-slate/[0.01] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-ink text-sm">
                          {applicantName}
                        </div>
                        <div className="text-ink/40 text-xs">
                          {loan.user?.email ?? "No email provided"}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono font-semibold text-ink">
                        {formatCurrency(loan.amount)}
                      </td>
                      <td className="px-6 py-4 text-ink/60 hidden md:table-cell">
                        {loan.durationMonths}mo
                      </td>
                      <td className="px-6 py-4 text-ink/60 font-mono hidden lg:table-cell">
                        {formatCurrency(loan.outstandingBalance)}
                      </td>
                      <td className="px-6 py-4">
                        <LoanStatusBadge status={loan.status} />
                      </td>
                      <td className="px-6 py-4 text-ink/40 text-sm hidden lg:table-cell">
                        {formatDate(loan.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-end items-center">
                          <Link
                            href={`/loans/${loan.id}`}
                            className="text-xs text-ink/50 hover:text-ink underline underline-offset-4"
                          >
                            View
                          </Link>
                          {loan.status === "PENDING" && (
                            <>
                              <button
                                onClick={() => handleAction(loan.id, "ACTIVE")}
                                disabled={isPending && processingLoanId === loan.id}
                                className="btn-success disabled:opacity-50"
                              >
                                {processingLoanId === loan.id ? "..." : "Approve"}
                              </button>
                              <button
                                onClick={() => handleAction(loan.id, "REJECTED")}
                                disabled={isPending && processingLoanId === loan.id}
                                className="btn-danger disabled:opacity-50"
                              >
                                {processingLoanId === loan.id ? "..." : "Reject"}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {filteredLoans.length > 0 && (
        <div className="mt-4 text-sm text-ink/40 text-right">
          Showing {filteredLoans.length} of {loans.length} loans
        </div>
      )}
    </div>
  );
}
