import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import { Link } from "wouter";

const statusColor: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function Appointments() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: ["appointments"], queryFn: api.getAppointments });
  const cancel = useMutation({
    mutationFn: (id: string) => api.cancelAppointment(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments"] }),
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
        <Link href="/book-appointment" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
          + Book New
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : data.length === 0 ? (
        <div className="text-center py-16 text-gray-400 border border-dashed rounded-xl">
          No appointments yet. <Link href="/book-appointment" className="text-blue-600 hover:underline">Book one now</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((a: any) => (
            <div key={a.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex justify-between items-start">
              <div>
                <p className="font-semibold text-gray-900 text-lg">{a.doctorName || "Doctor"}</p>
                <p className="text-sm text-gray-500">{a.doctorSpecialization}</p>
                <p className="text-sm text-gray-700 mt-1">
                  <span className="font-medium">{a.date}</span> at {a.time} —{" "}
                  <span className="capitalize">{a.type?.replace("-", " ")}</span>
                </p>
                {a.notes && <p className="text-sm text-gray-500 mt-1 italic">{a.notes}</p>}
              </div>
              <div className="flex flex-col items-end gap-3">
                <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${statusColor[a.status] || "bg-gray-100 text-gray-600"}`}>{a.status}</span>
                {a.status !== "cancelled" && a.status !== "completed" && (
                  <button
                    onClick={() => cancel.mutate(a.id)}
                    disabled={cancel.isPending}
                    className="text-xs text-red-600 hover:text-red-700 border border-red-200 px-3 py-1 rounded-lg"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
