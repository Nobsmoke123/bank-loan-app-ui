import "server-only";

import { cookies } from "next/headers";
import type { ApiResult } from "./definitions";

function getApiBaseUrl() {
  const baseUrl =
    process.env.LOAN_SERVICE_API_URL ??
    process.env.NEXT_LOAN_SERVICE_API_URL ??
    (process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000");

  if (!baseUrl) {
    throw new Error("Missing LOAN_SERVICE_API_URL environment variable.");
  }

  return baseUrl;
}

function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, getApiBaseUrl()).toString();
}

async function getCookieHeader() {
  const cookieStore = await cookies();

  return cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");
}

export async function backendFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(options.headers);
  const cookieHeader = await getCookieHeader();

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (cookieHeader && !headers.has("cookie")) {
    headers.set("cookie", cookieHeader);
  }

  return fetch(buildApiUrl(path), {
    ...options,
    cache: "no-store",
    headers,
  });
}

export async function readResponseBody<T>(response: Response): Promise<T | null> {
  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    return null;
  }

  return (await response.json()) as T;
}

export function normalizeErrorMessage(message: string | string[] | undefined) {
  if (Array.isArray(message)) {
    return message.join("\n");
  }

  return message ?? "Something went wrong.";
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResult<T>> {
  try {
    const response = await backendFetch(path, options);
    const body = await readResponseBody<T>(response);

    if (!response.ok) {
      const errorBody = (body ?? {}) as {
        error?: string;
        message?: string | string[];
        statusCode?: number;
      };

      return {
        success: false,
        error: {
          message: errorBody.message ?? "Something went wrong.",
          error: errorBody.error ?? "UnknownError",
          statusCode: errorBody.statusCode ?? response.status,
        },
      };
    }

    return {
      success: true,
      data: body as T,
    };
  } catch (error) {
    console.error("Backend request failed", error);

    return {
      success: false,
      error: {
        message: "Unable to reach the loan service.",
        error: "NetworkError",
        statusCode: 500,
      },
    };
  }
}
