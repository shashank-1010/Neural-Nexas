import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { Users, UserCheck, Calendar, ShoppingBag, TrendingUp, Clock } from "lucide-react";

export default function Admin() {
  const { data: stats, isLoading: sLoading } = useQuery({ queryKey: ["adminStats"], queryFn: api.getAdminStats });
  const { data: users = [], isLoading: uLoading } = useQuery({ queryKey: ["adminUsers"], queryFn: api.getAdminUsers });

  const statCards = stats ? [
    { label: "Total Patients", value: stats.totalPatients, icon: Users, color: "bg-blue-50 text-blue-600" },
    { label: "Total Doctors", value: stats.totalDoctors, icon: UserCheck, color: "bg-teal-50 text-teal-600" },
    { label: "Appointments", value: stats.totalAppointments, icon: Calendar, color: "bg-cyan-50 text-cyan-600" },
    { label: "Orders", value: stats.totalOrders, icon: ShoppingBag, color: "bg-green-50 text-green-600" },
    { label: "Pending Appointments", value: stats.pendingAppointments, icon: Clock, color: "bg-red-50 text-red-600" },
    { label: "Revenue", value: `INR ${stats.revenue?.toLocaleString()}`, icon: TrendingUp, color: "bg-emerald-50 text-emerald-600" },
  ] : [];

  const roleColor: Record<string, string> = {
    patient: "bg-blue-100 text-blue-700",
    doctor: "bg-teal-100 text-teal-700",
    admin: "bg-cyan-100 text-cyan-700",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Monitor platform activity, users, appointments, and orders.</p>
      </div>

      {sLoading ? <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {statCards.map((s) => (
            <div key={s.label} className={`rounded-2xl p-5 flex items-center gap-4 ${s.color.split(" ")[0]} border border-slate-200 shadow-sm`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color}`}><s.icon size={22} /></div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                <p className="text-sm text-slate-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100"><h2 className="font-semibold text-slate-900">All Users</h2></div>
        {uLoading ? <div className="flex justify-center py-10"><div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div> : users.length === 0 ? (
          <div className="text-center py-12 text-slate-400">No users found.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {users.map((u: any) => (
              <div key={u.id} className="px-6 py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium text-slate-900">{u.name}</p>
                  <p className="text-sm text-slate-400">{u.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full capitalize font-medium ${roleColor[u.role] || "bg-gray-100 text-gray-600"}`}>{u.role}</span>
                  <span className="text-xs text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
