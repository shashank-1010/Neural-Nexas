import { setAuthTokenGetter } from "@workspace/api-client-react";

export const TOKEN_KEY = "nn_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

// Automatically bind the token getter so the Orval hooks attach the auth header
setAuthTokenGetter(() => getToken());
