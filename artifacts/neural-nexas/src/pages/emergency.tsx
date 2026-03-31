import { useState } from "react";
import { useTriggerEmergency } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, MapPin, Phone } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";

const emergencySchema = z.object({
  location: z.string().min(5, "Please provide a specific location"),
  description: z.string().min(5, "Please describe the emergency"),
  contactNumber: z.string().optional(),
});

type EmergencyFormValues = z.infer<typeof emergencySchema>;

export default function Emergency() {
  const { toast } = useToast();
  const triggerMutation = useTriggerEmergency();
  const [activeEmergency, setActiveEmergency] = useState<any>(null);

  const form = useForm<EmergencyFormValues>({
    resolver: zodResolver(emergencySchema),
    defaultValues: {
      location: "",
      description: "",
      contactNumber: "",
    },
  });

  const onSubmit = (data: EmergencyFormValues) => {
    triggerMutation.mutate(
      { data },
      {
        onSuccess: (response) => {
          setActiveEmergency(response);
          toast({
            title: "Emergency Triggered",
            description: "Help is on the way. Please stay calm.",
            variant: "destructive",
          });
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Failed to trigger emergency",
            description: "Please call 911 immediately.",
          });
        }
      }
    );
  };

  if (activeEmergency) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 bg-red-50">
        <Card className="w-full max-w-md border-red-200 shadow-xl">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-20 w-20 text-red-600 mx-auto mb-6 animate-pulse" />
            <h2 className="text-3xl font-bold text-red-700 mb-2">Help is Dispatched</h2>
            <p className="text-gray-700 mb-8">{activeEmergency.message}</p>
            
            <div className="bg-white rounded-lg p-6 border border-red-100 text-left space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500 font-medium">Nearest Hospital</div>
                  <div className="font-semibold">{activeEmergency.nearestHospital || "City General Hospital"}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500 font-medium">Estimated Arrival</div>
                  <div className="font-semibold text-red-600">{activeEmergency.estimatedResponse}</div>
                </div>
              </div>
            </div>
            
            <p className="text-sm font-medium text-gray-600">
              Reference ID: {activeEmergency.emergencyId}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-red-600 mb-4 flex items-center justify-center gap-3">
          <AlertTriangle className="h-10 w-10" />
          Emergency Response
        </h1>
        <p className="text-xl text-gray-600">
          Only use this in case of a severe medical emergency.
        </p>
      </div>

      <Card className="border-red-200 shadow-lg">
        <CardContent className="p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Where are you right now?</FormLabel>
                    <FormControl>
                      <Input placeholder="Full address or landmark" className="text-lg h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">What is the emergency?</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g. heart attack, severe bleeding, accident" className="text-lg h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Best number to reach you" className="text-lg h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                size="lg"
                className="w-full h-16 text-xl bg-red-600 hover:bg-red-700 text-white shadow-md transition-transform hover:scale-[1.02]"
                disabled={triggerMutation.isPending}
              >
                {triggerMutation.isPending ? "Dispatching Help..." : "TRIGGER EMERGENCY"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="mt-10 text-center">
        <p className="text-gray-500 font-medium">Or call emergency services directly:</p>
        <div className="text-3xl font-bold text-gray-900 mt-2">911</div>
      </div>
    </div>
  );
}
