import { useAuth } from "@/hooks/use-auth";
import { Redirect, Link } from "wouter";
import { useGetAppointments, useGetPrescriptions } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { Calendar, FileText, Activity, MapPin } from "lucide-react";
import { format } from "date-fns";
import { Spinner } from "@/components/ui/spinner";

export default function Dashboard() {
  const { user } = useAuth();
  
  if (!user) return null;
  if (user.role === "admin") return <Redirect to="/admin" />;
  if (user.role === "doctor") return <Redirect to="/doctor-dashboard" />;

  const { data: appointments, isLoading: isLoadingApt } = useGetAppointments();
  const { data: prescriptions, isLoading: isLoadingRx } = useGetPrescriptions();

  const upcoming = appointments?.filter(a => a.status === "pending" || a.status === "confirmed").slice(0, 3) || [];
  const recentPrescriptions = prescriptions?.slice(0, 3) || [];

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Hello, {user.name}</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Link href="/book-appointment">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-blue-100 bg-blue-50/50 h-full">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
              <Calendar className="h-8 w-8 text-primary mb-3" />
              <span className="font-medium text-blue-900">Book Appointment</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/medical-records">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
              <FileText className="h-8 w-8 text-gray-600 mb-3" />
              <span className="font-medium text-gray-800">Medical Records</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/emergency">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-red-100 bg-red-50/50 h-full">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
              <Activity className="h-8 w-8 text-red-600 mb-3" />
              <span className="font-medium text-red-900">Emergency</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/nearby-services">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
              <MapPin className="h-8 w-8 text-gray-600 mb-3" />
              <span className="font-medium text-gray-800">Nearby Services</span>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl">Upcoming Appointments</CardTitle>
            <Link href="/appointments"><Button variant="ghost" size="sm">View All</Button></Link>
          </CardHeader>
          <CardContent>
            {isLoadingApt ? (
              <div className="flex justify-center p-4"><Spinner /></div>
            ) : upcoming.length === 0 ? (
              <div className="text-gray-500 py-8 text-center bg-gray-50 rounded-lg border border-dashed">No upcoming appointments</div>
            ) : (
              <div className="space-y-4 mt-4">
                {upcoming.map(apt => (
                  <div key={apt.id} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <div className="font-medium text-gray-900">{apt.doctorName || "Doctor"}</div>
                      <div className="text-sm text-gray-500 capitalize">{apt.type.replace("-", " ")}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {format(new Date(apt.date), 'MMM dd, yyyy')} at {apt.time}
                      </div>
                    </div>
                    <StatusBadge status={apt.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl">Recent Prescriptions</CardTitle>
            <Link href="/prescriptions"><Button variant="ghost" size="sm">View All</Button></Link>
          </CardHeader>
          <CardContent>
            {isLoadingRx ? (
              <div className="flex justify-center p-4"><Spinner /></div>
            ) : recentPrescriptions.length === 0 ? (
              <div className="text-gray-500 py-8 text-center bg-gray-50 rounded-lg border border-dashed">No recent prescriptions</div>
            ) : (
              <div className="space-y-4 mt-4">
                {recentPrescriptions.map(rx => (
                  <div key={rx.id} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-gray-900">{rx.doctorName || "Doctor"}</div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(rx.createdAt), 'MMM dd, yyyy')}
                      </div>
                    </div>
                    <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded border">
                      {rx.medications.map(m => m.name).join(", ")}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
