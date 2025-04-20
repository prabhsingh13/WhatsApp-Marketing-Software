// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { getAuth } from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0ca57EMzuX4Bd3z01vz5M0HV-_9EJ7qY",
  authDomain: "whatsapp-marketing-tool-by-ps.firebaseapp.com",
  projectId: "whatsapp-marketing-tool-by-ps",
  storageBucket: "whatsapp-marketing-tool-by-ps.firebasestorage.app",
  messagingSenderId: "927794642773",
  appId: "1:927794642773:web:2197464d0d4f51a8fdf9dc",
  measurementId: "G-WKWN4VPG5S",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
// const analytics = getAnalytics(app)

// Initialize Firebase Authentication and export the auth object
const auth = getAuth(app)

export { auth }
