export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${process.env.NEXT_LOAN_SERVICE_API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // used to automatically pass the jwt-access-token from the cookies
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Request Failed.");
  }

  return res.json();
}
