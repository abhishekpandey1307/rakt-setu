import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
import { FIREBASE_CONFIG } from "./config.js";

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

async function loadDonors() {
  const donorList = document.getElementById("donorList");
  donorList.innerHTML = "<p>Loading donors...</p>";

  try {
    const querySnapshot = await getDocs(collection(db, "theuserlist"));
    donorList.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const donor = doc.data();

      const donorCard = document.createElement("div");
      donorCard.classList.add("donor-card");

      donorCard.innerHTML = `
        <h3>${donor.Username || "Unknown"}</h3>
        <p><strong>Age:</strong> ${donor.Age || "N/A"}</p>
        <p><strong>Blood Group:</strong> ${donor.BloodGroup || "N/A"}</p>
        <p><strong>Availability:</strong> ${donor.Availability || "N/A"}</p>
        <p><strong>Location:</strong> ${donor.District || "N/A"}, ${donor.State || "N/A"}</p>
        <p style="color:gray; font-size:13px;">🔒 Contact details are available on the 'Find Donors' page.</p>
      `;

      donorList.appendChild(donorCard);
    });

    if (querySnapshot.empty) {
      donorList.innerHTML = "<p>No donors found.</p>";
    }

  } catch (error) {
    console.error("Error fetching donor data:", error);
    donorList.innerHTML = "<p>Failed to load donors. Please try again later.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadDonors);
