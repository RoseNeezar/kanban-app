import firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_CLIENT_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_CLIENT_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_CLIENT_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_CLIENT_STORAGE_BUCKET,
  appId: process.env.NEXT_PUBLIC_CLIENT_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_CLIENT_MEASUREMENT_ID,
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebase.setLogLevel("silent");
} else {
  firebase.app();
}

export const auth = firebase.auth();
export const googleAuthProvider =
  new firebase.auth.GoogleAuthProvider().setCustomParameters({
    prompt: "select_account",
  });
