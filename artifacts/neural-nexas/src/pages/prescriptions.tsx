import { useGetPrescriptions } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { format } from "date-fns";
import { Pill, Calendar } from "lucide-react";

export default function Prescriptions() {
  const { data: prescriptions, isLoading } = useGetPrescriptions();

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Prescriptions</h1>

      {isLoading ? (
        <div className="flex justify-center p-12"><Spinner size="lg" /></div>
      ) : prescriptions?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-dashed text-gray-500">
          No prescriptions found.
        </div>
      ) : (
        <div className="grid gap-6">
          {prescriptions?.map((rx) => (
            <Card key={rx.id} className="shadow-sm border-blue-100">
              <CardHeader className="bg-blue-50/50 border-b border-blue-100 pb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg text-blue-900">
                      Prescribed by {rx.doctorName || "Doctor"}
                    </CardTitle>
                    {rx.diagnosis && (
                      <p className="text-sm text-blue-700 mt-1 font-medium">Diagnosis: {rx.diagnosis}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      {format(new Date(rx.createdAt), 'MMM dd, yyyy')}
                    </div>
                    {rx.validUntil && (
                      <div className="text-xs text-red-500 mt-1">
                        Valid until {format(new Date(rx.validUntil), 'MMM dd, yyyy')}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-4 text-gray-700 flex items-center">
                  <Pill className="h-4 w-4 mr-2" /> Medications
                </h4>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {rx.medications.map((med, idx) => (
                    <div key={idx} className="bg-white border rounded-lg p-3 shadow-sm">
                      <div className="font-bold text-gray-900">{med.name}</div>
                      <div className="text-sm text-gray-600 mt-1">{med.dosage}</div>
                      <div className="text-xs font-medium text-blue-600 mt-2 bg-blue-50 px-2 py-1 rounded inline-block">
                        {med.frequency}
                      </div>
                      {med.duration && (
                        <div className="text-xs text-gray-500 mt-2">For {med.duration}</div>
                      )}
                    </div>
                  ))}
                </div>
                
                {rx.notes && (
                  <div className="mt-6 p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm border border-yellow-100">
                    <span className="font-bold">Doctor's Notes:</span> {rx.notes}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
