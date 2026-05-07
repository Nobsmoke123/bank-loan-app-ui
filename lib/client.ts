import type { ApiResult } from "./definitions";

export type {
  AuthResponse,
  AuthenticatedUser,
  DashboardStats,
  Loan,
  LoanStatus,
  MutationResult,
  ProfileResponse,
  UserRole,
} from "./definitions";

export async function clientFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResult<T>> {
  try {
    const response = await fetch(path, {
      ...options,
      credentials: "include",
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });

    const contentType = response.headers.get("content-type");
    const body = contentType?.includes("application/json")
      ? await response.json()
      : null;

    if (!response.ok) {
      return {
        success: false,
        error: {
          message: body?.message ?? "Something went wrong.",
          error: body?.error ?? "UnknownError",
          statusCode: body?.statusCode ?? response.status,
        },
      };
    }

    return {
      success: true,
      data: body as T,
    };
  } catch (error) {
    console.error("Client request failed", error);

    return {
      success: false,
      error: {
        message: "Unable to reach the application.",
        error: "NetworkError",
        statusCode: 500,
      },
    };
  }
}
