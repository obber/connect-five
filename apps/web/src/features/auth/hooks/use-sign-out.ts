import { useCallback } from "react";
import { useFirebaseAuth } from "./use-firebase-auth";
import { useGoHome } from "@/shared/routing/hooks/use-go-home";

export const useSignOut = () => {
  const { handleSignOut } = useFirebaseAuth();
  const goHome = useGoHome();
  return useCallback(async () => {
    await handleSignOut();
    goHome();
  }, [goHome, handleSignOut]);
};
