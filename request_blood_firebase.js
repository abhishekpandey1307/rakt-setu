import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import { FIREBASE_CONFIG, EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID } from "./config.js";

// Initialize Firebase & Firestore
const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  window.emailjs.init(EMAILJS_PUBLIC_KEY);

  const form = document.getElementById("bloodRequestForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    form.querySelector("button[type='submit']").disabled = true;

    // Gather form input
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const contact = document.getElementById("contact").value.trim();
    const bloodGroup = document.getElementById("bloodGroup").value;
    const state = document.getElementById("state").value.trim();
    const district = document.getElementById("district").value.trim();
    const village = document.getElementById("village").value.trim();
    const pincode = document.getElementById("pincode").value.trim();
    const urgency = document.getElementById("urgency").value;
    const bloodunit = document.getElementById("bloodunit").value;

    const requestData = {
      name, email, contact, bloodGroup, state,
      district, village, pincode, urgency, bloodunit,
      timestamp: new Date()
    };

    try {
      await addDoc(collection(db, "bloodRequests"), requestData);

      const donorQuery = query(
        collection(db, "theuserlist"),
        where("BloodGroup", "==", bloodGroup),
        where("Availability", "==", "Available")
      );

      const snapshot = await getDocs(donorQuery);
      const matchingEmails = [];

      snapshot.forEach(doc => {
        const donor = doc.data();
        if (!donor?.Email?.trim()) return;

        const matchDistrict = donor.District?.trim().toLowerCase() === district.toLowerCase();
        const matchVillage = donor.Village?.trim().toLowerCase() === village.toLowerCase();
        const matchPincode = donor.Pincode?.trim() === pincode;

        if (matchDistrict || matchVillage || matchPincode) {
          matchingEmails.push(donor.Email.trim());
        }
      });

      if (matchingEmails.length > 0) {
        for (const donorEmail of matchingEmails) {
          const emailParams = {
            to_email: donorEmail,
            name: name,
            email: email,
            blood_group: bloodGroup,
            location: `${village}, ${district}, ${state}, ${pincode}`,
            message: `Urgency: ${urgency}, Units Required: ${bloodunit}, Contact: ${contact}`
          };

          try {
            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, emailParams);
            console.log("✅ Email sent to:", donorEmail);
          } catch (emailErr) {
            console.error("❌ Failed to send email to:", donorEmail, emailErr);
          }
        }

        alert("✅ Blood request submitted and emails sent!");
        form.reset();
      } else {
        alert("⚠️ No matching donors found.");
      }
    } catch (err) {
      console.error("❌ Submission failed:", err);
      alert("❌ Something went wrong. Please try again.");
    } finally {
      form.querySelector("button[type='submit']").disabled = false;
    }
  });
});
