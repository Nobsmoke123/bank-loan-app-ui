import Link from "next/link";
import { notFound } from "next/navigation";
import LoanStatusBadge from "@/components/LoanStatusBadge";
import Navbar from "@/components/Navbar";
import { getLoanById, requireUser } from "@/lib/dal";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatNameFromEmail,
  formatRole,
} from "@/lib/format";

export default async function LoanDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const { id } = await params;
  const loan = await getLoanById(id);

  if (!loan) {
    notFound();
  }

  const borrowerName =
    loan.user?.name ??
    (loan.user?.email ? formatNameFromEmail(loan.user.email) : "Customer");

  return (
    <div className="page-container">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8 animate-fade-in">
          <Link
            href="/loans"
            className="text-sm text-ink/50 hover:text-ink underline underline-offset-4"
          >
            Back to loans
          </Link>
          <div className="w-8 h-0.5 bg-gold my-4" />
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-4xl text-ink">
                {formatCurrency(loan.amount)}
              </h1>
              <p className="text-ink/50 mt-2">Loan #{loan.id}</p>
            </div>
            <LoanStatusBadge status={loan.status} />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <section className="xl:col-span-2 space-y-6">
            <div className="bg-white border border-slate/10 p-6">
              <h2 className="font-display text-xl text-ink mb-5">Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: "Amount", value: formatCurrency(loan.amount) },
                  {
                    label: "Outstanding",
                    value: formatCurrency(loan.outstandingBalance),
                  },
                  { label: "Duration", value: `${loan.durationMonths} months` },
                  { label: "Created", value: formatDate(loan.created_at) },
                  { label: "Approved", value: formatDateTime(loan.approved_at) },
                  {
                    label: "Completed",
                    value: formatDateTime(loan.completed_at),
                  },
                  {
                    label: "Processed By",
                    value: loan.admin?.name ?? "Not assigned",
                  },
                  { label: "Notes", value: loan.notes ?? "No notes" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="text-xs tracking-widest uppercase text-ink/40 mb-1">
                      {label}
                    </div>
                    <div className="font-mono text-ink">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate/10 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-xl text-ink">Repayments</h2>
                <span className="text-sm text-ink/40">
                  {loan.repayments?.length ?? 0} entries
                </span>
              </div>

              {loan.repayments && loan.repayments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate/10">
                        <th className="text-left py-3 text-xs tracking-widest uppercase text-ink/40 font-medium">
                          Amount
                        </th>
                        <th className="text-left py-3 text-xs tracking-widest uppercase text-ink/40 font-medium">
                          Balance After
                        </th>
                        <th className="text-left py-3 text-xs tracking-widest uppercase text-ink/40 font-medium">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loan.repayments.map((repayment) => (
                        <tr key={repayment.id} className="border-b border-slate/5">
                          <td className="py-3 font-mono text-ink">
                            {formatCurrency(repayment.amount)}
                          </td>
                          <td className="py-3 font-mono text-ink/70">
                            {formatCurrency(repayment.balance_after)}
                          </td>
                          <td className="py-3 text-sm text-ink/50">
                            {formatDateTime(repayment.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-ink/40">No repayments have been made yet.</p>
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="bg-white border border-slate/10 p-6">
              <h2 className="font-display text-xl text-ink mb-5">Borrower</h2>
              <div className="space-y-4">
                <div>
                  <div className="text-xs tracking-widest uppercase text-ink/40 mb-1">
                    Name
                  </div>
                  <div className="text-ink">{borrowerName}</div>
                </div>
                <div>
                  <div className="text-xs tracking-widest uppercase text-ink/40 mb-1">
                    Email
                  </div>
                  <div className="text-ink">{loan.user?.email ?? "Not provided"}</div>
                </div>
                <div>
                  <div className="text-xs tracking-widest uppercase text-ink/40 mb-1">
                    Role
                  </div>
                  <div className="text-ink">
                    {loan.user?.role ? formatRole(loan.user.role) : "Customer"}
                  </div>
                </div>
                <div>
                  <div className="text-xs tracking-widest uppercase text-ink/40 mb-1">
                    Balance
                  </div>
                  <div className="text-ink">
                    {loan.user?.balance
                      ? formatCurrency(loan.user.balance)
                      : "Not available"}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate text-cream p-6">
              <div className="text-xs tracking-widest uppercase text-cream/40 mb-4">
                Loan Summary
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-cream/50 text-xs mb-1">Principal</div>
                  <div className="font-mono text-2xl text-gold">
                    {formatCurrency(loan.amount)}
                  </div>
                </div>
                <div>
                  <div className="text-cream/50 text-xs mb-1">Outstanding</div>
                  <div className="font-mono text-xl">
                    {formatCurrency(loan.outstandingBalance)}
                  </div>
                </div>
                <div>
                  <div className="text-cream/50 text-xs mb-1">Updated</div>
                  <div className="font-mono text-sm">
                    {formatDateTime(loan.updated_at)}
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
