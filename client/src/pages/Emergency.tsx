import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/api";
import { AlertTriangle, Phone, MapPin, Clock, Ambulance, Shield } from "lucide-react";

interface EmergencyResponse {
  message: string;
  emergencyId: string;
  estimatedResponse: string;
  nearestHospital: string;
}

const EMERGENCY_CONTACTS = [
  { name: "Ambulance", number: "108", icon: Ambulance },
  { name: "Police", number: "100", icon: Shield },
  { name: "Fire", number: "101", icon: AlertTriangle },
  { name: "Women Helpline", number: "1091", icon: Phone }
];

export default function Emergency() {
  const [formData, setFormData] = useState({
    location: "",
    description: "",
    contactNumber: ""
  });
  const [response, setResponse] = useState<EmergencyResponse | null>(null);

  const triggerMutation = useMutation({
    mutationFn: () => api.triggerEmergency(formData),
    onSuccess: (data) => setResponse(data)
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.location && formData.description) {
      triggerMutation.mutate();
    }
  };

  if (response) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Emergency Alert Sent</h1>
          <p className="text-gray-600 mb-6">{response.message}</p>
          
          <div className="bg-white rounded-xl p-5 text-left space-y-3 border border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Emergency ID</span>
              <span className="font-mono text-sm font-semibold text-gray-900">{response.emergencyId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Est. Response Time</span>
              <span className="font-medium text-emerald-600 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {response.estimatedResponse}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Nearest Hospital</span>
              <span className="font-medium text-gray-900 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {response.nearestHospital}
              </span>
            </div>
          </div>
          
          <button
            onClick={() => setResponse(null)}
            className="mt-6 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Send Another Alert
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8 text-center">
        <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-3" />
        <h1 className="text-2xl font-bold text-red-700 mb-1">Emergency Assistance</h1>
        <p className="text-red-600 text-sm">
          Use this feature only for genuine medical emergencies
        </p>
      </div>

      {/* Emergency Form */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Location <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., MG Road, Koramangala, Bangalore"
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the emergency situation in detail..."
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={triggerMutation.isPending}
            className="w-full bg-red-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-red-700 disabled:opacity-50 transition shadow-lg"
          >
            {triggerMutation.isPending ? "Sending Alert..." : "TRIGGER EMERGENCY ALERT"}
          </button>
        </form>
      </div>

      {/* Emergency Contacts */}
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
        <h3 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
          <Phone className="w-4 h-4" /> Emergency Contacts
        </h3>
        <div className="space-y-2">
          {EMERGENCY_CONTACTS.map((contact) => {
            const Icon = contact.icon;
            return (
              <a
                key={contact.name}
                href={`tel:${contact.number}`}
                className="flex items-center justify-between p-3 bg-white rounded-xl border border-orange-200 hover:shadow-md transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Icon className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="font-medium text-gray-900">{contact.name}</span>
                </div>
                <span className="font-bold text-orange-700">{contact.number}</span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-400">
          By submitting this alert, you consent to sharing your location with emergency services.
          This is not a substitute for calling emergency services directly.
        </p>
      </div>
    </div>
  );
}
