import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { MapPin, Phone, Star, Clock } from "lucide-react";

const typeColor: Record<string, string> = {
  hospital: "bg-red-100 text-red-700",
  pharmacy: "bg-green-100 text-green-700",
  clinic: "bg-blue-100 text-blue-700",
  "diagnostic-center": "bg-purple-100 text-purple-700",
};

export default function NearbyServices() {
  const { data = [], isLoading } = useQuery({ queryKey: ["stores"], queryFn: api.getStores });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Nearby Healthcare Services</h1>
      <p className="text-gray-500 mb-6">Hospitals, pharmacies, clinics, and diagnostic centers near you.</p>

      {isLoading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : data.length === 0 ? (
        <div className="text-center py-16 text-gray-400 border border-dashed rounded-xl">No services found.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {data.map((s: any) => (
            <div key={s.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-gray-900">{s.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${typeColor[s.type] || "bg-gray-100 text-gray-600"}`}>
                    {s.type?.replace("-", " ")}
                  </span>
                </div>
                <div className={`text-xs px-2 py-1 rounded-full font-medium ${s.isOpen ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {s.isOpen ? "Open" : "Closed"}
                </div>
              </div>

              <div className="space-y-1.5 text-sm text-gray-600">
                <div className="flex items-center gap-2"><MapPin size={14} className="text-gray-400" />{s.address}</div>
                {s.phone && <div className="flex items-center gap-2"><Phone size={14} className="text-gray-400" />{s.phone}</div>}
                <div className="flex items-center gap-2"><Clock size={14} className="text-gray-400" />{s.openHours}</div>
                <div className="flex items-center gap-2">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  <span>{s.rating} • {s.distance}</span>
                </div>
              </div>

              {s.services?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {s.services.map((sv: string) => (
                    <span key={sv} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{sv}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
