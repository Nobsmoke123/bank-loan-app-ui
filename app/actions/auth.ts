"use server";

import { redirect } from "next/navigation";
import { backendFetch, normalizeErrorMessage, readResponseBody } from "@/lib/api";
import type { AuthFormState, AuthResponse } from "@/lib/definitions";
import { LoginFormSchema, SignupFormSchema } from "@/lib/definitions";
import { createSession, deleteSession, syncAuthCookies } from "@/lib/session";

function invalidFormState(errors: NonNullable<AuthFormState>["errors"]) {
  return {
    errors,
    message: "Please fix the highlighted fields and try again.",
  } satisfies AuthFormState;
}

async function authenticate(
  path: "/auth/login" | "/auth/register",
  payload: Record<string, string>,
) {
  try {
    const response = await backendFetch(path, {
      body: JSON.stringify(payload),
      method: "POST",
    });
    const body = await readResponseBody<
      AuthResponse | { message?: string | string[] }
    >(response);

    if (!response.ok) {
      const errorBody = body as { message?: string | string[] } | null;

      return {
        message: normalizeErrorMessage(errorBody?.message),
      } satisfies AuthFormState;
    }

    const user = body as AuthResponse | null;

    if (!user?.email || !user?.name || !user?.role) {
      return {
        message: "The authentication service returned an unexpected response.",
      } satisfies AuthFormState;
    }

    await syncAuthCookies(response);
    await createSession({
      email: user.email,
      name: user.name,
      role: user.role,
    });

    redirect("/dashboard");
  } catch (error) {
    console.error("Authentication failed", error);

    return {
      message: "Unable to reach the authentication service right now.",
    } satisfies AuthFormState;
  }
}

export async function loginAction(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return invalidFormState(validatedFields.error.flatten().fieldErrors);
  }

  return authenticate("/auth/login", validatedFields.data);
}

export async function signup(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return invalidFormState(validatedFields.error.flatten().fieldErrors);
  }

  return authenticate("/auth/register", {
    ...validatedFields.data,
    role: "CUSTOMER",
  });
}

export async function logoutAction() {
  try {
    const response = await backendFetch("/auth/logout", {
      method: "POST",
    });

    await syncAuthCookies(response);
  } catch (error) {
    console.error("Logout failed", error);
  } finally {
    await deleteSession();
  }

  redirect("/login");
}
