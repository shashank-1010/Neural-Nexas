import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { HeartPulse, LogOut, Menu, UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { label: "Home", href: "/", roles: ["all"] },
    { label: "Dashboard", href: "/dashboard", roles: ["patient", "doctor", "admin"] },
    { label: "Doctor Dashboard", href: "/doctor-dashboard", roles: ["doctor"] },
    { label: "Admin Panel", href: "/admin", roles: ["admin"] },
    { label: "Appointments", href: "/appointments", roles: ["patient"] },
    { label: "Records", href: "/medical-records", roles: ["patient"] },
    { label: "Prescriptions", href: "/prescriptions", roles: ["patient"] },
    { label: "Pharmacy", href: "/medical-store", roles: ["patient"] },
    { label: "Nearby Services", href: "/nearby-services", roles: ["all"] },
    { label: "Emergency", href: "/emergency", roles: ["patient"] },
  ];

  const filteredLinks = navLinks.filter(
    (link) =>
      link.roles.includes("all") ||
      (isAuthenticated && user && link.roles.includes(user.role))
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
          <HeartPulse className="h-6 w-6" />
          Neural Nexas
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {filteredLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${link.href === '/emergency' ? 'text-destructive font-bold' : 'text-muted-foreground'}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <div className="hidden md:flex gap-2">
              <Link href="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/register">
                <Button>Register</Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <UserCircle className="h-6 w-6 text-gray-600" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {user?.name && <p className="font-medium">{user.name}</p>}
                      {user?.email && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      )}
                      {user?.role && (
                        <p className="text-xs font-semibold text-primary capitalize">
                          Role: {user.role}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Mobile Nav */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                {filteredLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-lg font-medium transition-colors hover:text-primary ${link.href === '/emergency' ? 'text-destructive font-bold' : 'text-muted-foreground'}`}
                  >
                    {link.label}
                  </Link>
                ))}
                {!isAuthenticated ? (
                  <div className="flex flex-col gap-2 mt-4 pt-4 border-t">
                    <Link href="/login">
                      <Button variant="outline" className="w-full">Log in</Button>
                    </Link>
                    <Link href="/register">
                      <Button className="w-full">Register</Button>
                    </Link>
                  </div>
                ) : (
                  <Button variant="destructive" onClick={logout} className="mt-4">
                    Log out
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
