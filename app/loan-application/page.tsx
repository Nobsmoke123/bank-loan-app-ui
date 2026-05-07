import LoanApplicationForm from "@/components/LoanApplicationForm";
import Navbar from "@/components/Navbar";
import { requireRole } from "@/lib/dal";

export default async function LoanApplicationPage() {
  await requireRole("CUSTOMER");

  return (
    <div className="page-container">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-10 animate-fade-in">
          <div className="w-8 h-0.5 bg-gold mb-4" />
          <h1 className="font-display text-4xl text-ink">Loan Application</h1>
          <p className="text-ink/50 mt-2">
            Fill in the details below to submit your application
          </p>
        </div>

        <LoanApplicationForm />
      </main>
    </div>
  );
}
