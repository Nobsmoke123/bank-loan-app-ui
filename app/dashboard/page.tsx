import Dashboard from "@/components/Dashboard";
import { listLoans, requireUser } from "@/lib/dal";

export default async function DashboardPage() {
  await requireUser();

  const loans = await listLoans();
  const sortedLoans = [...loans].sort(
    (left, right) =>
      new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
  );

  return (
    <Dashboard
      stats={{
        activeLoans: loans.filter((loan) => loan.status === "ACTIVE").length,
        completedLoans: loans.filter((loan) => loan.status === "COMPLETED").length,
        pendingLoans: loans.filter((loan) => loan.status === "PENDING").length,
        rejectedLoans: loans.filter((loan) => loan.status === "REJECTED").length,
        totalLoans: loans.length,
      }}
      loans={sortedLoans.slice(0, 8)}
    />
  );
}
