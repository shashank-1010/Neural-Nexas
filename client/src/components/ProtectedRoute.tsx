import { ReactNode } from "react";
import { Redirect } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";

interface Props {
  children: ReactNode;
  roles?: string[];
}

export function ProtectedRoute({ children, roles }: Props) {
  const token = localStorage.getItem("nn_token");
  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: api.getMe,
    enabled: !!token,
    retry: false,
  });

  if (!token) return <Redirect to="/login" />;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Redirect to="/login" />;
  if (roles && !roles.includes(user.role)) return <Redirect to="/dashboard" />;

  return <>{children}</>;
}
