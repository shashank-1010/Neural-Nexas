import { useState } from "react";
import { Link, useLocation } from "wouter";
import { api } from "@/api";
import { HeartPulse } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function Login() {
  const [, nav] = useLocation();
  const qc = useQueryClient();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.login(form);
      localStorage.setItem("nn_token", res.token);
      qc.invalidateQueries({ queryKey: ["me"] });
      nav("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-slate-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center gap-2 text-blue-600 font-bold text-2xl">
            <HeartPulse size={28} /> Neural Nexas
          </Link>
        </div>
        <div className="bg-white rounded-2xl border border-blue-100 shadow-xl shadow-blue-100/40 p-8">
          <h1 className="text-2xl font-bold text-slate-900 text-center mb-1">Welcome back</h1>
          <p className="text-slate-500 text-center text-sm mb-6">Enter your credentials to access your account</p>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-4 text-sm">{error}</div>}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email" required placeholder="name@example.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password" required placeholder="Your password"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-60 mt-2 transition-colors"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline font-medium">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
