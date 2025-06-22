import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";
import { FIREBASE_CONFIG } from "./config.js";

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

// Location dropdown
const stateSelect = document.getElementById("state");
const districtSelect = document.getElementById("district");
const villageSelect = document.getElementById("village");
const pincodeInput = document.getElementById("pincode");

let locationData = {};

fetch("data/india-states-city-pincode.json")
  .then(res => res.json())
  .then(data => {
    locationData = data;
    populateStates();
  })
  .catch(err => console.error("Error loading location data:", err));

function populateStates() {
  Object.keys(locationData).forEach(state => {
    const opt = document.createElement("option");
    opt.value = state;
    opt.textContent = state;
    stateSelect.appendChild(opt);
  });
}

stateSelect.addEventListener("change", () => {
  districtSelect.innerHTML = `<option value="">Select District</option>`;
  villageSelect.innerHTML = `<option value="">Select Village</option>`;
  pincodeInput.value = "";

  const districts = locationData[stateSelect.value];
  if (districts) {
    Object.keys(districts).forEach(district => {
      const opt = document.createElement("option");
      opt.value = district;
      opt.textContent = district;
      districtSelect.appendChild(opt);
    });
  }
});

districtSelect.addEventListener("change", () => {
  villageSelect.innerHTML = `<option value="">Select Village</option>`;
  pincodeInput.value = "";

  const villages = locationData[stateSelect.value]?.[districtSelect.value];
  if (villages) {
    Object.entries(villages).forEach(([village, pincode]) => {
      const opt = document.createElement("option");
      opt.value = village;
      opt.textContent = village;
      opt.dataset.pincode = pincode.trim();
      villageSelect.appendChild(opt);
    });
  }
});

villageSelect.addEventListener("change", () => {
  const selected = villageSelect.selectedOptions[0];
  pincodeInput.value = selected?.dataset.pincode || "";
});

document.querySelector("form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const age = document.getElementById("age").value.trim();
  const contact = document.getElementById("contact").value.trim();
  const bloodgroup = document.getElementById("bloodgroup").value;
  const availability = document.getElementById("availability").value;
  const state = stateSelect.value;
  const district = districtSelect.value;
  const village = villageSelect.value;
  const landmark = document.getElementById("landmark").value.trim();
  const pincode = pincodeInput.value.trim();

  const uid = localStorage.getItem("uid");
  const email = localStorage.getItem("email");

  console.log("Donor fetched:", { uid, email });

  if (!uid || !email) {
    alert("User authentication data missing. Please log in again.");
    return;
  }

  if (!name || !age || !contact || !bloodgroup || !availability || !state || !district || !village || !landmark || !pincode) {
    alert("Please fill in all required fields.");
    return;
  }

  try {
    await addDoc(collection(db, "theuserlist"), {
      UID: uid,
      Email: email,
      Username: name,
      Age: age,
      Contact: contact,
      BloodGroup: bloodgroup,
      Availability: availability,
      State: state,
      District: district,
      Village: village,
      Landmark: landmark,
      Pincode: pincode
    });

    alert("You have been successfully registered as a donor!");

    localStorage.removeItem("uid");
    localStorage.removeItem("email");

    window.location.href = "thankyou.html";

  } catch (error) {
    console.error("Error adding donor:", error);
    alert("Error registering donor. Please try again.");
  }
});
