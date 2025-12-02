require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sql = require('mssql/msnodesqlv8');

const app = express();
app.use(cors());
app.use(express.json());

//database config
const dbConfig = {
        server: process.env.DB_SERVER || 'localhost\\SQLEXPRESS',
        database:'DevProjectDB',
        options: {
            trustedConnection: true,
            encrypt: false,
            trustServerCertificate: true

        }
};

sql.connect(dbConfig).then(pool => {
    if (pool.connected) {
        console.log("Connection to SQL Server successful!");
    }
}).catch(err => {
    console.error("Database connection failed:", err);
});

app.post('/api/signup', async (req, res) => {
    try {
        const { fName, lName, email, password } = req.body;

        const check = await sql.query`SELECT * FROM Developer WHERE Email = ${email}`;

        if (check.recordset.length > 0) {
            return res.status(400).json({success: false, message: "Email already used"});
        }

        await sql.query`INSERT INTO Developer (FName, LName, Email, Password)
                        VALUES (${fName}, ${lName}, ${email}, ${password})`;

        res.json({ success: true, message: "Account Created! Please login."});
    } catch (err) {
        console.error(err);
        res.status(500).send("Sign Error");
    }
});

app.post('/api/login', async (req, res) => {
    try { 
        const { email, password } = req.body;

        const result = await sql.query`SELECT * FROM Developer WHERE Email = ${email} AND Password = ${password}`;

        if (result.recordset.length > 0) {
            res.json({ success: true, user: result.recordset[0]});
        } else {
            res.status(401).json({ success: false, message: "Invalid Credentials"});
        }
    } catch (err) {
        console.error(err)
        res.status(500).send("Login Error");
    }        
});

app.post('/api/createProject', async (req, res) => {
    try {
        const { projectName, description, targetDate, developerID } = req.body;

        const result = await sql.query`INSERT INTO Project (ProjectName, ProjectDescription, StartDate, TargetDate)
                                       OUTPUT INSERTED.ProjectID
                                       VALUES (${projectName}, ${description}, GETDATE(), ${targetDate})`;

        const newProjectID = result.recordset[0].ProjectID;

        await sql.query`INSERT INTO Project_Management (ProjectID, DeveloperID, Role)
                        VALUES (${newProjectID}, ${developerID}, 'Editor')`;

        res.json({ success: true, message: "Project Created!"});
    } catch (err) {
        console.error(err);
        res.status(500).send("Create Project Error");
    }
});

app.post('/api/addMember', async (req, res) => {
    try {
        const { memberEmail, projectID, role } = req.body;

        const userResult = await sql.query`SELECT DeveloperID FROM Developer WHERE Email = ${memberEmail}`;

        if (userResult.recordset.length === 0) {
            return res.status(404).json({ success: false, message: "User not found! First Sign Up."})
        }

        const devID = userResult.recordset[0].DeveloperID;

        await sql.query`INSERT INTO Project_Management (ProjectID, DeveloperID, Role)
                        VALUES (${projectID}, ${devID}, ${role})`;

        res.json({ success: true, message: "Member Added!" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Add Member Error");
    }
});

app.post('/api/addTask', async (req, res) => {
    try {
        const { taskName, dueDate, projectID, priority } = req.body;

        await sql.query`INSERT INTO Task (ProjectID, TaskDescription, StartDate, TargetDate, Priority)
                        VALUES (${projectID}, ${taskName}, GETDATE(), ${dueDate}, ${priority})`;

        res.json({ success: true, message: "Task Added!" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Add Task Error");
    }
});

app.post('/api/myProjects', async (req,res) => {
    try {
        const { developerID } = req.body;

        const projectResult = await sql.query`
            SELECT P.ProjectID, P.ProjectName, P.ProjectDescription, P.TargetDate, PM.Role
            FROM Project P
            JOIN Project_Management PM ON P.ProjectID = PM.ProjectID
            WHERE PM.DeveloperID = ${developerID}`;
        
        const projects = projectResult.recordset;

        for (const project of projects) {
            const memebersResult = await sql.query`
            SELECT D.FName, D.LName, PM.Role
            FROM Developer D
            JOIN Project_Management PM ON D.DeveloperID = PM.DeveloperID
            WHERE PM.ProjectID = ${project.ProjectID}`;

            project.members = memebersResult.recordset;

            const tasksResult = await sql.query`
            SELECT TaskDescription, TargetDate AS DueDate, Priority, StartDate
            FROM Task
            WHERE ProjectID = ${project.ProjectID}`;

            project.tasks = tasksResult.recordset; 
        }

        res.json({ success: true, projects: projects})

    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching projects");
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});