"use client";

import Link from "next/link";
import type { DashboardStats, Loan } from "@/lib/definitions";
import { formatCurrency, formatDate } from "@/lib/format";
import { useAuth } from "@/providers/auth.context";
import LoanStatusBadge from "./LoanStatusBadge";
import Navbar from "./Navbar";

interface StatCardProps {
  label: string;
  value: number;
  color: string;
  accent: string;
  icon: string;
  delay: string;
}

function StatCard({ label, value, color, accent, icon, delay }: StatCardProps) {
  return (
    <div
      className="bg-white border border-slate/10 p-6 relative overflow-hidden group hover:shadow-md transition-shadow"
      style={{
        animation: "fadeIn 0.4s ease forwards",
        animationDelay: delay,
        opacity: 0,
      }}
    >
      <div className={`absolute top-0 left-0 w-1 h-full ${accent}`} />
      <div className="flex items-start justify-between mb-4">
        <span className="text-2xl">{icon}</span>
        <span className={`text-xs px-2 py-1 font-mono tracking-wider ${color}`}>
          {label.toUpperCase()}
        </span>
      </div>
      <div className="font-display text-5xl text-ink font-semibold">
        {value}
      </div>
      <div className="text-ink/40 text-sm mt-1 tracking-wide">{label}</div>
    </div>
  );
}

export default function Dashboard({
  stats,
  loans,
}: {
  stats: DashboardStats;
  loans: Loan[];
}) {
  const { authUser } = useAuth();

  if (!authUser) {
    return null;
  }

  const statCards = [
    {
      label: "Total Loans",
      value: stats.totalLoans,
      color: "text-slate bg-slate/5",
      accent: "bg-slate",
      icon: "TL",
      delay: "0.05s",
    },
    {
      label: "Pending Loans",
      value: stats.pendingLoans,
      color: "text-amber bg-amber/5",
      accent: "bg-amber",
      icon: "PN",
      delay: "0.1s",
    },
    {
      label: "Active Loans",
      value: stats.activeLoans,
      color: "text-emerald bg-emerald/5",
      accent: "bg-emerald",
      icon: "AC",
      delay: "0.15s",
    },
    {
      label: "Completed Loans",
      value: stats.completedLoans,
      color: "text-gold bg-gold/5",
      accent: "bg-gold",
      icon: "CP",
      delay: "0.2s",
    },
    {
      label: "Rejected Loans",
      value: stats.rejectedLoans,
      color: "text-danger bg-danger/5",
      accent: "bg-danger",
      icon: "RJ",
      delay: "0.25s",
    },
  ];

  return (
    <div className="page-container">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10 animate-fade-in">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="w-8 h-0.5 bg-gold mb-4" />
              <h1 className="font-display text-4xl text-ink">Dashboard</h1>
              <p className="text-ink/50 mt-2">
                Good day,{" "}
                <span className="text-ink">{authUser.name.split(" ")[0]}</span>
              </p>
            </div>

            {authUser.role === "CUSTOMER" && (
              <Link
                href="/loan-application"
                className="btn-gold hidden sm:block"
              >
                + New Application
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          {statCards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>

        <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl text-ink">Recent Loans</h2>
            <Link
              href="/loans"
              className="text-sm text-ink/50 hover:text-ink underline underline-offset-4 transition-colors"
            >
              View all
            </Link>
          </div>

          {loans.length === 0 ? (
            <div className="bg-white border border-slate/10 p-16 text-center">
              <p className="text-ink/40 font-medium">No loans available yet</p>
              {authUser.role === "CUSTOMER" && (
                <Link
                  href="/loan-application"
                  className="btn-primary inline-block mt-6"
                >
                  Apply for a Loan
                </Link>
              )}
            </div>
          ) : (
            <div className="bg-white border border-slate/10 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate/10 bg-slate/2">
                    <th className="text-left px-6 py-4 text-xs tracking-widest uppercase text-ink/40 font-medium">
                      Amount
                    </th>
                    <th className="text-left px-6 py-4 text-xs tracking-widest uppercase text-ink/40 font-medium hidden sm:table-cell">
                      Duration
                    </th>
                    <th className="text-left px-6 py-4 text-xs tracking-widest uppercase text-ink/40 font-medium">
                      Status
                    </th>
                    <th className="text-left px-6 py-4 text-xs tracking-widest uppercase text-ink/40 font-medium hidden lg:table-cell">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loans.map((loan) => (
                    <tr
                      key={loan.id}
                      className="border-b border-slate/5 hover:bg-slate/2 transition-colors"
                    >
                      <td className="px-6 py-4 font-mono font-medium text-ink">
                        <Link
                          href={`/loans/${loan.id}`}
                          className="hover:text-slate underline-offset-4 hover:underline"
                        >
                          {formatCurrency(loan.amount)}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-ink/60 hidden sm:table-cell">
                        {loan.durationMonths}mo
                      </td>
                      <td className="px-6 py-4">
                        <LoanStatusBadge status={loan.status} />
                      </td>
                      <td className="px-6 py-4 text-ink/40 text-sm hidden lg:table-cell">
                        {formatDate(loan.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {authUser.role === "CUSTOMER" && (
          <div className="sm:hidden mt-6">
            <Link
              href="/loan-application"
              className="btn-gold w-full block text-center"
            >
              + New Application
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
