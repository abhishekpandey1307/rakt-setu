import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";
import { FIREBASE_CONFIG } from "./config.js";

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

let locationData = {};
let urlParams = new URLSearchParams(window.location.search);
const stateParam = urlParams.get("state");
const districtParam = urlParams.get("district");
const bloodGroupParam = urlParams.get("bloodGroup");

fetch("data/india-states-city-pincode.json")
  .then((res) => res.json())
  .then((data) => {
    locationData = data;
    const stateSelect = document.getElementById("state");
    for (const state in data) {
      const option = document.createElement("option");
      option.value = state;
      option.textContent = state;
      stateSelect.appendChild(option);
    }

    if (stateParam) {
      stateSelect.value = stateParam;
      populateDistricts(stateParam, () => {
        if (districtParam) {
          document.getElementById("district").value = districtParam;
          document.getElementById("district").dispatchEvent(new Event("change"));
        }
        if (bloodGroupParam) {
          document.getElementById("bloodGroup").value = bloodGroupParam;
        }
      });
    }
  });

function populateDistricts(state, callback) {
  const districtSelect = document.getElementById("district");
  districtSelect.innerHTML = `<option value="">Select District</option>`;
  const villageSelect = document.getElementById("village");
  villageSelect.innerHTML = `<option value="">Select Village</option>`;
  document.getElementById("pincode").value = "";

  if (locationData[state]) {
    for (const district in locationData[state]) {
      const option = document.createElement("option");
      option.value = district;
      option.textContent = district;
      districtSelect.appendChild(option);
    }
    if (callback) callback();
  }
}

document.getElementById("state").addEventListener("change", function () {
  populateDistricts(this.value);
});

document.getElementById("district").addEventListener("change", function () {
  const villageSelect = document.getElementById("village");
  const pincodeInput = document.getElementById("pincode");
  villageSelect.innerHTML = `<option value="">Select Village</option>`;
  pincodeInput.value = "";

  const selectedState = document.getElementById("state").value;
  const selectedDistrict = this.value;

  if (locationData[selectedState]?.[selectedDistrict]) {
    const villages = locationData[selectedState][selectedDistrict];
    for (const village in villages) {
      const option = document.createElement("option");
      option.value = village;
      option.textContent = village;
      villageSelect.appendChild(option);
    }
  }
});

document.getElementById("village").addEventListener("change", function () {
  const selectedState = document.getElementById("state").value;
  const selectedDistrict = document.getElementById("district").value;
  const selectedVillage = this.value;
  const pincodeInput = document.getElementById("pincode");

  const pincode =
    locationData[selectedState]?.[selectedDistrict]?.[selectedVillage] || "";
  pincodeInput.value = pincode.trim();
});

function showNoResultsPopup(message) {
  const existing = document.querySelector(".no-result-alert");
  if (existing) existing.remove();

  const popup = document.createElement("div");
  popup.className = "no-result-alert";
  popup.textContent = message;
  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 4000);
}

document.getElementById("searchForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const bloodGroup = document.getElementById("bloodGroup").value.trim();
  const state = document.getElementById("state").value.trim();
  const district = document.getElementById("district").value.trim();
  const village = document.getElementById("village").value.trim();
  const pincode = document.getElementById("pincode").value.trim();

  const donorList = document.getElementById("donorList");
  donorList.innerHTML = "";

  if (!bloodGroup || !state || !district || !village || !pincode) {
    alert("Please fill in all fields to search.");
    return;
  }

  try {
    const q = query(
      collection(db, "theuserlist"),
      where("BloodGroup", "==", bloodGroup),
      where("Availability", "==", "Available")
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      showNoResultsPopup("No donors found matching your criteria.");
      return;
    }

    let matchFound = false;

    querySnapshot.forEach((doc) => {
      const donor = doc.data();

      let matchLevel = "";

      if (donor.Pincode?.trim() === pincode) {
        matchLevel = "pincode-match";
      } else if (
        donor.Village?.trim().toLowerCase() === village.toLowerCase()
      ) {
        matchLevel = "village-match";
      } else if (
        donor.District?.trim().toLowerCase() === district.toLowerCase()
      ) {
        matchLevel = "district-match";
      }

      if (matchLevel) {
        matchFound = true;
        const donorCard = `
          <div class="donor-card ${matchLevel}">
            <h3>${donor.Username}</h3>
            <p><strong>Age:</strong> ${donor.Age}</p>
            <p><strong>Contact:</strong> ${donor.Contact}</p>
            <p><strong>Blood Group:</strong> ${donor.BloodGroup}</p>
            <p><strong>State:</strong> ${donor.State}</p>
            <p><strong>District:</strong> ${donor.District}</p>
            <p><strong>Village:</strong> ${donor.Village}</p>
            <p><strong>Pincode:</strong> ${donor.Pincode}</p>
          </div>
        `;
        donorList.innerHTML += donorCard;
      }
    });

    if (!matchFound) {
      showNoResultsPopup("No donors found matching your location.");
    }
  } catch (error) {
    console.error("Error fetching donors:", error);
    alert("Failed to fetch donor list. Please try again later.");
  }
});
