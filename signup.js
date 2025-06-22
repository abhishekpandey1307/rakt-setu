import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";

import { FIREBASE_CONFIG } from "./config.js";

const app = initializeApp(FIREBASE_CONFIG);
const auth = getAuth(app);

const submit = document.getElementById('submit');

submit.addEventListener("click", function (event) {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      localStorage.setItem("uid", user.uid);
      localStorage.setItem("email", user.email);

      alert("Account Created. Redirecting...");
      window.location.href = "signup_donor.html";
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
});
