import * as firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyAPlCnVtjDUSoA2eYud0GSwHWar1lC7d4k",
  authDomain: "kanban-app-4e541.firebaseapp.com",
  projectId: "kanban-app-4e541",
  storageBucket: "kanban-app-4e541.appspot.com",
  appId: "1:663202516955:web:9839b372ee8b7c4f98a1fe",
  measurementId: "G-N058PJTFG9",
};
// Initialize Firebase
if (!firebase.default.apps.length) {
  firebase.default.initializeApp(firebaseConfig);
} else {
  firebase.default.app();
}

export const auth = firebase.default.auth();
export const googleAuthProvider =
  new firebase.default.auth.GoogleAuthProvider().setCustomParameters({
    prompt: "select_account",
  });
