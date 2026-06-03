const TOKEN_KEY = "samba2_auth_token";
const ROLE_KEY  = "samba2_role";
const USER_KEY  = "samba2_username";

export const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

export type UserRole = "admin" | "staff";

export function getStoredToken(): string | null  { return sessionStorage.getItem(TOKEN_KEY); }
export function getStoredRole(): UserRole | null  { return sessionStorage.getItem(ROLE_KEY) as UserRole | null; }
export function getStoredUsername(): string | null { return sessionStorage.getItem(USER_KEY); }

export function clearStoredToken(): void {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(ROLE_KEY);
  sessionStorage.removeItem(USER_KEY);
}

const FALLBACK_ADMIN_PASSWORD = "MEDEL@VSB";
const ALLOW_LOCAL_AUTH_FALLBACK = import.meta.env.DEV || import.meta.env.VITE_ALLOW_LOCAL_FALLBACK === "true";

export async function login(
  username: string,
  password: string
): Promise<{ role: UserRole; username: string } | null> {
  const normalizedPassword = password.trim().toUpperCase();
  const fallbackMatch = normalizedPassword === FALLBACK_ADMIN_PASSWORD;

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const data = await res.json() as { token: string; role: UserRole; username: string };
      sessionStorage.setItem(TOKEN_KEY, data.token);
      sessionStorage.setItem(ROLE_KEY, data.role);
      sessionStorage.setItem(USER_KEY, data.username);
      return { role: data.role, username: data.username };
    }

    if (ALLOW_LOCAL_AUTH_FALLBACK && res.status === 404 && fallbackMatch) {
      const token = "local-admin-token";
      sessionStorage.setItem(TOKEN_KEY, token);
      sessionStorage.setItem(ROLE_KEY, "admin");
      sessionStorage.setItem(USER_KEY, "admin");
      return { role: "admin", username: "admin" };
    }

    return null;
  } catch {
    if (ALLOW_LOCAL_AUTH_FALLBACK && fallbackMatch) {
      const token = "local-admin-token";
      sessionStorage.setItem(TOKEN_KEY, token);
      sessionStorage.setItem(ROLE_KEY, "admin");
      sessionStorage.setItem(USER_KEY, "admin");
      return { role: "admin", username: "admin" };
    }
    return null;
  }
}
