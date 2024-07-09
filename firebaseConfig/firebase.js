// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app'
const firebaseConfig = {
  apiKey: "AIzaSyDUsbRrJ_cEV1QSDsjWxGDrUmOA-GX2xtU",
  authDomain: "medimate-6ea66.firebaseapp.com",
  projectId: "medimate-6ea66",
  storageBucket: "medimate-6ea66.appspot.com",
  messagingSenderId: "718433057617",
  appId: "1:718433057617:web:2309f82f16a554f8443170",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// const messaging = getMessaging(app);
export { db };
