import { Router, Switch, Route } from "wouter";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import BookAppointment from "@/pages/BookAppointment";
import Appointments from "@/pages/Appointments";
import MedicalRecords from "@/pages/MedicalRecords";
import Prescriptions from "@/pages/Prescriptions";
import NearbyServices from "@/pages/NearbyServices";
import Emergency from "@/pages/Emergency";
import MedicalStore from "@/pages/MedicalStore";
import Admin from "@/pages/Admin";
import DoctorDashboard from "@/pages/DoctorDashboard";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/nearby-services" component={NearbyServices} />
            <Route path="/dashboard">
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            </Route>
            <Route path="/book-appointment">
              <ProtectedRoute roles={["patient"]}><BookAppointment /></ProtectedRoute>
            </Route>
            <Route path="/appointments">
              <ProtectedRoute roles={["patient"]}><Appointments /></ProtectedRoute>
            </Route>
            <Route path="/medical-records">
              <ProtectedRoute roles={["patient"]}><MedicalRecords /></ProtectedRoute>
            </Route>
            <Route path="/prescriptions">
              <ProtectedRoute roles={["patient"]}><Prescriptions /></ProtectedRoute>
            </Route>
            <Route path="/emergency">
              <ProtectedRoute roles={["patient"]}><Emergency /></ProtectedRoute>
            </Route>
            <Route path="/medical-store">
              <ProtectedRoute roles={["patient"]}><MedicalStore /></ProtectedRoute>
            </Route>
            <Route path="/doctor-dashboard">
              <ProtectedRoute roles={["doctor"]}><DoctorDashboard /></ProtectedRoute>
            </Route>
            <Route path="/admin">
              <ProtectedRoute roles={["admin"]}><Admin /></ProtectedRoute>
            </Route>
            <Route>
              <div className="flex items-center justify-center min-h-[60vh] text-gray-500 text-xl">
                404 — Page not found
              </div>
            </Route>
          </Switch>
        </main>
      </div>
    </Router>
  );
}
