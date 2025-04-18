// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";

// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBVrDSVf2cPAt1-Obtcva7GuR7ZCs_KQrA",
//   authDomain: "rental-f2436.firebaseapp.com",
//   projectId: "rental-f2436",
//   storageBucket: "rental-f2436.firebasestorage.app",
//   messagingSenderId: "642707791953",
//   appId: "1:642707791953:web:ed6132335f9a3c4c4f1870",
//   measurementId: "G-8QYH4F9B0Y",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// export const auth = getAuth(app);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBVrDSVf2cPAt1-Obtcva7GuR7ZCs_KQrA",
  authDomain: "rental-f2436.firebaseapp.com",
  projectId: "rental-f2436",
  storageBucket: "rental-f2436.firebasestorage.app",
  messagingSenderId: "642707791953",
  appId: "1:642707791953:web:ed6132335f9a3c4c4f1870",
  measurementId: "G-8QYH4F9B0Y",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
