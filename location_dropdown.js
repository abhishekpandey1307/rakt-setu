let locationData = {};

fetch("data/india-states-city-pincode.json")
  .then((res) => res.json())
  .then((data) => {
    locationData = data;
    const stateSelect = document.getElementById("state");
    stateSelect.innerHTML = `<option value="">Select State</option>`;
    for (const state in data) {
      const option = document.createElement("option");
      option.value = state;
      option.textContent = state;
      stateSelect.appendChild(option);
    }
  });

function populateDistricts(state) {
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
