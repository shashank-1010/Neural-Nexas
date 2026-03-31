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
    <div className="flex flex-col bg-slate-50">
      <section className="bg-gradient-to-br from-blue-50 via-cyan-50 to-white py-20 px-4 text-center border-b border-blue-100">
        <div className="max-w-4xl mx-auto">
          <p className="inline-flex items-center rounded-full border border-blue-200 bg-white/90 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-blue-700 mb-6">
            Digital Hospital Ecosystem
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
            Healthcare made <span className="text-blue-600">smart and simple.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-3xl mx-auto">
            Neural Nexas connects patients, doctors, and hospitals on one secure platform.
            Book appointments, manage records, and get care fast with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-blue-600 text-white text-base px-8 py-3 rounded-xl hover:bg-blue-700 font-semibold shadow-sm transition-colors">
              Get Started
            </Link>
            <Link href="/nearby-services" className="border border-blue-200 bg-white text-slate-700 text-base px-8 py-3 rounded-xl hover:border-blue-400 hover:bg-blue-50 font-semibold transition-colors">
              Find Services Near You
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Comprehensive Healthcare Platform</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Everything you need to manage your health in one secure app.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="border border-slate-200 bg-white rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="text-blue-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-700 to-teal-600 py-14 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to take control of your health?</h2>
          <p className="text-blue-100 mb-8">Join thousands of patients and doctors on Neural Nexas today.</p>
          <Link href="/register" className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 inline-block transition-colors">
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}
