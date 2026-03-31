import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import Home from "@/pages/home";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Dashboard from "@/pages/dashboard";
import BookAppointment from "@/pages/book-appointment";
import Appointments from "@/pages/appointments";
import MedicalRecords from "@/pages/medical-records";
import Prescriptions from "@/pages/prescriptions";
import NearbyServices from "@/pages/nearby-services";
import Emergency from "@/pages/emergency";
import MedicalStore from "@/pages/medical-store";
import AdminDashboard from "@/pages/admin";
import DoctorDashboard from "@/pages/doctor-dashboard";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/nearby-services" component={NearbyServices} />
      
      <Route path="/dashboard">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      
      <Route path="/book-appointment">
        <ProtectedRoute allowedRoles={["patient"]}>
          <BookAppointment />
        </ProtectedRoute>
      </Route>
      
      <Route path="/appointments">
        <ProtectedRoute allowedRoles={["patient"]}>
          <Appointments />
        </ProtectedRoute>
      </Route>
      
      <Route path="/medical-records">
        <ProtectedRoute allowedRoles={["patient"]}>
          <MedicalRecords />
        </ProtectedRoute>
      </Route>
      
      <Route path="/prescriptions">
        <ProtectedRoute allowedRoles={["patient"]}>
          <Prescriptions />
        </ProtectedRoute>
      </Route>
      
      <Route path="/emergency">
        <ProtectedRoute allowedRoles={["patient"]}>
          <Emergency />
        </ProtectedRoute>
      </Route>
      
      <Route path="/medical-store">
        <ProtectedRoute allowedRoles={["patient"]}>
          <MedicalStore />
        </ProtectedRoute>
      </Route>
      
      <Route path="/doctor-dashboard">
        <ProtectedRoute allowedRoles={["doctor"]}>
          <DoctorDashboard />
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin">
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminDashboard />
        </ProtectedRoute>
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <div className="min-h-screen flex flex-col w-full bg-gray-50">
            <Navbar />
            <main className="flex-1">
              <Router />
            </main>
          </div>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
