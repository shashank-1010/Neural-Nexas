import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";

export default function DoctorDashboard() {
  const qc = useQueryClient();
  const { data: user } = useQuery({ queryKey: ["me"], queryFn: api.getMe, retry: false });
  const { data: appointments = [], isLoading } = useQuery({ queryKey: ["appointments"], queryFn: api.getAppointments });
  const [rxForm, setRxForm] = useState({ patientId: "", diagnosis: "", medications: [{ name: "", dosage: "", frequency: "", duration: "" }], notes: "" });
  const [showRx, setShowRx] = useState(false);

  const update = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => api.updateAppointment(id, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments"] }),
  });

  const createRx = useMutation({
    mutationFn: () => api.createPrescription(rxForm),
    onSuccess: () => { setShowRx(false); setRxForm({ patientId: "", diagnosis: "", medications: [{ name: "", dosage: "", frequency: "", duration: "" }], notes: "" }); },
  });

  const addMed = () => setRxForm(f => ({ ...f, medications: [...f.medications, { name: "", dosage: "", frequency: "", duration: "" }] }));
  const setMed = (i: number, k: string, v: string) => setRxForm(f => ({ ...f, medications: f.medications.map((m, j) => j === i ? { ...m, [k]: v } : m) }));

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700", confirmed: "bg-blue-100 text-blue-700",
    completed: "bg-teal-100 text-teal-700", cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Doctor Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome, Dr. {user?.name}</p>
        </div>
        <button onClick={() => setShowRx(!showRx)} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm">
          + Write Prescription
        </button>
      </div>

      {showRx && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-slate-900 mb-4">New Prescription</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Patient ID</label>
                <input value={rxForm.patientId} onChange={e => setRxForm({ ...rxForm, patientId: e.target.value })} placeholder="Patient ID"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Diagnosis</label>
                <input value={rxForm.diagnosis} onChange={e => setRxForm({ ...rxForm, diagnosis: e.target.value })} placeholder="e.g. Hypertension"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-medium text-slate-700">Medications</label>
                <button onClick={addMed} className="text-sm text-blue-600 hover:underline">+ Add more</button>
              </div>
              {rxForm.medications.map((m, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
                  {(["name", "dosage", "frequency", "duration"] as const).map(k => (
                    <input key={k} value={m[k]} onChange={e => setMed(i, k, e.target.value)} placeholder={k.charAt(0).toUpperCase() + k.slice(1)}
                      className="border border-slate-300 rounded-xl px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                  ))}
                </div>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
              <textarea value={rxForm.notes} onChange={e => setRxForm({ ...rxForm, notes: e.target.value })} rows={2} placeholder="Additional notes"
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
            </div>
            <button onClick={() => createRx.mutate()} disabled={createRx.isPending}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors">
              {createRx.isPending ? "Saving..." : "Save Prescription"}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100"><h2 className="font-semibold text-slate-900">All Appointments</h2></div>
        {isLoading ? <div className="flex justify-center py-10"><div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
          : appointments.length === 0 ? <div className="text-center py-12 text-slate-400">No appointments yet.</div>
          : appointments.map((a: any) => (
            <div key={a.id} className="px-6 py-4 border-b border-slate-100 last:border-0 flex justify-between items-center gap-3">
              <div>
                <p className="font-medium text-slate-900">{a.patientName || "Patient"}</p>
                <p className="text-sm text-slate-500">{a.date} at {a.time} - <span className="capitalize">{a.type?.replace("-", " ")}</span></p>
                {a.notes && <p className="text-xs text-slate-400 mt-0.5 italic">{a.notes}</p>}
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2.5 py-1 rounded-full capitalize font-medium ${statusColor[a.status] || "bg-gray-100 text-gray-600"}`}>{a.status}</span>
                {a.status === "pending" && (
                  <button onClick={() => update.mutate({ id: a.id, status: "confirmed" })}
                    className="text-xs bg-teal-600 text-white px-3 py-1 rounded-xl hover:bg-teal-700">Confirm</button>
                )}
                {a.status === "confirmed" && (
                  <button onClick={() => update.mutate({ id: a.id, status: "completed" })}
                    className="text-xs bg-blue-600 text-white px-3 py-1 rounded-xl hover:bg-blue-700">Complete</button>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
