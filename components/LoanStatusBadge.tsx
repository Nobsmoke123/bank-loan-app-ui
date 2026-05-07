import type { LoanStatus } from "@/lib/definitions";
import { formatStatus } from "@/lib/format";

const styles: Record<LoanStatus, string> = {
  ACTIVE: "bg-emerald/10 text-emerald border border-emerald/20",
  COMPLETED: "bg-gold/10 text-gold border border-gold/20",
  PENDING: "bg-amber/10 text-amber border border-amber/20",
  REJECTED: "bg-danger/10 text-danger border border-danger/20",
};

export default function LoanStatusBadge({ status }: { status: LoanStatus }) {
  return (
    <span
      className={`inline-block px-2.5 py-1 text-xs font-mono tracking-wide ${styles[status]}`}
    >
      {formatStatus(status)}
    </span>
  );
}
