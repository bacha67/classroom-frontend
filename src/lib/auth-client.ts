import { BACKEND_BASE_URL } from "@/constants";
import type { SignUpPayload, User } from "@/types";

type AuthResult<T> = Promise<{
  data: T | null;
  error: { message: string } | null;
}>;

type SessionUser = {
  user: User;
};

const AUTH_BASE_URL = `${BACKEND_BASE_URL}/auth`;

async function request<T>(
  endpoint: string,
  init: RequestInit = {}
): AuthResult<T> {
  try {
    const response = await fetch(`${AUTH_BASE_URL}${endpoint}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init.headers ?? {}),
      },
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        data: null,
        error: {
          message:
            payload?.message ??
            payload?.error ??
            `Request failed with status ${response.status}`,
        },
      };
    }

    return { data: payload as T, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message: error instanceof Error ? error.message : "Request failed",
      },
    };
  }
}

export const authClient = {
  signUp: {
    email: async (payload: SignUpPayload): AuthResult<SessionUser> =>
      request<SessionUser>("/sign-up/email", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  },
  signIn: {
    email: async (payload: { email: string; password: string }): AuthResult<SessionUser> =>
      request<SessionUser>("/sign-in/email", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  },
  signOut: async (): AuthResult<{ success: boolean }> =>
    request<{ success: boolean }>("/sign-out", {
      method: "POST",
    }),
};
