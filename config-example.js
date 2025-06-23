// config-example.js

//  Replace these placeholder values with your actual credentials in a local config.js file
//  Never commit the real config.js file to source control

// EmailJS Config (placeholder values)
const EMAILJS_PUBLIC_KEY = "YOUR_EMAILJS_PUBLIC_KEY";
const EMAILJS_TEMPLATE_ID = "YOUR_EMAILJS_TEMPLATE_ID";
const EMAILJS_SERVICE_ID = "YOUR_EMAILJS_SERVICE_ID";

// Firebase Config (placeholder values)
const FIREBASE_CONFIG = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_FIREBASE_PROJECT.firebaseapp.com",
  projectId: "YOUR_FIREBASE_PROJECT_ID",
  storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
  appId: "YOUR_FIREBASE_APP_ID"
};

export {
  FIREBASE_CONFIG,
  EMAILJS_PUBLIC_KEY,
  EMAILJS_TEMPLATE_ID,
  EMAILJS_SERVICE_ID
};
