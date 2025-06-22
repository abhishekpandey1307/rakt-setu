import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import { FIREBASE_CONFIG } from "./config.js"; // 🔒 Import secure config

const app = initializeApp(FIREBASE_CONFIG);
const auth = getAuth(app);

document.getElementById('submit').addEventListener("click", function (event) {
  event.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) {
    alert("⚠️ Please enter email and password.");
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // ✅ Store UID and email in localStorage
      localStorage.setItem("uid", user.uid);
      localStorage.setItem("email", user.email);

      alert("✅ Logged in successfully!");
      window.location.href = "signup_donor.html";
    })
    .catch((error) => {
      alert("❌ " + error.message);
    });
});


