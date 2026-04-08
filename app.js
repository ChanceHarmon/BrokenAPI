const brokenResponse = {
  pets: [
    {
      id: 101,
      petName: "Mochi",
      type: "cat",
      age: "2",
      vaccinated: "true",
      adopted: false
    },
    {
      id: 102,
      petName: "Pixel",
      type: "dog",
      age: 4,
      vaccinated: true,
      adopted: "no"
    }
  ]
};

const requestBox = document.getElementById("requestBox");
const jsonEditor = document.getElementById("jsonEditor");
const statusBox = document.getElementById("statusBox");
const cards = document.getElementById("cards");
const successBanner = document.getElementById("successBanner");

function formatJSON(data) {
  return JSON.stringify(data, null, 2);
}

function loadBrokenResponse() {
  requestBox.textContent = formatJSON(brokenResponse);
  jsonEditor.value = formatJSON(brokenResponse);
  clearFeedback();
  cards.innerHTML = "";
  successBanner.className = "success-banner";
  jsonEditor.focus();
}

function clearFeedback() {
  statusBox.className = "status";
  statusBox.innerHTML = "";
}

function showMessage(type, html) {
  statusBox.className = `status ${type}`;
  statusBox.innerHTML = html;
}

function showHint() {
  showMessage(
    "hint",
    `
    <strong>Hint:</strong>
    <ul>
      <li>Check whether the field names match the schema exactly</li>
      <li>Look closely at the difference between strings and booleans</li>
      <li>One number is stored as text instead of a number</li>
    </ul>
    `
  );
}

function validatePets(data) {
  const errors = [];

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    errors.push("The response should be one object with a pets array.");
    return errors;
  }

  if (!Array.isArray(data.pets)) {
    errors.push('The top-level "pets" field must be an array.');
    return errors;
  }

  data.pets.forEach((pet, index) => {
    const label = `Pet ${index + 1}`;

    if (typeof pet !== "object" || pet === null || Array.isArray(pet)) {
      errors.push(`${label} should be an object.`);
      return;
    }

    const requiredKeys = ["id", "name", "type", "age", "vaccinated", "adopted"];

    requiredKeys.forEach((key) => {
      if (!(key in pet)) {
        errors.push(`${label} is missing the "${key}" field.`);
      }
    });

    if ("petName" in pet) {
      errors.push(`${label} uses "petName" but the app expects "name".`);
    }

    if ("id" in pet && typeof pet.id !== "number") {
      errors.push(`${label}: "id" should be a number.`);
    }

    if ("name" in pet && typeof pet.name !== "string") {
      errors.push(`${label}: "name" should be a string.`);
    }

    if ("type" in pet && typeof pet.type !== "string") {
      errors.push(`${label}: "type" should be a string.`);
    }

    if ("age" in pet && typeof pet.age !== "number") {
      errors.push(`${label}: "age" should be a number.`);
    }

    if ("vaccinated" in pet && typeof pet.vaccinated !== "boolean") {
      errors.push(`${label}: "vaccinated" should be a boolean.`);
    }

    if ("adopted" in pet && typeof pet.adopted !== "boolean") {
      errors.push(`${label}: "adopted" should be a boolean.`);
    }
  });

  return errors;
}

function renderCards(pets) {
  cards.innerHTML = "";

  pets.forEach((pet) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${pet.name}</h3>
      <p><strong>Type:</strong> ${pet.type}</p>
      <p><strong>Age:</strong> ${pet.age}</p>
      <p><strong>Vaccinated:</strong> ${pet.vaccinated ? "Yes" : "No"}</p>
      <p><strong>Status:</strong> ${pet.adopted ? "Already adopted" : "Available"}</p>
      <span class="tag">Pet ID: ${pet.id}</span>
    `;

    cards.appendChild(card);
  });
}

function checkFix() {
  clearFeedback();
  successBanner.className = "success-banner";
  cards.innerHTML = "";

  let parsed;

  try {
    parsed = JSON.parse(jsonEditor.value);
  } catch (error) {
    showMessage(
      "bad",
      `<strong>That JSON could not be parsed.</strong><br>Check for missing commas, extra commas, or quotation mark mistakes.`
    );
    return;
  }

  const errors = validatePets(parsed);

  if (errors.length > 0) {
    showMessage(
      "bad",
      `
      <strong>Almost there.</strong> Fix these issues:
      <ul>
        ${errors.map((error) => `<li>${error}</li>`).join("")}
      </ul>
      `
    );
    return;
  }

  showMessage(
    "good",
    `<strong>Success.</strong> Your response matches the schema and the app can now use the data.`
  );
  successBanner.className = "success-banner show";
  renderCards(parsed.pets);
}

document.getElementById("checkBtn").addEventListener("click", checkFix);
document.getElementById("hintBtn").addEventListener("click", showHint);
document.getElementById("resetBtn").addEventListener("click", loadBrokenResponse);

loadBrokenResponse();