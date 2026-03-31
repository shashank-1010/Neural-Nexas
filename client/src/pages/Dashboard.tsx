import { useQuery } from "@tanstack/react-query";
import { Link, Redirect } from "wouter";
import { api } from "@/api";
import { Calendar, Activity, FileText, MapPin } from "lucide-react";

function Spinner() {
  return <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />;
}

export default function Dashboard() {
  const { data: user } = useQuery({ queryKey: ["me"], queryFn: api.getMe, retry: false });
  const { data: appointments, isLoading: aptLoading } = useQuery({ queryKey: ["appointments"], queryFn: api.getAppointments });
  const { data: prescriptions, isLoading: rxLoading } = useQuery({ queryKey: ["prescriptions"], queryFn: api.getPrescriptions });

  if (!user) return null;
  if (user.role === "admin") return <Redirect to="/admin" />;
  if (user.role === "doctor") return <Redirect to="/doctor-dashboard" />;

  const upcoming = (appointments || []).filter((a: any) => ["pending", "confirmed"].includes(a.status)).slice(0, 3);
  const recent = (prescriptions || []).slice(0, 3);

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50 p-6">
        <p className="text-sm font-medium text-blue-700">Patient Dashboard</p>
        <h1 className="text-3xl font-bold text-slate-900 mt-1">Hello, {user.name}</h1>
        <p className="text-slate-600 mt-2 text-sm">Track appointments, prescriptions, and quick healthcare actions from one place.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { href: "/book-appointment", icon: Calendar, label: "Book Appointment", color: "bg-blue-50 text-blue-600" },
          { href: "/medical-records", icon: FileText, label: "Medical Records", color: "bg-gray-50 text-gray-600" },
          { href: "/emergency", icon: Activity, label: "Emergency", color: "bg-red-50 text-red-600" },
          { href: "/nearby-services", icon: MapPin, label: "Nearby Services", color: "bg-green-50 text-green-600" },
        ].map((item) => (
          <Link key={item.href} href={item.href}>
            <div className={`rounded-2xl border border-slate-200 bg-white p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all h-full ${item.color}`}>
              <item.icon size={28} />
              <span className="font-semibold text-sm text-center">{item.label}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Upcoming Appointments</h2>
            <Link href="/appointments" className="text-sm text-blue-600 hover:underline">View All</Link>
          </div>
          {aptLoading ? <Spinner /> : upcoming.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm border border-dashed border-slate-300 rounded-xl bg-slate-50">No upcoming appointments</div>
          ) : upcoming.map((a: any) => (
            <div key={a.id} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
              <div>
                <p className="font-medium text-slate-900">{a.doctorName || "Doctor"}</p>
                <p className="text-sm text-slate-500">{a.date} at {a.time}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusColor[a.status] || "bg-gray-100 text-gray-600"}`}>{a.status}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Recent Prescriptions</h2>
            <Link href="/prescriptions" className="text-sm text-blue-600 hover:underline">View All</Link>
          </div>
          {rxLoading ? <Spinner /> : recent.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm border border-dashed border-slate-300 rounded-xl bg-slate-50">No recent prescriptions</div>
          ) : recent.map((rx: any) => (
            <div key={rx.id} className="py-3 border-b border-slate-100 last:border-0">
              <div className="flex justify-between mb-1">
                <p className="font-medium text-slate-900">{rx.doctorName || "Doctor"}</p>
                <p className="text-xs text-slate-400">{new Date(rx.createdAt).toLocaleDateString()}</p>
              </div>
              <p className="text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                {rx.medications?.map((m: any) => m.name).join(", ")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
