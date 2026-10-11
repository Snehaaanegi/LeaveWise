// Handles the filter and the PDF links on the Leave Status page

var statusFilter = document.getElementById("statusFilter");
var tableRows = document.querySelectorAll("#statusTable tbody tr");
var resultCount = document.getElementById("resultCount");
var pdfLinks = document.querySelectorAll(".pdf-link");

function filterRows() {
  var selected = statusFilter.value;
  var visible = 0;

  for (var i = 0; i < tableRows.length; i++) {
    var rowStatus = tableRows[i].getAttribute("data-status");

    if (selected === "All" || rowStatus === selected) {
      tableRows[i].style.display = "";
      visible++;
    } else {
      tableRows[i].style.display = "none";
    }
  }

  if (visible === 1) {
    resultCount.textContent = "Showing 1 application";
  } else {
    resultCount.textContent = "Showing " + visible + " applications";
  }
}

statusFilter.addEventListener("change", filterRows);

for (var j = 0; j < pdfLinks.length; j++) {
  pdfLinks[j].addEventListener("click", function (event) {
    event.preventDefault();
    var applicationId = this.getAttribute("data-id");
    alert("The PDF for application " + applicationId + " will be available soon.");
  });
}
