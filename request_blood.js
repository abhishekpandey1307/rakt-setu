import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

import {
  FIREBASE_CONFIG,
  EMAILJS_PUBLIC_KEY,
  EMAILJS_TEMPLATE_ID,
  EMAILJS_SERVICE_ID
} from "./config.js";

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  emailjs.init(EMAILJS_PUBLIC_KEY);

  document.getElementById("bloodRequestForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const contact = document.getElementById("contact").value.trim();
    const bloodGroup = document.getElementById("bloodGroup").value;
    const state = document.getElementById("state").value;
    const district = document.getElementById("district").value;
    const village = document.getElementById("village").value;
    const pincode = document.getElementById("pincode").value.trim();
    const urgency = document.getElementById("urgency").value;
    const bloodunit = document.getElementById("bloodunit").value;

    await addDoc(collection(db, "bloodRequests"), {
      name, email, contact,
      bloodGroup, state, district,
      village, pincode, urgency, bloodunit,
      timestamp: new Date()
    });

    const donorQuery = query(
      collection(db, "theuserlist"),
      where("BloodGroup", "==", bloodGroup),
      where("Availability", "==", "Available")
    );

    const snapshot = await getDocs(donorQuery);
    const matchingEmails = [];

    snapshot.forEach(doc => {
      const d = doc.data();
      if (typeof d.Email === "string" && d.Email.trim()) {
        const matchDistrict = d.District?.trim().toLowerCase() === district.trim().toLowerCase();
        const matchVillage = d.Village?.trim().toLowerCase() === village.trim().toLowerCase();
        const matchPincode = d.Pincode?.trim() === pincode;

        console.log("Donor fetched:", d);
        console.log("Checking donor:", d.Email, { matchDistrict, matchVillage, matchPincode });

        if (matchDistrict || matchVillage || matchPincode) {
          matchingEmails.push(d.Email.trim());
        }
      }
    });

    console.log("Matched donor emails:", matchingEmails);

    if (matchingEmails.length > 0) {
      for (const donorEmail of matchingEmails) {
        const emailParams = {
          to_email: donorEmail,
          name: name,
          email: email,
          blood_group: bloodGroup,
          location: `${village}, ${district}, ${state}, ${pincode}`,
          message: `Urgency: ${urgency}; Units: ${bloodunit}; Contact: ${contact}`
        };

        console.log("EmailJS sending with these values:", emailParams);

        try {
          const resp = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, emailParams);
          console.log("Email sent to:", donorEmail, resp);
        } catch (err) {
          console.error("Error sending to", donorEmail, err);
        }
      }
      alert("Emails sent successfully");
      e.target.reset();
    } else {
      alert("No matching donors found.");
    }
  });
});
