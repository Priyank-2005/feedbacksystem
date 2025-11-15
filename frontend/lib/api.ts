// frontend/lib/api.ts
const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function apiFetch(path: string, opts: RequestInit = {}) {
  const url = `${BASE}${path}`;
  const headers = new Headers(opts.headers || {});
  headers.set("Content-Type", headers.get("Content-Type") ?? "application/json");

  // attach token from localStorage if present
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) headers.set("Authorization", `Bearer ${token}`);
  } catch (e) {
    /* ignore */
  }

  const res = await fetch(url, { ...opts, headers });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }

  if (!res.ok) {
    const err: any = new Error(data?.message || res.statusText || "Request failed");
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}
export default apiFetch;
