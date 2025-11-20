const express = require('express');
const sql = require('mssql'); //for the microsoft sql database
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

//database config
const dbConfig = {
        user:'user', // user for the database
        password:'password', 
        server:'localhost',
        database:'DatabaseName', // the name of the database in ssms
        options: {
            encrypt: true,
            trustServerCertificate: true

        }
};