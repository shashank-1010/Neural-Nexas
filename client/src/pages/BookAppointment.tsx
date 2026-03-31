import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { api } from "@/api";

export default function BookAppointment() {
  const [, nav] = useLocation();
  const qc = useQueryClient();
  const { data: doctors, isLoading } = useQuery({ queryKey: ["doctors"], queryFn: api.getDoctors });
  const [form, setForm] = useState({ doctorId: "", date: "", time: "", type: "in-person", notes: "" });
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: () => api.createAppointment(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["appointments"] });
      nav("/appointments");
    },
    onError: (err: any) => setError(err.message),
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  if (isLoading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Book an Appointment</h1>
        <p className="text-slate-500">Schedule a consultation with one of our specialists.</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-4 text-sm">{error}</div>}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Select Doctor</label>
          <select value={form.doctorId} onChange={e => set("doctorId", e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
            <option value="">Choose a specialist</option>
            {doctors?.map((d: any) => (
              <option key={d.id} value={d.id}>{d.name} — {d.specialization}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
            <input type="date" value={form.date} onChange={e => set("date", e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
            <select value={form.time} onChange={e => set("time", e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
              <option value="">Select time</option>
              {["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Consultation Type</label>
          <select value={form.type} onChange={e => set("type", e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
            <option value="in-person">In-Person Visit</option>
            <option value="online">Online Video Consultation</option>
            <option value="zero-wait">Zero-Wait Express</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Reason for visit (Optional)</label>
          <input type="text" value={form.notes} onChange={e => set("notes", e.target.value)}
            placeholder="Briefly describe your symptoms"
            className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
        </div>

        <button onClick={() => mutation.mutate()} disabled={mutation.isPending || !form.doctorId || !form.date || !form.time}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors shadow-sm">
          {mutation.isPending ? "Booking..." : "Confirm Appointment"}
        </button>
      </div>
    </div>
  );
}
