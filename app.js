function openPage(evt, page) {
    var i, tabcontent, tablink;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablink = document.getElementsByClassName("tablink");
    for (i = 0; i < tablink.length; i++) {
        tablink[i].className = tablink[i].className.replace("active", "");
    }

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