import { useGetAppointments, useUpdateAppointment, getGetAppointmentsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { Spinner } from "@/components/ui/spinner";
import { format } from "date-fns";
import { CalendarX2, Video, MapPin, Zap } from "lucide-react";
import { Link } from "wouter";

export default function Appointments() {
  const { data: appointments, isLoading } = useGetAppointments();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Assuming we use useUpdateAppointment to cancel by sending status update
  const updateMutation = useUpdateAppointment();

  const handleCancel = (id: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    
    updateMutation.mutate(
      { id, data: { status: "cancelled" } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetAppointmentsQueryKey() });
          toast({ title: "Appointment cancelled" });
        },
        onError: () => {
          toast({ variant: "destructive", title: "Failed to cancel appointment" });
        }
      }
    );
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "online": return <Video className="h-4 w-4 mr-2" />;
      case "zero-wait": return <Zap className="h-4 w-4 mr-2 text-yellow-500" />;
      default: return <MapPin className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
        <Link href="/book-appointment">
          <Button>Book New</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12"><Spinner size="lg" /></div>
      ) : appointments?.length === 0 ? (
        <Card className="bg-gray-50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-12">
            <CalendarX2 className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No appointments found</h3>
            <p className="text-gray-500 mb-6">You don't have any upcoming or past appointments.</p>
            <Link href="/book-appointment">
              <Button>Book your first appointment</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {appointments?.map((apt) => (
            <Card key={apt.id} className="shadow-sm overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{apt.doctorName || "Doctor"}</h3>
                      <StatusBadge status={apt.status} />
                    </div>
                    <p className="text-gray-600 text-sm">{apt.doctorSpecialization}</p>
                    
                    <div className="flex items-center gap-6 mt-4">
                      <div className="flex items-center text-sm font-medium text-gray-700 bg-blue-50 px-3 py-1 rounded-full text-blue-800">
                        {format(new Date(apt.date), 'MMM dd, yyyy')} at {apt.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 capitalize">
                        {getIcon(apt.type)}
                        {apt.type.replace("-", " ")}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-row md:flex-col gap-2">
                    {apt.status === "pending" || apt.status === "confirmed" ? (
                      <Button 
                        variant="outline" 
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 w-full"
                        onClick={() => handleCancel(apt.id)}
                        disabled={updateMutation.isPending}
                      >
                        Cancel
                      </Button>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
