function openPage(evt, page) {
  const tabcontent = document.getElementsByClassName("tabcontent");
  const tablinks = document.getElementsByClassName("tablink");

  // Hide all tab contents
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Remove active class from all buttons
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show selected tab and mark button as active
  document.getElementById(page).style.display = "block";
  evt.currentTarget.className += " active";
}

// Default to Home tab
document.addEventListener("DOMContentLoaded", () => {
  document.getElementsByClassName("tablink")[0].click();

  // Handle Login
  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Logged in successfully!");
  });

  // Handle Project Creation
  document.getElementById("projectForm").addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Project created!");
  });

  // Handle Member Addition
  document.getElementById("memberForm").addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Member added!");
  });

  // Handle Task Addition
  document.getElementById("taskForm").addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Task added!");
  });
});

