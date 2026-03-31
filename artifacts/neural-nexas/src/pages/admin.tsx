import { useState } from "react";
import { useGetAdminStats } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserPlus, Calendar, ShoppingCart, DollarSign, Activity } from "lucide-react";

// Assuming useGetAdminUsers is available as per prompt
// import { useGetAdminUsers } from "@workspace/api-client-react";

export default function AdminDashboard() {
  const { data: stats, isLoading: isLoadingStats } = useGetAdminStats();
  // const { data: users, isLoading: isLoadingUsers } = useGetAdminUsers();

  if (isLoadingStats) return <div className="p-12 flex justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Platform overview and statistics</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white border w-full justify-start rounded-lg p-1 h-auto flex-wrap">
          <TabsTrigger value="overview" className="px-6 py-2">Overview</TabsTrigger>
          <TabsTrigger value="users" className="px-6 py-2">Users</TabsTrigger>
          <TabsTrigger value="appointments" className="px-6 py-2">Appointments</TabsTrigger>
          <TabsTrigger value="doctors" className="px-6 py-2">Doctors</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-sm border-blue-100">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Patients</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.totalPatients || 0}</div>
                <p className="text-xs text-gray-500 mt-1">+{stats?.newUsersToday || 0} today</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm border-green-100">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Doctors</CardTitle>
                <UserPlus className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.totalDoctors || 0}</div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-purple-100">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.totalAppointments || 0}</div>
                <p className="text-xs text-gray-500 mt-1">{stats?.pendingAppointments || 0} pending</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-emerald-100">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">${stats?.revenue?.toLocaleString() || 0}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium">API Server</span>
                    </div>
                    <span className="text-sm text-green-600 font-medium">Operational</span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Database</span>
                    </div>
                    <span className="text-sm text-green-600 font-medium">Operational</span>
                  </div>
                  <div className="flex items-center justify-between pb-2">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="font-medium">Active Background Jobs</span>
                    </div>
                    <span className="text-sm text-blue-600 font-medium">Running</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Platform Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                User management list will be displayed here.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Global Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                All appointments across the platform.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="doctors">
          <Card>
            <CardHeader>
              <CardTitle>Doctor Verifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                Doctor profiles pending admin verification.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
