const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");

const app = express();

var corsOptions = {
    origin: "http://localhost:8081"
};
const whitelist = ["https://localhost:3000"]

// app.use(cors(corsOptions));
app.use(cors())

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'users',
    port: 3306,
    password: 'pw123123',
    database: 'mydb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Use bodyparser for frontend data transmission to backend
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Testing for route and server connection (Can Remove)
app.get('/data', async (req, res) => {
    try{
        const [rows, fields] = await pool.execute('SELECT * FROM users');
        res.json(rows);
    }catch(error){
        console.log(error);
        res.status(500).json({ message: "Internal server error"});
        
    }
});

// Registration for users
app.post('/registration/:userId', async (req, res) => {
    try{
        console.log(req.body);
        const q = `insert into users(LAST_NAME, FIRST_NAME, EMAIL, PASSWORD) VALUES(?)`;
        const values = [...Object.values(req.body)];
        console.log(values);
        console.log("insert", values);
        pool.query(q, [values], (err, data) => {
            console.log(err,data);
            if(err) return res.json({ error: "SQL Error"});
            else return res.json({data});
        });
    }catch(error){
        console.log(error);
        res.status(500).json({
           message: "Internal server error"
        });
    }
})

// Parse requests of content-type - application/json
app.use(express.json());

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


// Simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Profession Services App" });
});


// Set port, listen for requests 
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}. `);
});

