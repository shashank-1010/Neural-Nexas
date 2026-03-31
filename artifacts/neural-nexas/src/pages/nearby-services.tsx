import { useState } from "react";
import { useGetStores } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { MapPin, Phone, Star, Clock, Search } from "lucide-react";

export default function NearbyServices() {
  const { data: stores, isLoading } = useGetStores();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStores = stores?.filter(store => 
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    store.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nearby Services</h1>
          <p className="text-gray-600 mt-1">Find verified hospitals, clinics, and pharmacies near you.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search services..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores?.map((store) => (
            <Card key={store.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{store.name}</h3>
                    <Badge variant="outline" className="mt-1 capitalize bg-gray-50 text-gray-700">
                      {store.type.replace("-", " ")}
                    </Badge>
                  </div>
                  {store.isOpen ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-0">Open</Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-0">Closed</Badge>
                  )}
                </div>

                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                    <span>{store.address}</span>
                  </div>
                  {store.distance && (
                    <div className="flex items-center gap-2 font-medium text-blue-600">
                      <MapPin className="h-4 w-4 shrink-0" />
                      {store.distance} away
                    </div>
                  )}
                  {store.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                      {store.phone}
                    </div>
                  )}
                  {store.openHours && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400 shrink-0" />
                      {store.openHours}
                    </div>
                  )}
                </div>

                {store.rating && (
                  <div className="mt-4 pt-4 border-t flex items-center text-sm font-medium text-amber-600">
                    <Star className="h-4 w-4 fill-amber-500 mr-1" />
                    {store.rating} Rating
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {filteredStores?.length === 0 && !isLoading && (
        <div className="text-center py-12 text-gray-500">
          No services found matching your search.
        </div>
      )}
    </div>
  );
}
