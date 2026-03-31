import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { Pill } from "lucide-react";

export default function Prescriptions() {
  const { data = [], isLoading } = useQuery({ queryKey: ["prescriptions"], queryFn: api.getPrescriptions });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Prescription History</h1>

      {isLoading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : data.length === 0 ? (
        <div className="text-center py-16 text-gray-400 border border-dashed rounded-xl">No prescriptions yet.</div>
      ) : (
        <div className="space-y-4">
          {data.map((rx: any) => (
            <div key={rx.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-semibold text-gray-900 text-lg">Dr. {rx.doctorName || "Doctor"}</p>
                  {rx.diagnosis && <p className="text-sm text-gray-500 mt-0.5">Diagnosis: {rx.diagnosis}</p>}
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">{new Date(rx.createdAt).toLocaleDateString()}</p>
                  {rx.validUntil && <p className="text-xs text-gray-400">Valid until: {rx.validUntil}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 mb-2">Medications:</p>
                {rx.medications?.map((m: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 bg-blue-50 rounded-lg p-3">
                    <Pill size={16} className="text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{m.name}</p>
                      <p className="text-xs text-gray-500">{m.dosage} — {m.frequency}{m.duration ? ` for ${m.duration}` : ""}</p>
                    </div>
                  </div>
                ))}
              </div>

              {rx.notes && <p className="text-sm text-gray-500 mt-3 italic border-t pt-3">{rx.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
