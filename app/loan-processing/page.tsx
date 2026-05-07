import LoanProcessingView from "@/components/LoanProcessingView";
import Navbar from "@/components/Navbar";
import { listLoans, requireRole } from "@/lib/dal";

export default async function LoanProcessingPage() {
  await requireRole("ADMIN");
  const loans = await listLoans();

  return (
    <div className="page-container">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8 animate-fade-in">
          <div className="w-8 h-0.5 bg-gold mb-4" />
          <h1 className="font-display text-4xl text-ink">Loan Processing</h1>
          <p className="text-ink/50 mt-2">
            Review and process pending loan applications
          </p>
        </div>

        <LoanProcessingView initialLoans={loans} />
      </main>
    </div>
  );
}
