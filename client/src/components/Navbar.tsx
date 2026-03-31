import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { HeartPulse, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const token = localStorage.getItem("nn_token");
  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: api.getMe,
    enabled: !!token,
    retry: false,
  });

  const logout = () => {
    localStorage.removeItem("nn_token");
    window.location.href = "/";
  };

  const allLinks = [
    { label: "Home", href: "/", roles: ["all"] },
    { label: "Dashboard", href: "/dashboard", roles: ["patient", "doctor", "admin"] },
    { label: "Doctor Panel", href: "/doctor-dashboard", roles: ["doctor"] },
    { label: "Admin Panel", href: "/admin", roles: ["admin"] },
    { label: "Appointments", href: "/appointments", roles: ["patient"] },
    { label: "Records", href: "/medical-records", roles: ["patient"] },
    { label: "Prescriptions", href: "/prescriptions", roles: ["patient"] },
    { label: "Pharmacy", href: "/medical-store", roles: ["patient"] },
    { label: "Nearby", href: "/nearby-services", roles: ["all"] },
    { label: "Emergency", href: "/emergency", roles: ["patient"], danger: true },
  ];

  const links = allLinks.filter(
    (l) => l.roles.includes("all") || (user && l.roles.includes(user.role))
  );

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-blue-600 font-bold text-lg">
          <HeartPulse size={22} />
          Neural Nexas
        </Link>

        <nav className="hidden md:flex items-center gap-5">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-medium hover:text-blue-600 transition-colors ${l.danger ? "text-red-600 font-bold" : "text-gray-600"}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                {user.name} <span className="text-blue-600 capitalize">({user.role})</span>
              </span>
              <button
                onClick={logout}
                className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href="/login" className="text-sm text-gray-600 hover:text-blue-600 px-3 py-1.5">
                Log in
              </Link>
              <Link href="/register" className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700">
                Register
              </Link>
            </div>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t bg-white px-4 py-4 flex flex-col gap-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`text-base font-medium ${l.danger ? "text-red-600" : "text-gray-700"}`}
            >
              {l.label}
            </Link>
          ))}
          {user ? (
            <button onClick={logout} className="text-left text-red-600 mt-2">Logout</button>
          ) : (
            <div className="flex gap-3 mt-2">
              <Link href="/login" onClick={() => setOpen(false)} className="text-gray-700">Log in</Link>
              <Link href="/register" onClick={() => setOpen(false)} className="text-blue-600 font-medium">Register</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
