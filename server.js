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

app.post('/api/login', async (req, res) => {
    try { 
        const { username, password } = req.body;

        const result = await sql.query`SELECT * FROM Developer WHERE Email = ${username} AND Password = ${password}`;

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
        const { projectName, description, targetDate } = req.body;

        await sql.query`INSERT INTO Project (ProjectName, ProjectDescription, StartDate, TargetDate)
                        VALUES (${projectName}, ${description}, GETDATE(), ${targetDate})`;

        res.json({ success: true, message: "Project Created!"});
    } catch (err) {
        console.error(err);
        res.status(500).send("Create Project Error");
    }
});

app.post('/api/addMember', async (req, res) => {
    try {
        const { memberName, memberEmail } = req.body;

        const nameParts = memberName.split(' ');
        const fName = nameParts[0];
        const lName = nameParts.length > 1 ? nameParts[1] : '';
        const defaultPass = '12345';

        await sql.query`INSERT INTO Developer (FName, LName, Email, Password)
                        VALUES (${fName}, ${lName}, ${memberEmail}, ${defaultPass})`;

        res.json({ success: true, message: "Member Added!" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Add Member Error");
    }
});

app.post('/api/addTask', async (req, res) => {
    try {
        const { taskName, dueDate } = req.body;

        const currentProjectID = 1;

        await sql.query`INSERT INTO Task (ProjectID, TaskDescription, StartDate, TargetDate, Priority)
                        VALUES (${currentProjectID}, ${taskName}, GETDATE(), ${dueDate}, 'Medium')`;

        res.json({ success: true, message: "Task Added!" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Add Task Error");
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});