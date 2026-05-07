import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { AuthenticatedUser, SessionPayload, UserRole } from "./definitions";

const SESSION_COOKIE_NAME = "session";
const SESSION_TTL_SECONDS = 60 * 60 * 24;

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;

  if (!secret && process.env.NODE_ENV !== "production") {
    return new TextEncoder().encode("loan-app-dev-session-secret");
  }

  if (!secret) {
    throw new Error("Missing SESSION_SECRET environment variable.");
  }

  return new TextEncoder().encode(secret);
}

function isUserRole(value: unknown): value is UserRole {
  return value === "ADMIN" || value === "CUSTOMER";
}

function getCookieOptions() {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_TTL_SECONDS,
  };
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSessionSecret());
}

export async function decrypt(
  session: string | undefined = "",
): Promise<SessionPayload | null> {
  if (!session) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(session, getSessionSecret(), {
      algorithms: ["HS256"],
    });

    if (
      typeof payload.email !== "string" ||
      typeof payload.name !== "string" ||
      !isUserRole(payload.role)
    ) {
      return null;
    }

    return {
      ...payload,
      id: typeof payload.id === "string" ? payload.id : undefined,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
  } catch (error) {
    console.error("Failed to verify session.", error);
    return null;
  }
}

export async function createSession(user: AuthenticatedUser) {
  const cookieStore = await cookies();
  const session = await encrypt({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  cookieStore.set(SESSION_COOKIE_NAME, session, getCookieOptions());
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSessionUser(): Promise<AuthenticatedUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const payload = await decrypt(token);

  if (!payload) {
    return null;
  }

  return {
    id: payload.id,
    email: payload.email,
    name: payload.name,
    role: payload.role,
  };
}

export async function hasAuthCookie() {
  const cookieStore = await cookies();
  const authCookieNames = new Set([
    SESSION_COOKIE_NAME,
    "access_token",
    "accessToken",
    "refresh_token",
    "refreshToken",
  ]);

  return cookieStore.getAll().some((cookie) => authCookieNames.has(cookie.name));
}

function getSetCookieHeaders(response: Response) {
  const responseHeaders = response.headers as Headers & {
    getSetCookie?: () => string[];
  };

  if (typeof responseHeaders.getSetCookie === "function") {
    return responseHeaders.getSetCookie();
  }

  const header = response.headers.get("set-cookie");
  return header ? [header] : [];
}

function parseSetCookieHeader(setCookieHeader: string) {
  const segments = setCookieHeader.split(";").map((segment) => segment.trim());
  const [nameValue, ...attributes] = segments;

  if (!nameValue) {
    return null;
  }

  const separatorIndex = nameValue.indexOf("=");

  if (separatorIndex === -1) {
    return null;
  }

  const name = nameValue.slice(0, separatorIndex);
  const value = nameValue.slice(separatorIndex + 1);
  const options: {
    domain?: string;
    expires?: Date;
    httpOnly?: boolean;
    maxAge?: number;
    path?: string;
    sameSite?: "lax" | "none" | "strict";
    secure?: boolean;
  } = {};

  for (const attribute of attributes) {
    const [rawKey, ...rawValueParts] = attribute.split("=");
    const key = rawKey.toLowerCase();
    const rawValue = rawValueParts.join("=");

    switch (key) {
      case "domain":
        options.domain = rawValue;
        break;
      case "expires":
        options.expires = new Date(rawValue);
        break;
      case "httponly":
        options.httpOnly = true;
        break;
      case "max-age":
        options.maxAge = Number(rawValue);
        break;
      case "path":
        options.path = rawValue;
        break;
      case "samesite": {
        const sameSite = rawValue.toLowerCase();

        if (
          sameSite === "lax" ||
          sameSite === "none" ||
          sameSite === "strict"
        ) {
          options.sameSite = sameSite;
        }

        break;
      }
      case "secure":
        options.secure = true;
        break;
      default:
        break;
    }
  }

  return { name, options, value };
}

export async function syncAuthCookies(response: Response) {
  const cookieStore = await cookies();
  const cookieHeaders = getSetCookieHeaders(response);

  for (const cookieHeader of cookieHeaders) {
    const parsed = parseSetCookieHeader(cookieHeader);

    if (!parsed) {
      continue;
    }

    if (process.env.NODE_ENV !== "production") {
      parsed.options.secure = false;
    }

    cookieStore.set(parsed.name, parsed.value, parsed.options);
  }
}
