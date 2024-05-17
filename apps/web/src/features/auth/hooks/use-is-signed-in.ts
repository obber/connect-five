import { useFirebaseAuth } from "./use-firebase-auth";

export const useIsSignedIn = () => {
  return useFirebaseAuth().isSignedIn;
};
