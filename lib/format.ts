import type { LoanStatus, UserRole } from "./definitions";

export function formatCurrency(value: number | string) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return `N${value}`;
  }

  return `N${amount.toLocaleString("en-NG")}`;
}

export function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatRole(role: UserRole) {
  return role === "ADMIN" ? "Admin" : "Customer";
}

export function formatStatus(status: LoanStatus) {
  return `${status[0]}${status.slice(1).toLowerCase()}`;
}

export function formatNameFromEmail(email: string) {
  const localPart = email.split("@")[0] ?? email;

  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((segment) => segment[0]?.toUpperCase() + segment.slice(1))
    .join(" ");
}
