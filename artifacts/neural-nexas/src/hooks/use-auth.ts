import { useGetMe, getGetMeQueryKey } from "@workspace/api-client-react";
import { getToken, removeToken } from "../lib/auth";
import { useQueryClient } from "@tanstack/react-query";

export function useAuth() {
  const token = getToken();
  const queryClient = useQueryClient();
  
  const { data: user, isLoading } = useGetMe({
    query: {
      enabled: !!token,
      queryKey: getGetMeQueryKey()
    }
  });

  const logout = () => {
    removeToken();
    queryClient.clear();
    window.location.href = "/login";
  };

  return {
    user: token && user ? user : null,
    isLoading: !!token && isLoading,
    isAuthenticated: !!token && !!user,
    logout,
  };
}
