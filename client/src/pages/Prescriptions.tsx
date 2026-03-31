import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { 
  Pill, 
  Calendar, 
  User, 
  FileText, 
  Clock, 
  AlertCircle,
  Search,
  Filter,
  ChevronDown,
  Download,
  Printer,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

interface Prescription {
  id: string;
  doctorName: string;
  patientName: string;
  diagnosis: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
  notes: string;
  validUntil: string;
  createdAt: string;
  updatedAt: string;
}

export default function Prescriptions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  
  const { data: prescriptions = [], isLoading, error } = useQuery({
    queryKey: ["prescriptions"],
    queryFn: api.getPrescriptions
  });

  // Filter prescriptions
  const filteredPrescriptions = prescriptions.filter((rx: Prescription) => {
    const matchesSearch = rx.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rx.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rx.medications?.some(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Check if prescription is valid (not expired)
    const isValid = rx.validUntil ? new Date(rx.validUntil) > new Date() : true;
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "active" && isValid) ||
                         (filterStatus === "expired" && !isValid);
    
    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (validUntil: string) => {
    if (!validUntil) return { label: "Active", color: "green", bg: "bg-green-50", text: "text-green-700" };
    const isValid = new Date(validUntil) > new Date();
    if (isValid) {
      return { label: "Active", color: "green", bg: "bg-green-50", text: "text-green-700" };
    } else {
      return { label: "Expired", color: "red", bg: "bg-red-50", text: "text-red-700" };
    }
  };

  const formatDate = (date: string) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (date: string) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const stats = {
    total: prescriptions.length,
    active: prescriptions.filter((rx: Prescription) => 
      !rx.validUntil || new Date(rx.validUntil) > new Date()
    ).length,
    expired: prescriptions.filter((rx: Prescription) => 
      rx.validUntil && new Date(rx.validUntil) <= new Date()
    ).length
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading prescriptions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to load prescriptions</h3>
          <p className="text-red-600">Please try again later</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Prescription History</h1>
        <p className="text-gray-500 text-sm mt-1">
          Review all your medications, dosages, and treatment plans prescribed by your doctors
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500">Total Prescriptions</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          <p className="text-xs text-gray-500">Active</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
          <p className="text-xs text-gray-500">Expired</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by doctor, diagnosis, or medication..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition"
          >
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">
              {filterStatus === "all" ? "All Prescriptions" : 
               filterStatus === "active" ? "Active" : "Expired"}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
          {showFilterDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
              <button
                onClick={() => { setFilterStatus("all"); setShowFilterDropdown(false); }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-t-xl"
              >
                All Prescriptions
              </button>
              <button
                onClick={() => { setFilterStatus("active"); setShowFilterDropdown(false); }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
              >
                Active
              </button>
              <button
                onClick={() => { setFilterStatus("expired"); setShowFilterDropdown(false); }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-b-xl"
              >
                Expired
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Prescriptions List */}
      {filteredPrescriptions.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-12 text-center">
          {searchTerm || filterStatus !== "all" ? (
            <>
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No matching prescriptions found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
              <button
                onClick={() => { setSearchTerm(""); setFilterStatus("all"); }}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Clear filters
              </button>
            </>
          ) : (
            <>
              <Pill className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No prescriptions yet</h3>
              <p className="text-gray-500">Your prescriptions will appear here after your doctor prescribes medication</p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPrescriptions.map((prescription: Prescription) => {
            const statusConfig = getStatusConfig(prescription.validUntil);
            
            return (
              <div 
                key={prescription.id} 
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() => setSelectedPrescription(prescription)}
              >
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4 text-gray-400" />
                        <p className="font-semibold text-gray-900 text-lg">
                          Dr. {prescription.doctorName || "Medical Professional"}
                        </p>
                      </div>
                      {prescription.diagnosis && (
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          Diagnosis: {prescription.diagnosis}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                        {statusConfig.label}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(prescription.createdAt)}</span>
                        <span>•</span>
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(prescription.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Medications */}
                  <div className="space-y-2 mb-3">
                    <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Pill className="w-4 h-4 text-blue-600" />
                      Medications ({prescription.medications?.length || 0})
                    </p>
                    <div className="grid gap-2">
                      {prescription.medications?.slice(0, 2).map((med, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-blue-50/50 rounded-lg p-2">
                          <Pill size={14} className="text-blue-600 mt-0.5 shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{med.name}</p>
                            <p className="text-xs text-gray-600">
                              {med.dosage} • {med.frequency}
                              {med.duration && ` • ${med.duration}`}
                            </p>
                          </div>
                        </div>
                      ))}
                      {prescription.medications?.length > 2 && (
                        <p className="text-xs text-blue-600">
                          +{prescription.medications.length - 2} more medications
                        </p>
                      )}
                    </div>
                  </div>

                  {prescription.notes && (
                    <p className="text-sm text-gray-500 italic border-l-2 border-gray-200 pl-3 mt-2 line-clamp-2">
                      "{prescription.notes}"
                    </p>
                  )}

                  <div className="flex justify-end mt-3">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <ChevronRight className="w-4 h-4" />
                      <span>Click to view full details</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Prescription Details Modal */}
      {selectedPrescription && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Prescription Details</h2>
                <p className="text-sm text-gray-500">Complete medication information</p>
              </div>
              <button
                onClick={() => setSelectedPrescription(null)}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <ChevronDown className="w-5 h-5 text-gray-400 rotate-90" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Prescribed by</p>
                    <p className="font-semibold text-gray-900 text-lg">Dr. {selectedPrescription.doctorName}</p>
                    {selectedPrescription.diagnosis && (
                      <p className="text-sm text-gray-600 mt-1">Diagnosis: {selectedPrescription.diagnosis}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Prescribed on</p>
                    <p className="text-sm font-medium text-gray-700">{formatDate(selectedPrescription.createdAt)}</p>
                    <p className="text-xs text-gray-400">{formatTime(selectedPrescription.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Medications List */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Pill className="w-4 h-4 text-blue-600" />
                  Medications
                </h3>
                <div className="space-y-3">
                  {selectedPrescription.medications?.map((med, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-xl p-4 hover:border-blue-200 transition">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">{med.name}</h4>
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          {med.dosage}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-xs text-gray-500">Frequency</p>
                          <p className="text-gray-700">{med.frequency}</p>
                        </div>
                        {med.duration && (
                          <div>
                            <p className="text-xs text-gray-500">Duration</p>
                            <p className="text-gray-700">{med.duration}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Notes */}
              {selectedPrescription.notes && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Additional Notes</h3>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-gray-700 italic">{selectedPrescription.notes}</p>
                  </div>
                </div>
              )}

              {/* Validity */}
              {selectedPrescription.validUntil && (
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">Valid Until</p>
                    <p className="font-medium text-gray-900">{formatDate(selectedPrescription.validUntil)}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => window.print()}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
                <button
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
