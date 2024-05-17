import * as firebase from "firebase/app";
import type { Auth } from "firebase/auth";
import { getAuth } from "firebase/auth";

export type { AuthError, User as AuthUser } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDOT5wr8vXvv-xbo8zb_hGanTFbNAbxQiA",
  authDomain: "connect-five-b506f.firebaseapp.com",
  projectId: "connect-five-b506f",
  storageBucket: "connect-five-b506f.appspot.com",
  messagingSenderId: "758889087334",
  appId: "1:758889087334:web:fd68349f092f81fb3288a7",
  measurementId: "G-XJ73ZHB50G",
};

// Prevent re-initialization (mainly applies for hot reloads in dev, but it
// doesn't hurt to have this check in all envs)
if (firebase.getApps().length === 0) {
  firebase.initializeApp(firebaseConfig);
}

interface FirebaseAuthReady {
  auth: Auth;
  isReady: true;
}

interface FirebaseAuthNotReady {
  auth: null;
  isReady: false;
}

type FirebaseAuthStatus = FirebaseAuthReady | FirebaseAuthNotReady;

export const getFirebaseAuth = (): FirebaseAuthStatus => {
  const app = firebase.getApps()[0];

  return {
    auth: getAuth(app),
    isReady: true,
  };
};
