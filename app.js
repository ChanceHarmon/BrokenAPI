// Sample API response with intentional errors for students to debug.
// The activity is designed so learners fix naming and data type issues.
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

// Cache DOM elements once so they can be reused throughout the script.
const requestBox = document.getElementById("requestBox");
const jsonEditor = document.getElementById("jsonEditor");
const statusBox = document.getElementById("statusBox");
const cards = document.getElementById("cards");
const successBanner = document.getElementById("successBanner");

// Convert a JavaScript object into readable, indented JSON for display in the UI.
function formatJSON(data) {
  return JSON.stringify(data, null, 2);
}

// Load the intentionally broken response into both the display panel and the editor.
// This also resets the UI so students can start over with a clean state.
function loadBrokenResponse() {
  requestBox.textContent = formatJSON(brokenResponse);
  jsonEditor.value = formatJSON(brokenResponse);
  clearFeedback();
  cards.innerHTML = "";
  successBanner.className = "success-banner";
  jsonEditor.focus();
}

// Remove any previous status styling and message content.
function clearFeedback() {
  statusBox.className = "status";
  statusBox.innerHTML = "";
}

// Reuse one function to show feedback messages with different visual states
// like success, error, or hint.
function showMessage(type, html) {
  statusBox.className = `status ${type}`;
  statusBox.innerHTML = html;
}

// Provide scaffolded help without revealing the full solution.
// The hint points students toward field names and data types.
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

// Validate the student's edited JSON against the schema the app expects.
// Instead of stopping at the first issue, this collects all errors so students
// get a fuller picture of what still needs to be fixed.
function validatePets(data) {
  const errors = [];

  // The response should be one object, not an array or another primitive type.
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    errors.push("The response should be one object with a pets array.");
    return errors;
  }

  // The top-level pets field must exist and be an array.
  if (!Array.isArray(data.pets)) {
    errors.push('The top-level "pets" field must be an array.');
    return errors;
  }

  // Check each pet object in the array.
  data.pets.forEach((pet, index) => {
    const label = `Pet ${index + 1}`;

    // Each item in the array should itself be an object.
    if (typeof pet !== "object" || pet === null || Array.isArray(pet)) {
      errors.push(`${label} should be an object.`);
      return;
    }

    // These are the exact fields the app expects for each pet.
    const requiredKeys = ["id", "name", "type", "age", "vaccinated", "adopted"];

    // Check for any missing required keys.
    requiredKeys.forEach((key) => {
      if (!(key in pet)) {
        errors.push(`${label} is missing the "${key}" field.`);
      }
    });

    // Call out the incorrect field name directly so students can connect
    // the mismatch between the response and the schema.
    if ("petName" in pet) {
      errors.push(`${label} uses "petName" but the app expects "name".`);
    }

    // Validate each field's data type only if the field exists.
    // This avoids cascading errors from missing keys.
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

// Render a visual preview of the fixed data so students can immediately
// see the result of correcting the JSON.
function renderCards(pets) {
  cards.innerHTML = "";

  pets.forEach((pet) => {
    const card = document.createElement("div");
    card.className = "card";

    // Use the corrected data to populate a simple pet card UI.
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

// Main workflow for checking a student's fix:
// 1. clear old feedback
// 2. try to parse the JSON
// 3. validate the structure and data types
// 4. either show errors or render the success state
function checkFix() {
  clearFeedback();
  successBanner.className = "success-banner";
  cards.innerHTML = "";

  let parsed;

  // Catch JSON syntax errors first, before schema validation.
  try {
    parsed = JSON.parse(jsonEditor.value);
  } catch (error) {
    showMessage(
      "bad",
      `<strong>That JSON could not be parsed.</strong><br>Check for missing commas, extra commas, or quotation mark mistakes.`
    );
    return;
  }

  // Validate the parsed object against the expected data structure.
  const errors = validatePets(parsed);

  // If any schema or type issues remain, show them all together.
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

  // If the JSON parses and matches the schema, show success and preview cards.
  showMessage(
    "good",
    `<strong>Success.</strong> Your response matches the schema and the app can now use the data.`
  );
  successBanner.className = "success-banner show";
  renderCards(parsed.pets);
}

// Wire up the interface controls.
document.getElementById("checkBtn").addEventListener("click", checkFix);
document.getElementById("hintBtn").addEventListener("click", showHint);
document.getElementById("resetBtn").addEventListener("click", loadBrokenResponse);

// Load the broken response immediately so the activity is ready to use on page load.
loadBrokenResponse();