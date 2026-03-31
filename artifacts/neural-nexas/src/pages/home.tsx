import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock, ShieldCheck, Stethoscope, FileText, MapPin } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      {/* Hero Section */}
      <section className="bg-blue-50 py-20 lg:py-32 flex flex-col justify-center">
        <div className="container px-4 mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            Healthcare made <span className="text-primary">smart and simple.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10">
            Neural Nexas connects patients, doctors, and hospitals on a single, secure platform. 
            Book appointments, manage records, and get prescriptions with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 h-14">Get Started</Button>
            </Link>
            <Link href="/nearby-services">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 h-14 bg-white">
                Find Services Near You
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white flex-1">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Comprehensive Healthcare Platform</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Everything you need to manage your health, conveniently located in one secure application.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Stethoscope,
                title: "Expert Doctors",
                description: "Book online or in-person appointments with verified medical professionals across various specialties."
              },
              {
                icon: FileText,
                title: "Digital Records",
                description: "Securely store, organize, and access all your lab reports, prescriptions, and medical history."
              },
              {
                icon: Activity,
                title: "Emergency Response",
                description: "One-tap emergency alert system connects you to the nearest hospitals and dispatches immediate help."
              },
              {
                icon: MapPin,
                title: "Nearby Services",
                description: "Locate verified pharmacies, clinics, and diagnostic centers close to your location instantly."
              },
              {
                icon: Clock,
                title: "Zero-Wait Consultations",
                description: "Skip the waiting room with our intelligent queue management and real-time appointment tracking."
              },
              {
                icon: ShieldCheck,
                title: "Secure & Confidential",
                description: "Your health data is protected with enterprise-grade security and strict privacy controls."
              }
            ].map((feature, idx) => (
              <Card key={idx} className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
