import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import { FileText, Plus, X } from "lucide-react";

const typeColor: Record<string, string> = {
  "lab-report": "bg-blue-100 text-blue-700",
  imaging: "bg-purple-100 text-purple-700",
  "discharge-summary": "bg-orange-100 text-orange-700",
  consultation: "bg-green-100 text-green-700",
  vaccination: "bg-teal-100 text-teal-700",
  other: "bg-gray-100 text-gray-700",
};

export default function MedicalRecords() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: ["records"], queryFn: api.getRecords });
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ type: "lab-report", title: "", description: "", date: "", fileUrl: "" });

  const add = useMutation({
    mutationFn: () => api.createRecord(form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["records"] }); setShow(false); setForm({ type: "lab-report", title: "", description: "", date: "", fileUrl: "" }); },
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Medical Records</h1>
          <p className="text-slate-500 text-sm mt-1">Store and review your diagnostic and consultation history.</p>
        </div>
        <button onClick={() => setShow(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 flex items-center gap-2 transition-colors shadow-sm">
          <Plus size={16} /> Add Record
        </button>
      </div>

      {show && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Add New Record</h2>
            <button onClick={() => setShow(false)}><X size={20} className="text-gray-400" /></button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select value={form.type} onChange={e => set("type", e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                  {["lab-report", "imaging", "discharge-summary", "consultation", "vaccination", "other"].map(t => (
                    <option key={t} value={t}>{t.replace("-", " ")}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input type="date" value={form.date} onChange={e => set("date", e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input type="text" value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Blood Test Report"
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={2} placeholder="Details about this record"
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">File URL (optional)</label>
              <input type="url" value={form.fileUrl} onChange={e => set("fileUrl", e.target.value)} placeholder="https://..."
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
            </div>
            <button onClick={() => add.mutate()} disabled={add.isPending || !form.title}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors shadow-sm">
              {add.isPending ? "Saving..." : "Save Record"}
            </button>
          </div>
        </div>
      )}

      {isLoading ? <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
        : data.length === 0 ? <div className="text-center py-16 text-slate-400 border border-dashed border-slate-300 rounded-2xl bg-slate-50">No medical records yet.</div>
        : (
          <div className="space-y-4">
            {data.map((r: any) => (
              <div key={r.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                  <FileText size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-slate-900">{r.title}</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full capitalize ${typeColor[r.type] || "bg-gray-100 text-gray-600"}`}>{r.type?.replace("-", " ")}</span>
                      {r.date && <span className="text-xs text-slate-400">{r.date}</span>}
                    </div>
                  </div>
                  {r.description && <p className="text-sm text-slate-500 mt-1">{r.description}</p>}
                  {r.fileUrl && <a href={r.fileUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline mt-1 inline-block">View File</a>}
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
