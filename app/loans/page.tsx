import Link from "next/link";
import LoanStatusBadge from "@/components/LoanStatusBadge";
import Navbar from "@/components/Navbar";
import { listLoans, requireUser } from "@/lib/dal";
import { formatCurrency, formatDate, formatNameFromEmail } from "@/lib/format";

export default async function LoansPage() {
  const user = await requireUser();
  const loans = await listLoans();
  const sortedLoans = [...loans].sort(
    (left, right) =>
      new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
  );

  return (
    <div className="page-container">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8 animate-fade-in flex items-end justify-between gap-4">
          <div>
            <div className="w-8 h-0.5 bg-gold mb-4" />
            <h1 className="font-display text-4xl text-ink">Loans</h1>
            <p className="text-ink/50 mt-2">
              Browse every loan available to your account.
            </p>
          </div>

          {user.role === "CUSTOMER" && (
            <Link href="/loan-application" className="btn-gold hidden sm:block">
              + Apply
            </Link>
          )}
        </div>

        {sortedLoans.length === 0 ? (
          <div className="bg-white border border-slate/10 p-16 text-center">
            <p className="text-ink/40">No loans to display yet.</p>
          </div>
        ) : (
          <div className="bg-white border border-slate/10 overflow-hidden animate-fade-in">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate/10 bg-slate/[0.02]">
                    <th className="text-left px-6 py-4 text-xs tracking-widest uppercase text-ink/40 font-medium">
                      Loan
                    </th>
                    <th className="text-left px-6 py-4 text-xs tracking-widest uppercase text-ink/40 font-medium hidden md:table-cell">
                      Borrower
                    </th>
                    <th className="text-left px-6 py-4 text-xs tracking-widest uppercase text-ink/40 font-medium">
                      Outstanding
                    </th>
                    <th className="text-left px-6 py-4 text-xs tracking-widest uppercase text-ink/40 font-medium">
                      Status
                    </th>
                    <th className="text-left px-6 py-4 text-xs tracking-widest uppercase text-ink/40 font-medium hidden lg:table-cell">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedLoans.map((loan) => (
                    <tr
                      key={loan.id}
                      className="border-b border-slate/5 hover:bg-slate/[0.01] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <Link
                          href={`/loans/${loan.id}`}
                          className="font-mono font-semibold text-ink hover:text-slate underline-offset-4 hover:underline"
                        >
                          {formatCurrency(loan.amount)}
                        </Link>
                        <div className="text-xs text-ink/40 mt-1">
                          {loan.durationMonths} months
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <div className="text-sm text-ink">
                          {loan.user?.name ??
                            (loan.user?.email
                              ? formatNameFromEmail(loan.user.email)
                              : "Customer")}
                        </div>
                        <div className="text-xs text-ink/40">
                          {loan.user?.email ?? "No email provided"}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-ink">
                        {formatCurrency(loan.outstandingBalance)}
                      </td>
                      <td className="px-6 py-4">
                        <LoanStatusBadge status={loan.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-ink/40 hidden lg:table-cell">
                        {formatDate(loan.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
