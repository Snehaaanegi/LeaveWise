// Shared script used on every page

var menuToggle = document.getElementById("menuToggle");
var navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", function () {
    navLinks.classList.toggle("open");
  });
}

// Highlight the link of the page that is currently open
var currentPage = window.location.pathname.split("/").pop();
var allLinks = document.querySelectorAll(".nav-links a");

for (var i = 0; i < allLinks.length; i++) {
  var linkPage = allLinks[i].getAttribute("href").split("/").pop();
  if (linkPage === currentPage) {
    allLinks[i].classList.add("active");
  }
}

// Show the current year in the footer
var yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}
