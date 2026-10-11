// Notification helpers for leave approvals and status updates.

var notificationQueue = [];
var nextNotificationId = 1;

var priorityByStatus = {
  Approved: "normal",
  Rejected: "high",
  Pending: "low",
  Cancelled: "normal"
};

// Chooses a priority level based on the leave status
function assignPriority(status) {
  var priority = priorityByStatus[status];

  if (priority === undefined) {
    return "low";
  }

  return priority;
}

// Builds the text shown to the student
function formatNotificationMessage(applicationId, status, studentName) {
  var message = "Hello " + studentName + ", ";

  if (status === "Approved") {
    message += "your leave application " + applicationId + " has been approved.";
  } else if (status === "Rejected") {
    message += "your leave application " + applicationId + " was not approved.";
  } else if (status === "Pending") {
    message += "your leave application " + applicationId + " is waiting for review.";
  } else {
    message += "there is an update on leave application " + applicationId + ".";
  }

  return message;
}

// Creates a notification object
function createNotification(applicationId, status, studentName) {
  var notification = {
    id: nextNotificationId,
    applicationId: applicationId,
    message: formatNotificationMessage(applicationId, status, studentName),
    priority: assignPriority(status),
    isRead: false
  };

  nextNotificationId = nextNotificationId + 1;
  return notification;
}

// Adds a notification to the queue and returns the new queue size
function addToQueue(notification) {
  notificationQueue.push(notification);
  return notificationQueue.length;
}

// Puts high priority notifications first
function sortQueueByPriority() {
  var order = { high: 1, normal: 2, low: 3 };

  notificationQueue.sort(function (a, b) {
    return order[a.priority] - order[b.priority];
  });
}

// Takes the next notification out of the queue
function getNextNotification() {
  if (notificationQueue.length === 0) {
    return null;
  }

  sortQueueByPriority();
  return notificationQueue.shift();
}

// Counts the notifications that have not been read yet
function countUnreadNotifications() {
  var unread = 0;

  for (var i = 0; i < notificationQueue.length; i++) {
    if (!notificationQueue[i].isRead) {
      unread++;
    }
  }

  return unread;
}

// Marks every notification for one application as read
function markApplicationAsRead(applicationId) {
  for (var i = 0; i < notificationQueue.length; i++) {
    if (notificationQueue[i].applicationId === applicationId) {
      notificationQueue[i].isRead = true;
    }
  }
}

// Removes notifications that were already read
function clearReadNotifications() {
  var remaining = [];

  for (var i = 0; i < notificationQueue.length; i++) {
    if (!notificationQueue[i].isRead) {
      remaining.push(notificationQueue[i]);
    }
  }

  notificationQueue = remaining;
  return notificationQueue.length;
}
