import type { UserRole } from "./definitions";

const SHARED_PROTECTED_PREFIXES = ["/dashboard", "/loans"];
const ADMIN_ONLY_PREFIXES = ["/loan-processing"];
const CUSTOMER_ONLY_PREFIXES = ["/loan-application", "/loan-repayment"];
const PUBLIC_ROUTES = ["/login", "/register"];

export function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.includes(pathname);
}

export function isProtectedRoute(pathname: string) {
  return (
    SHARED_PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    ADMIN_ONLY_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    CUSTOMER_ONLY_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  );
}

export function getRequiredRole(pathname: string): UserRole | null {
  if (ADMIN_ONLY_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return "ADMIN";
  }

  if (CUSTOMER_ONLY_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return "CUSTOMER";
  }

  return null;
}
