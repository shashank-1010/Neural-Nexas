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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Hello, {user.name}</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { href: "/book-appointment", icon: Calendar, label: "Book Appointment", color: "bg-blue-50 text-blue-600" },
          { href: "/medical-records", icon: FileText, label: "Medical Records", color: "bg-gray-50 text-gray-600" },
          { href: "/emergency", icon: Activity, label: "Emergency", color: "bg-red-50 text-red-600" },
          { href: "/nearby-services", icon: MapPin, label: "Nearby Services", color: "bg-green-50 text-green-600" },
        ].map((item) => (
          <Link key={item.href} href={item.href}>
            <div className={`rounded-xl border p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:shadow-md transition-shadow h-full ${item.color}`}>
              <item.icon size={28} />
              <span className="font-medium text-sm text-center">{item.label}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
            <Link href="/appointments" className="text-sm text-blue-600 hover:underline">View All</Link>
          </div>
          {aptLoading ? <Spinner /> : upcoming.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm border border-dashed rounded-lg">No upcoming appointments</div>
          ) : upcoming.map((a: any) => (
            <div key={a.id} className="flex justify-between items-center py-3 border-b last:border-0">
              <div>
                <p className="font-medium text-gray-900">{a.doctorName || "Doctor"}</p>
                <p className="text-sm text-gray-500">{a.date} at {a.time}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusColor[a.status] || "bg-gray-100 text-gray-600"}`}>{a.status}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Prescriptions</h2>
            <Link href="/prescriptions" className="text-sm text-blue-600 hover:underline">View All</Link>
          </div>
          {rxLoading ? <Spinner /> : recent.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm border border-dashed rounded-lg">No recent prescriptions</div>
          ) : recent.map((rx: any) => (
            <div key={rx.id} className="py-3 border-b last:border-0">
              <div className="flex justify-between mb-1">
                <p className="font-medium text-gray-900">{rx.doctorName || "Doctor"}</p>
                <p className="text-xs text-gray-400">{new Date(rx.createdAt).toLocaleDateString()}</p>
              </div>
              <p className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded border">
                {rx.medications?.map((m: any) => m.name).join(", ")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
