import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import { 
  FileText, 
  Plus, 
  X, 
  Calendar, 
  FileImage, 
  File, 
  AlertCircle,
  Search,
  Filter,
  ChevronDown,
  Download,
  Eye,
  Trash2,
  ChevronRight
} from "lucide-react";

interface MedicalRecord {
  id: string;
  type: string;
  title: string;
  description: string;
  date: string;
  fileUrl?: string;
  createdAt: string;
}

const recordTypes = [
  { value: "lab-report", label: "Lab Report", icon: FileText, color: "blue", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  { value: "imaging", label: "Imaging", icon: FileImage, color: "purple", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  { value: "discharge-summary", label: "Discharge Summary", icon: File, color: "orange", bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  { value: "consultation", label: "Consultation", icon: FileText, color: "green", bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  { value: "vaccination", label: "Vaccination", icon: FileText, color: "teal", bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200" },
  { value: "other", label: "Other", icon: FileText, color: "gray", bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200" }
];

export default function MedicalRecords() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  
  const [formData, setFormData] = useState({
    type: "lab-report",
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    fileUrl: ""
  });

  const { data: records = [], isLoading, error } = useQuery({
    queryKey: ["records"],
    queryFn: api.getRecords
  });

  const createMutation = useMutation({
    mutationFn: () => api.createRecord(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["records"] });
      setShowForm(false);
      resetForm();
    }
  });

  const resetForm = () => {
    setFormData({
      type: "lab-report",
      title: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      fileUrl: ""
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim()) {
      createMutation.mutate();
    }
  };

  // Filter records based on search and type
  const filteredRecords = records.filter((record: MedicalRecord) => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || record.type === filterType;
    return matchesSearch && matchesType;
  });

  // Get record type configuration
  const getTypeConfig = (type: string) => {
    return recordTypes.find(t => t.value === type) || recordTypes[0];
  };

  // Format date for display
  const formatDate = (date: string) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Get statistics
  const stats = {
    total: records.length,
    labReports: records.filter((r: MedicalRecord) => r.type === "lab-report").length,
    imaging: records.filter((r: MedicalRecord) => r.type === "imaging").length,
    consultations: records.filter((r: MedicalRecord) => r.type === "consultation").length
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading medical records...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to load records</h3>
          <p className="text-red-600">Please try again later</p>
          <button 
            onClick={() => queryClient.invalidateQueries({ queryKey: ["records"] })}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Medical Records</h1>
          <p className="text-gray-500 text-sm mt-1">
            Access and manage all your health records securely in one place
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Record
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500">Total Records</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-2xl font-bold text-blue-600">{stats.labReports}</p>
          <p className="text-xs text-gray-500">Lab Reports</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-2xl font-bold text-purple-600">{stats.imaging}</p>
          <p className="text-xs text-gray-500">Imaging</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-2xl font-bold text-green-600">{stats.consultations}</p>
          <p className="text-xs text-gray-500">Consultations</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or description..."
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
              {filterType === "all" ? "All Types" : getTypeConfig(filterType).label}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
          {showFilterDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
              <button
                onClick={() => { setFilterType("all"); setShowFilterDropdown(false); }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-t-xl"
              >
                All Types
              </button>
              {recordTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => { setFilterType(type.value); setShowFilterDropdown(false); }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                >
                  {type.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Record Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Add Medical Record</h2>
                <p className="text-sm text-gray-500 mt-0.5">Upload and organize your health documents</p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Record Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {recordTypes.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Complete Blood Count Report"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Add any relevant details about this record..."
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File URL (Optional)</label>
                <input
                  type="url"
                  value={formData.fileUrl}
                  onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                  placeholder="https://example.com/document.pdf"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={createMutation.isPending || !formData.title.trim()}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {createMutation.isPending ? "Saving..." : "Save Record"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Records List */}
      {filteredRecords.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-12 text-center">
          {searchTerm || filterType !== "all" ? (
            <>
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No matching records found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
              <button
                onClick={() => { setSearchTerm(""); setFilterType("all"); }}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Clear filters
              </button>
            </>
          ) : (
            <>
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No medical records yet</h3>
              <p className="text-gray-500 mb-4">Add your first medical record to keep track of your health</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition"
              >
                Add Record
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecords.map((record: MedicalRecord) => {
            const typeConfig = getTypeConfig(record.type);
            const Icon = typeConfig.icon;
            
            return (
              <div 
                key={record.id} 
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all cursor-pointer group"
                onClick={() => setSelectedRecord(record)}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${typeConfig.bg} ${typeConfig.text} flex-shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 truncate">{record.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${typeConfig.bg} ${typeConfig.text}`}>
                          {typeConfig.label}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(record.date)}
                        </span>
                      </div>
                    </div>
                    {record.description && (
                      <p className="text-sm text-gray-500 line-clamp-2 mb-2">{record.description}</p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      {record.fileUrl && (
                        <a 
                          href={record.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                        >
                          <Download className="w-3 h-3" />
                          View File
                        </a>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedRecord(record); }}
                        className="flex items-center gap-1 text-gray-500 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition"
                      >
                        <Eye className="w-3 h-3" />
                        Details
                      </button>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Record Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Record Details</h2>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${getTypeConfig(selectedRecord.type).bg} ${getTypeConfig(selectedRecord.type).text}`}>
                  {(() => {
                    const Icon = getTypeConfig(selectedRecord.type).icon;
                    return <Icon className="w-5 h-5" />;
                  })()}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{selectedRecord.title}</h3>
                  <p className="text-sm text-gray-500">{getTypeConfig(selectedRecord.type).label}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm text-gray-500 mb-1">Date</p>
                <p className="text-gray-900">{formatDate(selectedRecord.date)}</p>
              </div>
              
              {selectedRecord.description && (
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-sm text-gray-500 mb-1">Description</p>
                  <p className="text-gray-700">{selectedRecord.description}</p>
                </div>
              )}
              
              {selectedRecord.fileUrl && (
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-sm text-gray-500 mb-1">File</p>
                  <a 
                    href={selectedRecord.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
                  >
                    <Download className="w-4 h-4" />
                    Download Document
                  </a>
                </div>
              )}
              
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-400">
                  Added on {new Date(selectedRecord.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
