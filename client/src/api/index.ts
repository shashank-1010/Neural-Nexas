const BASE = "/api";

function headers() {
  const token = localStorage.getItem("nn_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function req<T = any>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: headers(),
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data as T;
}

export const api = {
  login: (d: any) => req("POST", "/auth/login", d),
  register: (d: any) => req("POST", "/auth/register", d),
  getMe: () => req("GET", "/auth/me"),

  getDoctors: () => req("GET", "/doctors"),

  getAppointments: () => req("GET", "/appointments"),
  createAppointment: (d: any) => req("POST", "/appointments", d),
  updateAppointment: (id: string, d: any) => req("PUT", `/appointments/${id}`, d),
  cancelAppointment: (id: string) => req("DELETE", `/appointments/${id}`),

  getPrescriptions: () => req("GET", "/prescriptions"),
  createPrescription: (d: any) => req("POST", "/prescriptions", d),

  getRecords: () => req("GET", "/records"),
  createRecord: (d: any) => req("POST", "/records", d),

  getStores: () => req("GET", "/stores"),

  getOrders: () => req("GET", "/orders"),
  createOrder: (d: any) => req("POST", "/orders", d),

  triggerEmergency: (d: any) => req("POST", "/emergency", d),

  getAdminStats: () => req("GET", "/admin/stats"),
  getAdminUsers: () => req("GET", "/admin/users"),
};
