import { useCallback } from "react";
import { useFirebaseAuth } from "./use-firebase-auth";

export interface UseSignInParameters {
  onSuccess?: () => void;
  onError?: (err: unknown) => void;
}

export const useSignIn = ({ onSuccess, onError }: UseSignInParameters = {}) => {
  const { handleSignIn } = useFirebaseAuth();
  return useCallback(async () => {
    try {
      await handleSignIn();
      onSuccess?.();
    } catch (err: unknown) {
      onError?.(err);
    }
  }, [handleSignIn, onError, onSuccess]);
};
