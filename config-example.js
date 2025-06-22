// config.js

// Firebase Configuration
export const FIREBASE_CONFIG = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// EmailJS Configuration
export const EMAILJS_CONFIG = {
  userID: "YOUR_EMAILJS_USER_ID",        // emailjs.init("userID")
  serviceID: "YOUR_EMAILJS_SERVICE_ID",  // emailjs.send(serviceID, ...)
  templateID: "YOUR_EMAILJS_TEMPLATE_ID" // emailjs.send(..., templateID, ...)
};
