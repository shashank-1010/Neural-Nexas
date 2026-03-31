import { useState } from "react";
import { useGetRecords, useCreateRecord, getGetRecordsQueryKey, MedicalRecordInputType } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Image as ImageIcon, Syringe, ClipboardList, Plus } from "lucide-react";

const recordSchema = z.object({
  title: z.string().min(2, "Title is required"),
  type: z.enum(["lab-report", "imaging", "discharge-summary", "consultation", "vaccination", "other"]),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
});

type RecordFormValues = z.infer<typeof recordSchema>;

export default function MedicalRecords() {
  const { data: records, isLoading } = useGetRecords();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const createMutation = useCreateRecord();
  const [open, setOpen] = useState(false);

  const form = useForm<RecordFormValues>({
    resolver: zodResolver(recordSchema),
    defaultValues: {
      title: "",
      type: "lab-report",
      description: "",
      date: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = (data: RecordFormValues) => {
    createMutation.mutate(
      { data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetRecordsQueryKey() });
          toast({ title: "Record added successfully" });
          setOpen(false);
          form.reset();
        },
        onError: () => toast({ variant: "destructive", title: "Failed to add record" })
      }
    );
  };

  const getIcon = (type: string) => {
    switch(type) {
      case "lab-report": return <FileText className="h-5 w-5 text-blue-500" />;
      case "imaging": return <ImageIcon className="h-5 w-5 text-purple-500" />;
      case "vaccination": return <Syringe className="h-5 w-5 text-green-500" />;
      default: return <ClipboardList className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Add Record</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Medical Record</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl><Input placeholder="e.g. Blood Test Results" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Record Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="lab-report">Lab Report</SelectItem>
                          <SelectItem value="imaging">Imaging (X-Ray/MRI)</SelectItem>
                          <SelectItem value="discharge-summary">Discharge Summary</SelectItem>
                          <SelectItem value="consultation">Consultation Note</SelectItem>
                          <SelectItem value="vaccination">Vaccination</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl><Input type="date" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl><Input placeholder="Brief notes about this record" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Adding..." : "Save Record"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center"><Spinner size="lg" /></div>
      ) : records?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-dashed text-gray-500">
          No medical records found. Upload your first record to keep track of your health.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {records?.map((record) => (
            <Card key={record.id} className="shadow-sm">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  {getIcon(record.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">{record.title}</h3>
                    <Badge variant="outline" className="capitalize text-xs">
                      {record.type.replace("-", " ")}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {record.date ? format(new Date(record.date), 'MMM dd, yyyy') : format(new Date(record.createdAt), 'MMM dd, yyyy')}
                  </p>
                  {record.description && (
                    <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                      {record.description}
                    </p>
                  )}
                  {record.doctorName && (
                    <p className="text-xs text-gray-500 mt-2">Added by Dr. {record.doctorName}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
