const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not configured.");
}

// Authentication token management.
// This file's functions are intended for browser-side use.
export function saveToken(token: string): void {
  sessionStorage.setItem("vara_access_token", token);
}

export function getToken(): string | null {
  return sessionStorage.getItem("vara_access_token");
}

export function removeToken(): void {
  sessionStorage.removeItem("vara_access_token");
}

// Central function for making backend requests.
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();

  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    const message =
      errorData?.detail || `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}