export async function apiRequest<T>(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(path, {
    ...options,
    headers,
    credentials: 'include', // Include cookies for HTTP-only auth
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || data?.message || "Request failed");
  }

  return data as T;
}

export async function apiGet<T>(path: string) {
  return apiRequest<T>(path, { method: "GET" });
}

export async function apiPost<T>(path: string, body: unknown) {
  return apiRequest<T>(path, { method: "POST", body: JSON.stringify(body) });
}

export async function apiPatch<T>(path: string, body: unknown) {
  return apiRequest<T>(path, { method: "PATCH", body: JSON.stringify(body) });
}

export async function apiDelete<T>(path: string) {
  return apiRequest<T>(path, { method: "DELETE" });
}
