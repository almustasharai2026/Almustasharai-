import { 
  useLogin, 
  useRegister, 
  useGetMe,
  useSendMessage,
  useUploadFile,
  useGenerateDocument,
  useAdminGetUsers,
  useAdminGetStats,
  useAdminChargeUser
} from "@workspace/api-client-react";
import { getAuthHeaders } from "@/lib/auth";
import { useQueryClient } from "@tanstack/react-query";

// Wrappers around generated hooks to inject Authorization headers

export function useAppLogin() {
  return useLogin();
}

export function useAppRegister() {
  return useRegister();
}

export function useAppGetMe() {
  return useGetMe({
    request: { headers: getAuthHeaders() },
    query: {
      retry: false,
      staleTime: 5 * 60 * 1000,
    }
  });
}

export function useAppSendMessage() {
  const queryClient = useQueryClient();
  return useSendMessage({
    request: { headers: getAuthHeaders() },
    mutation: {
      onSuccess: () => {
        // Invalidate user cache to update balance
        queryClient.invalidateQueries({ queryKey: ["/api/me"] });
      }
    }
  });
}

export function useAppUploadFile() {
  return useUploadFile({
    request: { headers: getAuthHeaders() }
  });
}

export function useAppGenerateDocument() {
  return useGenerateDocument({
    request: { headers: getAuthHeaders() }
  });
}

export function useAppAdminUsers() {
  return useAdminGetUsers({
    request: { headers: getAuthHeaders() }
  });
}

export function useAppAdminStats() {
  return useAdminGetStats({
    request: { headers: getAuthHeaders() }
  });
}

export function useAppAdminChargeUser() {
  const queryClient = useQueryClient();
  return useAdminChargeUser({
    request: { headers: getAuthHeaders() },
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      }
    }
  });
}
