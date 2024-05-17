import type { User } from "firebase/auth";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { atom, useAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { getFirebaseAuth } from "@/features/auth/firebase";

const provider = new GoogleAuthProvider();
const accessTokenAtom = atom<string | null>(null);
const userAtom = atom<User | null>(null);
const errorAtom = atom<Error | null>(null);

interface FirebaseAuth {
  accessToken: string | null;
  error: Error | null;
  handleSignIn: () => Promise<void>;
  handleSignOut: () => Promise<void>;
  user: User | null;
  isSignedIn: boolean;
}

export const useFirebaseAuth = (): FirebaseAuth => {
  const [accessToken, setAccessToken] = useAtom(accessTokenAtom);
  const [user, setUser] = useAtom(userAtom);
  const [error, setError] = useAtom(errorAtom);

  const { auth } = getFirebaseAuth();

  useEffect(() => {
    if (auth) {
      const unsubscribeAuthState = onAuthStateChanged(
        auth,
        async (nextUser) => {
          if (nextUser) {
            if (!accessToken) {
              const token = await nextUser.getIdToken();
              setAccessToken(token);
            }
            setUser(nextUser);
          } else {
            setUser(null);
          }
        }
      );
      return () => {
        unsubscribeAuthState();
      };
    }
  }, [accessToken, auth, setAccessToken, setUser]);

  const handleSignIn = useCallback(async () => {
    try {
      if (!auth) {
        throw new Error("Auth is null");
      }
      const result = await signInWithPopup(auth, provider);

      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (!credential) {
        throw new Error("Credential is null");
      }
      setAccessToken(credential.accessToken ?? null);
      // The signed-in user info.
      setUser(result.user);
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    } catch (unknownError: unknown) {
      setError(unknownError as Error);
      // eslint-disable-next-line no-console -- Want this to be visible for now.
      console.error("Error signing in.", unknownError);
      throw unknownError;
    }
  }, [auth, setAccessToken, setUser, setError]);

  const handleSignOut = useCallback(async () => {
    try {
      setAccessToken(null);
      setUser(null);
      setError(null);
      if (!auth) {
        throw new Error("Auth is null");
      }
      await signOut(auth);
    } catch (unknownError: unknown) {
      // eslint-disable-next-line no-console -- Want this to be visible for now.
      console.error("Error signing in.", unknownError);
      throw unknownError;
    }
  }, [auth, setAccessToken, setUser, setError]);

  return {
    accessToken,
    error,
    handleSignIn,
    handleSignOut,
    user,
    isSignedIn: Boolean(user),
  };
};
