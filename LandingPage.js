// Firebase not needed for landing page since no data fetching

// Load JSON location data
let locationData = {};
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
  });

// Populate districts when a state is selected
document.getElementById("state").addEventListener("change", function () {
  const districtSelect = document.getElementById("district");
  districtSelect.innerHTML = `<option value="">Select District</option>`;

  const selectedState = this.value;
  if (locationData[selectedState]) {
    for (const district in locationData[selectedState]) {
      const option = document.createElement("option");
      option.value = district;
      option.textContent = district;
      districtSelect.appendChild(option);
    }
  }
});

// Handle Search button click — redirect with query parameters
document.querySelector(".search-btn").addEventListener("click", () => {
  const state = document.getElementById("state").value.trim();
  const district = document.getElementById("district").value.trim();
  const bloodGroup = document.getElementById("blood-group").value.trim();

  if (!state || !district || !bloodGroup) {
    alert("Please select State, District, and Blood Group.");
    return;
  }

  const queryParams = new URLSearchParams({
    state: state,
    district: district,
    bloodGroup: bloodGroup,
  });

  // Redirect to find_donors.html with query parameters
  window.location.href = `find_donors.html?${queryParams.toString()}`;
});
