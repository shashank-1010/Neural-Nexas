import { useQuery } from "@tanstack/react-query";
import { Link, Redirect } from "wouter";
import { api } from "@/api";
import { 
  Calendar, 
  Activity, 
  FileText, 
  MapPin, 
  Clock, 
  ChevronRight, 
  User, 
  Mail, 
  Shield,
  Stethoscope,
  Pill,
  Heart,
  MessageSquare,
  Bell,
  Search,
  Menu,
  X
} from "lucide-react";
import { useState, useEffect } from "react";

function Spinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };
  return (
    <div className={`${sizeClasses[size]} border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto`} />
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className={`inline-flex p-3 rounded-xl ${color} mb-4`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600 mt-1">{label}</p>
    </div>
  );
}

function AppointmentCard({ appointment }: { appointment: any }) {
  const statusConfig: Record<string, { color: string; bg: string; icon: any }> = {
    pending: { color: "text-yellow-700", bg: "bg-yellow-50", icon: Clock },
    confirmed: { color: "text-blue-700", bg: "bg-blue-50", icon: Calendar },
    completed: { color: "text-green-700", bg: "bg-green-50", icon: Heart },
    cancelled: { color: "text-red-700", bg: "bg-red-50", icon: X }
  };
  
  const config = statusConfig[appointment.status] || statusConfig.pending;
  const IconComponent = config.icon;
  
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors rounded-lg px-3 -mx-3">
      <div className="flex items-center gap-4 flex-1">
        <div className={`p-2 rounded-xl ${config.bg}`}>
          <IconComponent className={`w-5 h-5 ${config.color}`} />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900">{appointment.doctorName || "Doctor"}</p>
          <p className="text-sm text-gray-500 mt-0.5">
            {appointment.date} • {appointment.time}
          </p>
          {appointment.type && (
            <span className="inline-block text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full mt-1">
              {appointment.type}
            </span>
          )}
        </div>
      </div>
      <div className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${config.bg} ${config.color}`}>
        {appointment.status}
      </div>
    </div>
  );
}

function PrescriptionCard({ prescription }: { prescription: any }) {
  return (
    <div className="py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors rounded-lg px-3 -mx-3">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 rounded-xl">
            <Pill className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{prescription.doctorName || "Doctor"}</p>
            <p className="text-xs text-gray-500">
              {new Date(prescription.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400" />
      </div>
      <div className="ml-11">
        <p className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
          {prescription.medications?.map((m: any) => m.name).join(", ")}
        </p>
        {prescription.diagnosis && (
          <p className="text-xs text-gray-500 mt-2">
            Diagnosis: {prescription.diagnosis}
          </p>
        )}
      </div>
    </div>
  );
}

function QuickAction({ href, icon: Icon, label, description, color }: any) {
  return (
    <Link href={href}>
      <div className="group relative bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden">
        <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full ${color} opacity-10 group-hover:opacity-20 transition-opacity`} />
        <div className={`inline-flex p-3 rounded-xl ${color} mb-4 relative z-10`}>
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-1 relative z-10">{label}</h3>
        <p className="text-sm text-gray-600 relative z-10">{description}</p>
      </div>
    </Link>
  );
}

