import { useState } from "react";
import { Link, useLocation } from "wouter";
import { api } from "@/api";
import { HeartPulse } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function Register() {
  const [, nav] = useLocation();
  const qc = useQueryClient();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "patient" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.register(form);
      localStorage.setItem("nn_token", res.token);
      qc.invalidateQueries({ queryKey: ["me"] });
      nav("/dashboard");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const field = (label: string, key: keyof typeof form, type = "text", placeholder = "") => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type} required placeholder={placeholder}
        value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2 text-blue-600 font-bold text-2xl">
            <HeartPulse size={28} /> Neural Nexas
          </Link>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">Create an account</h1>
          <p className="text-gray-500 text-center text-sm mb-6">Join Neural Nexas to manage your healthcare journey</p>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">{error}</div>}

          <form onSubmit={submit} className="space-y-4">
            {field("Full Name", "name", "text", "John Doe")}
            {field("Email", "email", "email", "name@example.com")}
            {field("Password", "password", "password", "Create a password")}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
              <select
                value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60 mt-2"
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
