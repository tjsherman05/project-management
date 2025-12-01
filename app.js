const API_URL = "http://localhost:3000/api";

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
  document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(data)
      });

      const result = await response.json();
      if (result.success) {
        alert(`Login Successful! Welcome ${result.user.FName}`);
      } else {
        alert("Login Failed: " + result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server Error.");
    }
  });

  // Handle Project Creation
  document.getElementById("projectForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());

    try {
      const response = await fetch(`${API_URL}/createProject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error(error);
    }
  });

  // Handle Member Addition
  document.getElementById("memberForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());

    try {
      const response = await fetch(`${API_URL}/addMember`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error(error);
    }
  });

  // Handle Task Addition
  document.getElementById("taskForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());

    try {
      const response = await fetch(`${API_URL}/addTask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error(error);
    }
  });
});