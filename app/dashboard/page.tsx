"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, getLoans, getLoanStats, type Loan } from "@/lib/store";
import Navbar from "@/components/Navbar";
import Link from "next/link";

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
      style={{ animationDelay: delay, animation: "fadeIn 0.4s ease forwards", opacity: 0 }}
    >
      <div className={`absolute top-0 left-0 w-1 h-full ${accent}`} />
      <div className="flex items-start justify-between mb-4">
        <span className="text-2xl">{icon}</span>
        <span className={`text-xs px-2 py-1 font-mono tracking-wider ${color}`}>{label.toUpperCase()}</span>
      </div>
      <div className="font-display text-5xl text-ink font-semibold">{value}</div>
      <div className="text-ink/40 text-sm mt-1 tracking-wide">{label}</div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, active: 0, completed: 0, rejected: 0 });

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.replace("/login");
      return;
    }
    setUser(currentUser);
    const allLoans = getLoans();
    const userLoans = allLoans.filter((l) => l.userId === currentUser.id);
    setLoans(userLoans);
    setStats(getLoanStats(userLoans));
  }, [router]);

  if (!user) return null;

  const statCards = [
    { label: "Total Loans", value: stats.total, color: "text-slate bg-slate/5", accent: "bg-slate", icon: "📋", delay: "0.05s" },
    { label: "Pending Loans", value: stats.pending, color: "text-amber bg-amber/5", accent: "bg-amber", icon: "⏳", delay: "0.1s" },
    { label: "Active Loans", value: stats.active, color: "text-emerald bg-emerald/5", accent: "bg-emerald", icon: "✓", delay: "0.15s" },
    { label: "Completed Loans", value: stats.completed, color: "text-gold bg-gold/5", accent: "bg-gold", icon: "★", delay: "0.2s" },
    { label: "Rejected Loans", value: stats.rejected, color: "text-danger bg-danger/5", accent: "bg-danger", icon: "✕", delay: "0.25s" },
  ];

  const recentLoans = loans.slice(-4).reverse();

  return (
    <div className="page-container">
      <Navbar userName={user.name} />

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10 animate-fade-in">
          <div className="flex items-end justify-between">
            <div>
              <div className="w-8 h-0.5 bg-gold mb-4" />
              <h1 className="font-display text-4xl text-ink">Dashboard</h1>
              <p className="text-ink/50 mt-2">Good day, <span className="text-ink">{user.name.split(" ")[0]}</span></p>
            </div>
            <Link href="/loan-application" className="btn-gold hidden sm:block">
              + New Application
            </Link>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          {statCards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>

        {/* Recent loans */}
        <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl text-ink">Recent Applications</h2>
            <Link href="/loan-processing" className="text-sm text-ink/50 hover:text-ink underline underline-offset-4 transition-colors">
              View all
            </Link>
          </div>

          {recentLoans.length === 0 ? (
            <div className="bg-white border border-slate/10 p-16 text-center">
              <div className="text-4xl mb-4">📭</div>
              <p className="text-ink/40 font-medium">No loan applications yet</p>
              <Link href="/loan-application" className="btn-primary inline-block mt-6">
                Apply for a Loan
              </Link>
            </div>
          ) : (
            <div className="bg-white border border-slate/10 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate/10 bg-slate/2">
                    <th className="text-left px-6 py-4 text-xs tracking-widest uppercase text-ink/40 font-medium">Amount</th>
                    <th className="text-left px-6 py-4 text-xs tracking-widest uppercase text-ink/40 font-medium hidden sm:table-cell">Duration</th>
                    <th className="text-left px-6 py-4 text-xs tracking-widest uppercase text-ink/40 font-medium hidden md:table-cell">Monthly</th>
                    <th className="text-left px-6 py-4 text-xs tracking-widest uppercase text-ink/40 font-medium">Status</th>
                    <th className="text-left px-6 py-4 text-xs tracking-widest uppercase text-ink/40 font-medium hidden lg:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLoans.map((loan, i) => (
                    <tr key={loan.id} className="border-b border-slate/5 hover:bg-slate/2 transition-colors">
                      <td className="px-6 py-4 font-mono font-medium text-ink">
                        ₦{loan.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-ink/60 hidden sm:table-cell">{loan.durationInMonths}mo</td>
                      <td className="px-6 py-4 text-ink/60 font-mono hidden md:table-cell">₦{loan.monthlyPayment.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={loan.status} />
                      </td>
                      <td className="px-6 py-4 text-ink/40 text-sm hidden lg:table-cell">
                        {new Date(loan.appliedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Mobile CTA */}
        <div className="sm:hidden mt-6">
          <Link href="/loan-application" className="btn-gold w-full block text-center">
            + New Application
          </Link>
        </div>
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
