import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { Users, UserCheck, Calendar, ShoppingBag, TrendingUp, Clock } from "lucide-react";

export default function Admin() {
  const { data: stats, isLoading: sLoading } = useQuery({ queryKey: ["adminStats"], queryFn: api.getAdminStats });
  const { data: users = [], isLoading: uLoading } = useQuery({ queryKey: ["adminUsers"], queryFn: api.getAdminUsers });

  const statCards = stats ? [
    { label: "Total Patients", value: stats.totalPatients, icon: Users, color: "bg-blue-50 text-blue-600" },
    { label: "Total Doctors", value: stats.totalDoctors, icon: UserCheck, color: "bg-green-50 text-green-600" },
    { label: "Appointments", value: stats.totalAppointments, icon: Calendar, color: "bg-purple-50 text-purple-600" },
    { label: "Orders", value: stats.totalOrders, icon: ShoppingBag, color: "bg-orange-50 text-orange-600" },
    { label: "Pending Appointments", value: stats.pendingAppointments, icon: Clock, color: "bg-yellow-50 text-yellow-600" },
    { label: "Revenue", value: `₹${stats.revenue?.toLocaleString()}`, icon: TrendingUp, color: "bg-teal-50 text-teal-600" },
  ] : [];

  const roleColor: Record<string, string> = {
    patient: "bg-blue-100 text-blue-700",
    doctor: "bg-green-100 text-green-700",
    admin: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      {sLoading ? <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div> : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {statCards.map((s) => (
            <div key={s.label} className={`rounded-xl p-5 flex items-center gap-4 ${s.color.split(" ")[0]} border`}>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${s.color}`}><s.icon size={22} /></div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-sm text-gray-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b"><h2 className="font-semibold text-gray-900">All Users</h2></div>
        {uLoading ? <div className="flex justify-center py-10"><div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div> : (
          <div className="divide-y">
            {users.map((u: any) => (
              <div key={u.id} className="px-6 py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{u.name}</p>
                  <p className="text-sm text-gray-400">{u.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full capitalize font-medium ${roleColor[u.role] || "bg-gray-100 text-gray-600"}`}>{u.role}</span>
                  <span className="text-xs text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
