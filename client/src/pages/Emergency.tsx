import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/api";
import { AlertTriangle, Phone } from "lucide-react";

export default function Emergency() {
  const [form, setForm] = useState({ location: "", description: "", contactNumber: "" });
  const [result, setResult] = useState<any>(null);

  const trigger = useMutation({
    mutationFn: () => api.triggerEmergency(form),
    onSuccess: (data) => setResult(data),
  });

  if (result) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={36} className="text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Emergency Alert Sent!</h1>
        <p className="text-gray-600 mb-6">{result.message}</p>
        <div className="bg-white rounded-xl border p-5 text-left space-y-3">
          <div className="flex justify-between"><span className="text-gray-500 text-sm">Emergency ID</span><span className="font-mono text-sm font-medium">{result.emergencyId}</span></div>
          <div className="flex justify-between"><span className="text-gray-500 text-sm">Est. Response</span><span className="font-medium text-green-600">{result.estimatedResponse}</span></div>
          {result.nearestHospital && <div className="flex justify-between"><span className="text-gray-500 text-sm">Nearest Hospital</span><span className="font-medium">{result.nearestHospital}</span></div>}
        </div>
        <button onClick={() => setResult(null)} className="mt-6 text-sm text-blue-600 hover:underline">Send another alert</button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6 text-center">
        <AlertTriangle size={48} className="text-red-600 mx-auto mb-3" />
        <h1 className="text-3xl font-bold text-red-700 mb-1">Emergency</h1>
        <p className="text-red-600 text-sm">Use this only for real medical emergencies</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Location <span className="text-red-500">*</span></label>
          <input type="text" required value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
            placeholder="e.g. MG Road, Koramangala, Bangalore"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
          <textarea required rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Describe the emergency situation"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
          <input type="tel" value={form.contactNumber} onChange={e => setForm({ ...form, contactNumber: e.target.value })}
            placeholder="+91 98765 43210"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>
      </div>

      <button onClick={() => trigger.mutate()} disabled={trigger.isPending || !form.location || !form.description}
        className="w-full bg-red-600 text-white py-5 rounded-xl font-bold text-xl hover:bg-red-700 disabled:opacity-60 shadow-lg">
        {trigger.isPending ? "Sending Alert..." : "TRIGGER EMERGENCY ALERT"}
      </button>

      <div className="mt-8 bg-orange-50 border border-orange-200 rounded-xl p-4">
        <p className="text-sm font-semibold text-orange-800 mb-2">Emergency Contacts</p>
        <div className="space-y-1">
          {[["Ambulance", "108"], ["Police", "100"], ["Fire", "101"], ["Women Helpline", "1091"]].map(([name, num]) => (
            <div key={name} className="flex justify-between items-center">
              <span className="text-sm text-orange-700">{name}</span>
              <a href={`tel:${num}`} className="flex items-center gap-1 text-sm font-bold text-orange-800">
                <Phone size={13} /> {num}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
