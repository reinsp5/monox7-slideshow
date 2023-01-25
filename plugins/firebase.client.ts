import { getStorage, connectStorageEmulator } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const firebaseConfig = {
    apiKey: config.FIREBASE_API_KEY,
    authDomain: config.FIREBASE_AUTH_DOMAIN,
    projectId: config.FIREBASE_PROJECT_ID,
    storageBucket: config.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: config.FIREBASE_MESSAGE_SENDER,
    appId: config.FIREBASE_APP_ID,
  };
  const app = initializeApp(firebaseConfig);

  // setup emulators
  if (config.USE_EMULATOR === "true") {
    connectAuthEmulator(getAuth(app), "http://localhost:9099");
    connectFirestoreEmulator(getFirestore(app), "localhost", 8080);
    connectStorageEmulator(getStorage(app), "localhost", 9199);
    connectFunctionsEmulator(
      getFunctions(app, "asia-northeast1"),
      "localhost",
      5001
    );
  }
});
