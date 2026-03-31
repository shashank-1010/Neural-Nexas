import { Link } from "wouter";
import { Activity, Clock, FileText, MapPin, ShieldCheck, Stethoscope } from "lucide-react";

const features = [
  { icon: Stethoscope, title: "Expert Doctors", desc: "Book with verified specialists across all medical fields." },
  { icon: FileText, title: "Digital Records", desc: "Store and access lab reports, prescriptions, and history." },
  { icon: Activity, title: "Emergency Response", desc: "One-tap alert connects you to the nearest hospital instantly." },
  { icon: MapPin, title: "Nearby Services", desc: "Find pharmacies, clinics, and hospitals near you." },
  { icon: Clock, title: "Zero-Wait Booking", desc: "Skip queues with smart scheduling and express slots." },
  { icon: ShieldCheck, title: "Secure & Private", desc: "Your data is protected with enterprise-grade security." },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="bg-blue-50 py-24 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            Healthcare made <span className="text-blue-600">smart and simple.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10">
            Neural Nexas connects patients, doctors, and hospitals on one secure platform.
            Book appointments, manage records, and get care — fast.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-blue-600 text-white text-lg px-8 py-4 rounded-lg hover:bg-blue-700 font-semibold">
              Get Started
            </Link>
            <Link href="/nearby-services" className="border border-gray-300 bg-white text-gray-700 text-lg px-8 py-4 rounded-lg hover:border-blue-400 font-semibold">
              Find Services Near You
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Comprehensive Healthcare Platform</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Everything you need to manage your health in one secure app.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                  <f.icon className="text-blue-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-600 py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to take control of your health?</h2>
          <p className="text-blue-100 mb-8">Join thousands of patients and doctors on Neural Nexas today.</p>
          <Link href="/register" className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 inline-block">
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}
