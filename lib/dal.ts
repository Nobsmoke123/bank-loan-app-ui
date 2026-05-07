import "server-only";

import { redirect } from "next/navigation";
import { apiFetch, normalizeErrorMessage } from "./api";
import type {
  ApiError,
  ApiResult,
  AuthenticatedUser,
  Loan,
  ProfileResponse,
  UserRole,
} from "./definitions";
import { getSessionUser, hasAuthCookie } from "./session";

function buildFallbackName(email: string) {
  const localPart = email.split("@")[0] ?? "User";

  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((segment) => segment[0]?.toUpperCase() + segment.slice(1))
    .join(" ");
}

export async function getAuthUser(): Promise<AuthenticatedUser | null> {
  const sessionUser = await getSessionUser();
  const hasKnownAuthCookie = await hasAuthCookie();

  if (!sessionUser && !hasKnownAuthCookie) {
    return null;
  }

  const profileResult = await apiFetch<ProfileResponse>("/auth/me");

  if (!profileResult.success) {
    if (profileResult.error.statusCode === 401 || profileResult.error.statusCode === 403) {
      return null;
    }

    if (sessionUser) {
      return sessionUser;
    }

    return null;
  }

  const user: AuthenticatedUser = {
    id: profileResult.data.id,
    email: profileResult.data.email,
    name:
      sessionUser?.email === profileResult.data.email
        ? sessionUser.name
        : buildFallbackName(profileResult.data.email),
    role: profileResult.data.role,
  };

  return user;
}

export async function requireUser() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireRole(role: UserRole | UserRole[]) {
  const user = await requireUser();
  const allowedRoles = Array.isArray(role) ? role : [role];

  if (!allowedRoles.includes(user.role)) {
    redirect("/dashboard");
  }

  return user;
}

export async function handleProtectedError(error: ApiError["error"]) {
  if (error.statusCode === 401) {
    redirect("/login");
  }

  if (error.statusCode === 403) {
    redirect("/dashboard");
  }

  throw new Error(normalizeErrorMessage(error.message));
}

export async function unwrapProtectedResult<T>(result: ApiResult<T>) {
  if (result.success) {
    return result.data;
  }

  await handleProtectedError(result.error);
  throw new Error("Unreachable");
}

export async function listLoans() {
  const result = await apiFetch<Loan[]>("/loans");
  return unwrapProtectedResult(result);
}

export async function getLoanById(loanId: string) {
  const result = await apiFetch<Loan>(`/loans/${loanId}`);

  if (!result.success && result.error.statusCode === 404) {
    return null;
  }

  return unwrapProtectedResult(result);
}
