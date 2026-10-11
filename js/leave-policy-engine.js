// Policy rules for leave balances and limits.

var leavePolicy = {
  yearlyAllowance: 24,
  maxConsecutiveDays: 7,
  maxHalfDaysPerMonth: 3,
  medicalNoteAfterDays: 3
};

var leaveCategories = {
  medical: { label: "Medical Leave", needsDocument: true },
  personal: { label: "Personal Leave", needsDocument: false },
  academic: { label: "Academic Leave", needsDocument: true },
  emergency: { label: "Emergency Leave", needsDocument: false }
};

// Works out the remaining balance from a list of leave records
function computeRemainingBalance(leaveRecords) {
  var used = 0;

  for (var i = 0; i < leaveRecords.length; i++) {
    if (leaveRecords[i].status === "Approved") {
      used = used + leaveRecords[i].days;
    }
  }

  return leavePolicy.yearlyAllowance - used;
}

// Returns true when a request stays within the consecutive days limit
function isWithinConsecutiveLimit(requestedDays) {
  return requestedDays <= leavePolicy.maxConsecutiveDays;
}

// Counts how many half day leaves were taken in a given month
function countHalfDaysInMonth(leaveRecords, monthNumber) {
  var count = 0;

  for (var i = 0; i < leaveRecords.length; i++) {
    if (leaveRecords[i].type === "half" && leaveRecords[i].month === monthNumber) {
      count++;
    }
  }

  return count;
}

// Decides if one more half day leave is allowed this month
function canTakeHalfDay(leaveRecords, monthNumber) {
  return countHalfDaysInMonth(leaveRecords, monthNumber) < leavePolicy.maxHalfDaysPerMonth;
}

// Looks up the leave category and its rules
function classifyLeave(categoryName) {
  var category = leaveCategories[categoryName];

  if (category === undefined) {
    return { label: "Other Leave", needsDocument: false };
  }

  return category;
}

// Checks whether supporting papers are needed
function requiresDocument(categoryName, requestedDays) {
  var category = classifyLeave(categoryName);

  if (categoryName === "medical" && requestedDays > leavePolicy.medicalNoteAfterDays) {
    return true;
  }

  return category.needsDocument && requestedDays > 1;
}

// Gives a simple list of policy problems for a request
function checkPolicyLimits(leaveRecords, requestedDays, categoryName) {
  var problems = [];

  if (requestedDays > computeRemainingBalance(leaveRecords)) {
    problems.push("Not enough leave balance.");
  }

  if (!isWithinConsecutiveLimit(requestedDays)) {
    problems.push("Request is longer than " + leavePolicy.maxConsecutiveDays + " days.");
  }

  if (requiresDocument(categoryName, requestedDays)) {
    problems.push("Supporting document required.");
  }

  return problems;
}

// Writes a short summary of the policy for a student
function producePolicySummary(leaveRecords) {
  var remaining = computeRemainingBalance(leaveRecords);

  return "Yearly allowance: " + leavePolicy.yearlyAllowance + " days. " +
    "Remaining: " + remaining + " days. " +
    "Longest continuous leave: " + leavePolicy.maxConsecutiveDays + " days. " +
    "Half days per month: " + leavePolicy.maxHalfDaysPerMonth + ".";
}
