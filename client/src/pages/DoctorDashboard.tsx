import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import { Calendar, Users, FileText, CheckCircle, Clock, XCircle, Plus, ChevronRight, Activity, AlertCircle } from "lucide-react";

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  type: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
}

interface PrescriptionForm {
  patientId: string;
  patientName: string;
  diagnosis: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
  notes: string;
}

export default function DoctorDashboard() {
  const queryClient = useQueryClient();
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [prescriptionForm, setPrescriptionForm] = useState<PrescriptionForm>({
    patientId: "",
    patientName: "",
    diagnosis: "",
    medications: [{ name: "", dosage: "", frequency: "", duration: "" }],
    notes: ""
  });

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: api.getMe,
    retry: false
  });

  const { data: appointments = [], isLoading, error } = useQuery({
    queryKey: ["appointments"],
    queryFn: api.getAppointments
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.updateAppointment(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    }
  });

  const createPrescriptionMutation = useMutation({
    mutationFn: () => api.createPrescription(prescriptionForm),
    onSuccess: () => {
      setShowPrescriptionModal(false);
      setSelectedAppointment(null);
      setPrescriptionForm({
        patientId: "",
        patientName: "",
        diagnosis: "",
        medications: [{ name: "", dosage: "", frequency: "", duration: "" }],
        notes: ""
      });
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
    }
  });

  const handleStatusUpdate = (id: string, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  const handleWritePrescription = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setPrescriptionForm({
      ...prescriptionForm,
      patientId: appointment.id,
      patientName: appointment.patientName
    });
    setShowPrescriptionModal(true);
  };

  const addMedication = () => {
    setPrescriptionForm({
      ...prescriptionForm,
      medications: [
        ...prescriptionForm.medications,
        { name: "", dosage: "", frequency: "", duration: "" }
      ]
    });
  };

  const updateMedication = (index: number, field: string, value: string) => {
    const updated = [...prescriptionForm.medications];
    updated[index] = { ...updated[index], [field]: value };
    setPrescriptionForm({ ...prescriptionForm, medications: updated });
  };

  const removeMedication = (index: number) => {
    setPrescriptionForm({
      ...prescriptionForm,
      medications: prescriptionForm.medications.filter((_, i) => i !== index)
    });
  };

  const stats = {
    pending: appointments.filter((a: Appointment) => a.status === "pending").length,
    confirmed: appointments.filter((a: Appointment) => a.status === "confirmed").length,
    completed: appointments.filter((a: Appointment) => a.status === "completed").length,
    total: appointments.length
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to load dashboard</h3>
          <p className="text-red-600">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back, Dr. {user?.name}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
            </div>
            <p className="text-sm text-gray-600">Total Appointments</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <span className="text-2xl font-bold text-amber-600">{stats.pending}</span>
            </div>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-5 h-5 text-blue-500" />
              <span className="text-2xl font-bold text-blue-600">{stats.confirmed}</span>
            </div>
            <p className="text-sm text-gray-600">Confirmed</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-5 h-5 text-emerald-500" />
              <span className="text-2xl font-bold text-emerald-600">{stats.completed}</span>
            </div>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="font-semibold text-gray-900">Today's Appointments</h2>
          </div>
          
          {appointments.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No appointments scheduled</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {appointments.map((appointment: Appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{appointment.patientName}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">{appointment.date}</p>
                        <p className="text-xs text-gray-400">{appointment.time}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600 capitalize">
                          {appointment.type?.replace("-", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          appointment.status === "pending" ? "bg-amber-100 text-amber-700" :
                          appointment.status === "confirmed" ? "bg-blue-100 text-blue-700" :
                          appointment.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {appointment.status === "pending" && (
                            <button
                              onClick={() => handleStatusUpdate(appointment.id, "confirmed")}
                              className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
                            >
                              Confirm
                            </button>
                          )}
                          {appointment.status === "confirmed" && (
                            <>
                              <button
                                onClick={() => handleWritePrescription(appointment)}
                                className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition"
                              >
                                Prescribe
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(appointment.id, "completed")}
                                className="text-xs bg-gray-600 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition"
                              >
                                Complete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Prescription Modal */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Write Prescription</h2>
              <button
                onClick={() => setShowPrescriptionModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                <input
                  type="text"
                  value={prescriptionForm.patientName}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
                <input
                  type="text"
                  value={prescriptionForm.diagnosis}
                  onChange={(e) => setPrescriptionForm({ ...prescriptionForm, diagnosis: e.target.value })}
                  placeholder="e.g., Acute Bronchitis, Hypertension"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Medications</label>
                  <button
                    onClick={addMedication}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Medication
                  </button>
                </div>
                <div className="space-y-3">
                  {prescriptionForm.medications.map((med, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Medication name"
                          value={med.name}
                          onChange={(e) => updateMedication(index, "name", e.target.value)}
                          className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="Dosage (e.g., 500mg)"
                          value={med.dosage}
                          onChange={(e) => updateMedication(index, "dosage", e.target.value)}
                          className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Frequency (e.g., Twice daily)"
                          value={med.frequency}
                          onChange={(e) => updateMedication(index, "frequency", e.target.value)}
                          className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="Duration (e.g., 7 days)"
                          value={med.duration}
                          onChange={(e) => updateMedication(index, "duration", e.target.value)}
                          className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      {prescriptionForm.medications.length > 1 && (
                        <button
                          onClick={() => removeMedication(index)}
                          className="mt-2 text-xs text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                <textarea
                  value={prescriptionForm.notes}
                  onChange={(e) => setPrescriptionForm({ ...prescriptionForm, notes: e.target.value })}
                  rows={3}
                  placeholder="Any special instructions or notes for the patient..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => createPrescriptionMutation.mutate()}
                  disabled={createPrescriptionMutation.isPending}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {createPrescriptionMutation.isPending ? "Saving..." : "Save Prescription"}
                </button>
                <button
                  onClick={() => setShowPrescriptionModal(false)}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
