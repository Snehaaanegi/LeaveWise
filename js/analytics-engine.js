// Analytics helpers for summarising portal usage on the dashboard.

var analyticsConfig = {
  reportingPeriodDays: 30,
  busyThreshold: 50,
  pageNames: ["dashboard", "apply-leave", "leave-status"]
};

var pageVisitLog = [];

// Records one visit to a page in the in-memory log
function trackPageVisit(pageName, visitorId) {
  var entry = {
    page: pageName,
    visitor: visitorId,
    visitedAt: new Date().getTime()
  };
  pageVisitLog.push(entry);
  return pageVisitLog.length;
}

// Counts how many times each page appears in the log
function countVisitsByPage() {
  var counts = {};

  for (var i = 0; i < analyticsConfig.pageNames.length; i++) {
    counts[analyticsConfig.pageNames[i]] = 0;
  }

  for (var j = 0; j < pageVisitLog.length; j++) {
    var pageName = pageVisitLog[j].page;
    if (counts[pageName] !== undefined) {
      counts[pageName] = counts[pageName] + 1;
    }
  }

  return counts;
}

// Finds the page with the most visits
function findMostVisitedPage() {
  var counts = countVisitsByPage();
  var topPage = "";
  var topCount = -1;

  for (var pageName in counts) {
    if (counts[pageName] > topCount) {
      topCount = counts[pageName];
      topPage = pageName;
    }
  }

  return topPage;
}

// Average of a list of numbers, rounded to one decimal place
function calculateAverage(numbers) {
  if (numbers.length === 0) {
    return 0;
  }

  var total = 0;
  for (var i = 0; i < numbers.length; i++) {
    total = total + numbers[i];
  }

  return Math.round((total / numbers.length) * 10) / 10;
}

// Turns daily visit numbers into a small set of dashboard statistics
function buildDashboardStats(dailyVisits) {
  var total = 0;
  var highestDay = 0;

  for (var i = 0; i < dailyVisits.length; i++) {
    total = total + dailyVisits[i];
    if (dailyVisits[i] > highestDay) {
      highestDay = dailyVisits[i];
    }
  }

  return {
    totalVisits: total,
    averagePerDay: calculateAverage(dailyVisits),
    busiestDayVisits: highestDay,
    isBusyPeriod: calculateAverage(dailyVisits) > analyticsConfig.busyThreshold
  };
}

// Groups usage numbers into low, medium and high levels
function classifyUsageLevel(visitsPerDay) {
  if (visitsPerDay >= analyticsConfig.busyThreshold) {
    return "high";
  } else if (visitsPerDay >= analyticsConfig.busyThreshold / 2) {
    return "medium";
  }
  return "low";
}

// Creates a short text summary for the analytics report
function prepareAnalyticsSummary(dailyVisits) {
  var stats = buildDashboardStats(dailyVisits);
  var level = classifyUsageLevel(stats.averagePerDay);

  return "Last " + analyticsConfig.reportingPeriodDays + " days: " +
    stats.totalVisits + " visits, " +
    stats.averagePerDay + " per day on average (" + level + " usage). " +
    "Most visited page: " + findMostVisitedPage() + ".";
}
