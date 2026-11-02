import {
  apiRequest,
  saveToken,
  removeToken,
} from "./api";

// Represents a registered Vara user.
export interface User {
  id: number;
  email: string;
}

// Data returned by the backend after registration or login.
interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// Credentials submitted during registration or login.
export interface AuthCredentials {
  email: string;
  password: string;
}

// Register a new Vara account.
export async function registerUser(
  credentials: AuthCredentials,
): Promise<User> {
  const response = await apiRequest<AuthResponse>(
    "/auth/register",
    {
      method: "POST",
      body: JSON.stringify(credentials),
    },
  );

  saveToken(response.access_token);

  return response.user;
}

// Log in an existing Vara user.
export async function loginUser(
  credentials: AuthCredentials,
): Promise<User> {
  const response = await apiRequest<AuthResponse>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify(credentials),
    },
  );

  saveToken(response.access_token);

  return response.user;
}

// Retrieve the currently authenticated user's account.
export async function getCurrentUser(): Promise<User> {
  return apiRequest<User>("/auth/me");
}

// Log out the current user.
export function logoutUser(): void {
  removeToken();
}