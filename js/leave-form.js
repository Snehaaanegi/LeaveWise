var leaveForm = document.getElementById("leaveform");
var startDateInput = document.getElementById("startDate");
var endDateInput = document.getElementById("endDate");
var daysDisplay = document.getElementById("daysDisplay");
var resetButton = document.getElementById("resetBtn");
var successBox = document.getElementById("successBox");

// Turns a date written as yyyy-mm-dd into a Date object
function parseDate(dateText) {
  var parts = dateText.split("-");
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

// Works out how many days the leave lasts
function calculateLeaveDays(startValue, endValue) {
  var start = parseDate(startValue);
  var end = parseDate(endValue);
  var oneDay = 24 * 60 * 60 * 1000;
  var difference = end - start;
  return Math.round(difference / oneDay);
}

// Shows the number of days under the date fields
function updateDays() {
  var startValue = startDateInput.value;
  var endValue = endDateInput.value;

  if (startValue === "" || endValue === "") {
    daysDisplay.textContent = "-";
    return;
  }

  var days = calculateLeaveDays(startValue, endValue);

  if (isNaN(days)) {
    daysDisplay.textContent = "-";
  } else if (days === 1) {
    daysDisplay.textContent = "1 day";
  } else {
    daysDisplay.textContent = days + " days";
  }
}

// Checks the dates before the form is accepted
function validateDates() {
  var startValue = startDateInput.value;
  var endValue = endDateInput.value;
  var today = new Date();
  today.setHours(0, 0, 0, 0);

  if (startValue < today) {
    alert("The start date cannot be in the past.");
    return false;
  }

  if (parseDate(endValue) < parseDate(startValue)) {
    alert("The end date cannot be before the start date.");
    return false;
  }

  return true;
}

// Runs when the form is submitted
function handleSubmit(event) {
  event.preventDefault();

  if (!validateDates()) {
    return;
  }

  var days = calculateLeaveDays(startDateInput.value, endDateInput.value);
  var dayWord = days === 1 ? " day" : " days";

  successBox.textContent = "Your leave application for " + days + dayWord + " has been submitted successfully.";
  successBox.classList.add("show");

  leaveForm.reset();
  daysDisplay.textContent = "-";
}

startDateInput.addEventListener("change", updateDays);
endDateInput.addEventListener("change", updateDays);

resetButton.addEventListener("click", function () {
  daysDisplay.textContent = "-";
  successBox.classList.remove("show");
});

leaveForm.addEventListener("submit", handleSubmit);