function MobileNav({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-64 bg-white shadow-xl p-6">
        <div className="flex justify-end mb-6">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <Link href="/dashboard">
            <div className="py-2 px-3 hover:bg-gray-50 rounded-lg cursor-pointer">Dashboard</div>
          </Link>
          <Link href="/appointments">
            <div className="py-2 px-3 hover:bg-gray-50 rounded-lg cursor-pointer">Appointments</div>
          </Link>
          <Link href="/prescriptions">
            <div className="py-2 px-3 hover:bg-gray-50 rounded-lg cursor-pointer">Prescriptions</div>
          </Link>
          <Link href="/profile">
            <div className="py-2 px-3 hover:bg-gray-50 rounded-lg cursor-pointer">Profile</div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: user } = useQuery({ 
    queryKey: ["me"], 
    queryFn: api.getMe, 
    retry: false 
  });
  const { data: appointments, isLoading: aptLoading } = useQuery({ 
    queryKey: ["appointments"], 
    queryFn: api.getAppointments 
  });
  const { data: prescriptions, isLoading: rxLoading } = useQuery({ 
    queryKey: ["prescriptions"], 
    queryFn: api.getPrescriptions 
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!user) return null;
  if (user.role === "admin") return <Redirect to="/admin" />;
  if (user.role === "doctor") return <Redirect to="/doctor-dashboard" />;

  const upcoming = (appointments || [])
    .filter((a: any) => ["pending", "confirmed"].includes(a.status))
    .slice(0, 5);
  const recent = (prescriptions || []).slice(0, 5);

  const stats = {
    appointments: appointments?.length || 0,
    prescriptions: prescriptions?.length || 0,
    upcoming: upcoming.length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <header className={`sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100 transition-shadow ${isScrolled ? 'shadow-sm' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Stethoscope className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent hidden sm:inline">
                  Neural Nexas
                </span>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center gap-6">
              <Link href="/dashboard">
                <span className="text-sm font-medium text-gray-700 hover:text-blue-600 cursor-pointer">Dashboard</span>
              </Link>
              <Link href="/appointments">
                <span className="text-sm font-medium text-gray-700 hover:text-blue-600 cursor-pointer">Appointments</span>
              </Link>
              <Link href="/prescriptions">
                <span className="text-sm font-medium text-gray-700 hover:text-blue-600 cursor-pointer">Prescriptions</span>
              </Link>
              <Link href="/medical-records">
                <span className="text-sm font-medium text-gray-700 hover:text-blue-600 cursor-pointer">Records</span>
              </Link>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <MobileNav isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
            <div className="relative z-10">
              <p className="text-sm font-medium text-blue-100">Welcome back,</p>
              <h1 className="text-2xl sm:text-3xl font-bold mt-1">{user.name}</h1>
              <p className="text-blue-100 mt-2 text-sm max-w-md">
                Your health journey matters. Here's your personalized healthcare dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
          <StatCard 
            icon={Calendar} 
            label="Total Appointments" 
            value={stats.appointments}
            color="bg-blue-50 text-blue-600"
          />
          <StatCard 
            icon={Pill} 
            label="Prescriptions" 
            value={stats.prescriptions}
            color="bg-purple-50 text-purple-600"
          />
          <StatCard 
            icon={Clock} 
            label="Upcoming" 
            value={stats.upcoming}
            color="bg-green-50 text-green-600"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8 sm:mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickAction 
              href="/book-appointment" 
              icon={Calendar} 
              label="Book Appointment"
              description="Schedule with top doctors"
              color="bg-blue-50 text-blue-600"
            />
            <QuickAction 
              href="/medical-records" 
              icon={FileText} 
              label="Medical Records"
              description="Access your health history"
              color="bg-gray-50 text-gray-600"
            />
            <QuickAction 
              href="/emergency" 
              icon={Activity} 
              label="Emergency"
              description="24/7 immediate assistance"
              color="bg-red-50 text-red-600"
            />
            <QuickAction 
              href="/nearby-services" 
              icon={MapPin} 
              label="Nearby Services"
              description="Find hospitals & pharmacies"
              color="bg-green-50 text-green-600"
            />
          </div>
        </div>

        {/* Appointments & Prescriptions */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Appointments Section */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">Upcoming Appointments</h2>
                  <p className="text-sm text-gray-500 mt-1">Your scheduled healthcare visits</p>
                </div>
                <Link href="/appointments">
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1">
                    View All <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
            <div className="p-5 sm:p-6 pt-0">
              {aptLoading ? (
                <div className="py-12">
                  <Spinner />
                </div>
              ) : upcoming.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex p-4 bg-gray-50 rounded-full mb-4">
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No upcoming appointments</p>
                  <p className="text-sm text-gray-400 mt-1">Book your first appointment now</p>
                  <Link href="/book-appointment">
                    <button className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition-colors">
                      Book Appointment
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {upcoming.map((appointment: any) => (
                    <AppointmentCard key={appointment.id} appointment={appointment} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Prescriptions Section */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">Recent Prescriptions</h2>
                  <p className="text-sm text-gray-500 mt-1">Your current medications</p>
                </div>
                <Link href="/prescriptions">
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1">
                    View All <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
            <div className="p-5 sm:p-6 pt-0">
              {rxLoading ? (
                <div className="py-12">
                  <Spinner />
                </div>
              ) : recent.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex p-4 bg-gray-50 rounded-full mb-4">
                    <Pill className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No prescriptions yet</p>
                  <p className="text-sm text-gray-400 mt-1">Your prescriptions will appear here</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {recent.map((prescription: any) => (
                    <PrescriptionCard key={prescription.id} prescription={prescription} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Health Tips Section */}
        <div className="mt-8 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Heart className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Health Tip of the Day</h3>
              <p className="text-sm text-gray-600">
                Stay hydrated! Drink at least 8 glasses of water daily for optimal health and energy levels.
              </p>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
