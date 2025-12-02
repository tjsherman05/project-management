const API_URL = "http://localhost:3000/api";
let currentUser = null;

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

    if (page === 'MyProjects') {
      window.loadProjects();
    }
}

// Default to Home tab
document.addEventListener("DOMContentLoaded", () => {
  document.getElementsByClassName("tablink")[0].click();

  //Handle Sign Up
  document.getElementById("signupForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(data)
      });
      const result = await response.json();

      if (result.success) {
        alert(result.message);
        document.querySelector("button[onclick*='Login']").click();
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error(error);
      alert("Server Error.");
    }
  });

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
        currentUser = result.user;
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

    if (!currentUser) {
      alert("You must login first!")
      return;
    }

    const data = Object.fromEntries(new FormData(e.target).entries());

    data.developerID = currentUser.DeveloperID

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

  window.loadProjects = async function() {
    if (!currentUser) {
      document.getElementById("projectsContainer").innerHTML = "<p>Please Login First.</p>";
      return;
    }

    try {
      const response = await fetch(`${API_URL}/myProjects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ developerID: currentUser.DeveloperID})
      });

      const result = await response.json();
      const container = document.getElementById("projectsContainer");
      container.innerHTML = "";

      if (result.projects.length === 0) {
        container.innerHTML = "<p>You do not have any projects yet.</p>";
        return;
      }

      result.projects.forEach(project => {
        let membersHTML = "<ul>";
        project.members.forEach(m => {
          membersHTML += `<li>${m.FName} ${m.LName} (${m.Role})</li>`;
        });
        membersHTML += "</ul>";

        let tasksHTML = "<ul>";
        if(project.tasks.length === 0) tasksHTML += "<li>No tasks yet.</li>";
        project.tasks.forEach(t => {
          const dateStr = t.DueDate ? new Date(t.DueDate).toLocaleDateString() : "No Date";

          let priorityColor = 'black';
          if (t.Priority === 'High') priorityColor = 'red';
          else if (t.Priority === 'Medium') priorityColor = 'orange';
          else if (t.Priority === 'Low') priorityColor = 'green'

          tasksHTML += `<li><span style="color: ${priorityColor}; font-weight: bold;">[${t.Priority}]</span> ${t.TaskDescription} (Due: ${dateStr})</li>`;
        });

        tasksHTML += "</ul>";

        const card = document.createElement("div");
        card.className = "project-card";
        card.innerHTML = `
          <h2 class="project-header">
            ${project.ProjectName}
            <span class="role-badge">${project.Role}</span>
          </h2>
          <p><i>${project.ProjectDescription}</i></p>

          <div class="card-body">
            <div class="info-box">
              <h4>Team Members</h4>
              ${membersHTML}
            </div>
            <div class="info-box">
              <h4>Tasks</h4>
              ${tasksHTML}
            </div>
          </div>
        `;
        container.appendChild(card);
      });

    } catch (error) {
      console.error(error);
      container.innerHTML = "<p>Error loading projects.</p>";
    }
  };
});