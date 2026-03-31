import { useState } from "react";
import { 
  useGetAppointments, 
  useUpdateAppointment, 
  useCreatePrescription, 
  getGetAppointmentsQueryKey 
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import { Spinner } from "@/components/ui/spinner";
import { format, isToday } from "date-fns";
import { Users, Calendar as CalendarIcon, CheckCircle, Clock, Pill, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const prescriptionSchema = z.object({
  diagnosis: z.string().min(2, "Diagnosis is required"),
  notes: z.string().optional(),
  medications: z.array(z.object({
    name: z.string().min(1, "Medicine name is required"),
    dosage: z.string().min(1, "Dosage is required"),
    frequency: z.string().min(1, "Frequency is required"),
    duration: z.string().optional()
  })).min(1, "At least one medication is required")
});

type PrescriptionFormValues = z.infer<typeof prescriptionSchema>;

export default function DoctorDashboard() {
  const { data: appointments, isLoading } = useGetAppointments();
  const updateMutation = useUpdateAppointment();
  const createPrescriptionMutation = useCreatePrescription();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [prescriptionPatientId, setPrescriptionPatientId] = useState<string | null>(null);
  
  const form = useForm<PrescriptionFormValues>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      diagnosis: "",
      notes: "",
      medications: [{ name: "", dosage: "", frequency: "", duration: "" }]
    }
  });

  const handleUpdateStatus = (id: string, status: any) => {
    updateMutation.mutate(
      { id, data: { status } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetAppointmentsQueryKey() });
          toast({ title: `Appointment marked as ${status}` });
        },
        onError: () => toast({ variant: "destructive", title: "Update failed" })
      }
    );
  };

  const onSubmitPrescription = (data: PrescriptionFormValues) => {
    if (!prescriptionPatientId) return;
    
    createPrescriptionMutation.mutate(
      { 
        data: {
          patientId: prescriptionPatientId,
          ...data
        }
      },
      {
        onSuccess: () => {
          toast({ title: "Prescription created successfully" });
          setPrescriptionPatientId(null);
          form.reset();
        },
        onError: () => toast({ variant: "destructive", title: "Failed to create prescription" })
      }
    );
  };

  const addMedication = () => {
    const currentMeds = form.getValues().medications;
    form.setValue("medications", [...currentMeds, { name: "", dosage: "", frequency: "", duration: "" }]);
  };

  const removeMedication = (index: number) => {
    const currentMeds = form.getValues().medications;
    if (currentMeds.length > 1) {
      currentMeds.splice(index, 1);
      form.setValue("medications", [...currentMeds]);
    }
  };

  const todayAppointments = appointments?.filter(a => isToday(new Date(a.date))) || [];
  const upcomingAppointments = appointments?.filter(a => !isToday(new Date(a.date)) && (a.status === "pending" || a.status === "confirmed")) || [];

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
        <p className="text-gray-600">Manage your consultations and patients</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">Today's Appointments</p>
              <h2 className="text-3xl font-bold text-blue-900 mt-1">{todayAppointments.length}</h2>
            </div>
            <CalendarIcon className="h-10 w-10 text-blue-300" />
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-100">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">Total Patients</p>
              <h2 className="text-3xl font-bold text-green-900 mt-1">
                {new Set(appointments?.map(a => a.patientId)).size || 0}
              </h2>
            </div>
            <Users className="h-10 w-10 text-green-300" />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" /> Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 flex justify-center"><Spinner /></div>
            ) : todayAppointments.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No appointments scheduled for today.</div>
            ) : (
              <div className="divide-y">
                {todayAppointments.map(apt => (
                  <div key={apt.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-gray-50 transition-colors">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold text-lg">{apt.time}</span>
                        <StatusBadge status={apt.status} />
                      </div>
                      <h4 className="font-medium text-gray-900">{apt.patientName || "Patient"}</h4>
                      <p className="text-sm text-gray-500 capitalize">{apt.type.replace("-", " ")} Consultation</p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto flex-wrap">
                      {apt.status === "pending" && (
                        <Button 
                          onClick={() => handleUpdateStatus(apt.id, "confirmed")}
                          className="bg-blue-600 hover:bg-blue-700"
                          disabled={updateMutation.isPending}
                        >
                          Confirm
                        </Button>
                      )}
                      {(apt.status === "confirmed" || apt.status === "completed") && (
                        <Button 
                          variant="outline"
                          onClick={() => setPrescriptionPatientId(apt.patientId)}
                          className="border-blue-200 text-blue-700 hover:bg-blue-50"
                        >
                          <Pill className="h-4 w-4 mr-2" /> Prescribe
                        </Button>
                      )}
                      {(apt.status === "confirmed" || apt.status === "pending") && (
                        <Button 
                          onClick={() => handleUpdateStatus(apt.id, "completed")}
                          className="bg-green-600 hover:bg-green-700"
                          disabled={updateMutation.isPending}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" /> Complete
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!prescriptionPatientId} onOpenChange={(open) => {
        if (!open) {
          setPrescriptionPatientId(null);
          form.reset();
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Prescription</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitPrescription)} className="space-y-6">
              <FormField
                control={form.control}
                name="diagnosis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diagnosis</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Acute Bronchitis" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">Medications</h4>
                  <Button type="button" variant="outline" size="sm" onClick={addMedication}>
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
                
                {form.watch("medications").map((_, index) => (
                  <Card key={index} className="bg-gray-50 border-dashed">
                    <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-2 top-2 text-gray-400 hover:text-red-500"
                        onClick={() => removeMedication(index)}
                        disabled={form.watch("medications").length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      
                      <FormField
                        control={form.control}
                        name={`medications.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Medicine Name</FormLabel>
                            <FormControl><Input placeholder="e.g. Amoxicillin" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`medications.${index}.dosage`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Dosage</FormLabel>
                            <FormControl><Input placeholder="e.g. 500mg" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`medications.${index}.frequency`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Frequency</FormLabel>
                            <FormControl><Input placeholder="e.g. Twice a day" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`medications.${index}.duration`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Duration</FormLabel>
                            <FormControl><Input placeholder="e.g. 5 days" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Input placeholder="Rest, drink plenty of fluids..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={createPrescriptionMutation.isPending}>
                {createPrescriptionMutation.isPending ? "Saving..." : "Save Prescription"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
