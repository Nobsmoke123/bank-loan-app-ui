import LoanRepaymentView from "@/components/LoanRepaymentView";
import Navbar from "@/components/Navbar";
import { listLoans, requireRole } from "@/lib/dal";

export default async function LoanRepaymentPage() {
  await requireRole("CUSTOMER");
  const loans = await listLoans();

  return (
    <div className="page-container">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-10 animate-fade-in">
          <div className="w-8 h-0.5 bg-gold mb-4" />
          <h1 className="font-display text-4xl text-ink">Loan Repayment</h1>
          <p className="text-ink/50 mt-2">
            Make payments towards your active loans
          </p>
        </div>

        <LoanRepaymentView initialLoans={loans} />
      </main>
    </div>
  );
}
