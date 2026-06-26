import type { LoginPayload } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authService } from "../services";
import { tokenStorage } from "@/utils/tokenStorage";

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),

    onSuccess: (data) => {
      tokenStorage.setTokens(data.accessToken, data.refreshToken);
      navigate('/dashboard', { replace: true });
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    tokenStorage.clear();
    navigate('/login', { replace: true });
  };

  return { logout };
};
