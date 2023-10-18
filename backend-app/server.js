const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");
// const {Novu} = require("@novu/node");
// const novu = new Novu("82127c4dbb88cea831be3675f883fafa");

const nodemailer = require('nodemailer');


const app = express();

var corsOptions = {
    origin: "http://localhost:8081"
};
const whitelist = ["https://localhost:3000"]

// app.use(cors(corsOptions));
app.use(cors())

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'ict3103.3203@gmail.com',
        pass: 'axrp bpkx hvnp xfma',
    }
});

// ------------------------------------------------------------------Functions-------------------------------------------------------------
// Function to send 2FA codes via email
function sendEmail(email, code){
    const mailOptions = {
        from: 'ict3103.3203@gmail.com',
        to: email,
        subject: 'Your 2FA code',
        text: `Your 2FA code is: ${code}`,
    };

    return transporter.sendMail(mailOptions);
}

// Generate a random 6-digit OTP
function generateOTP(){
    return Math.floor(100000 + Math.random() * 900000).toString();
}


// ------------------------------------------------------------------Functions-------------------------------------------------------------
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

// Routes:
// app.post('/registration/')
// app.post('/signin/')

//----------------------------------------------------- Routes ---------------------------------------------------------
// Registration for users
// 
app.post('/registration/', async (req, res) => {
    try{

        if(req.body.Password !== req.body.ConfirmPassword){
            console.log("Password and Confirm Password do not match");
            return res.status(400).json({message: "Password and Confirm Password do not match"})
        }
        

        var emailFlag = false;
        var contactFlag = false;

        const checkEmail = 'SELECT * FROM users WHERE Email = ?';
        const checkContact = 'SELECT * FROM users WHERE ContactNo = ?';
        
        const [eResults, efields] = await pool.execute(checkEmail, [req.body.Email]);
        const [cResults, cfields] = await pool.execute(checkContact, [req.body.ContactNo]);

        if (eResults.length > 0 && cResults.length > 0){
            emailFlag = true;
            console.log("Email and contacts used");
            res.status(401).json({ message: 'Email and contacts already used'});
        }
        else if (cResults.length > 0){
            contactFlag = true;
            console.log("Contact Number used1");
            res.status(402).json({ message: 'Contact Number already used'});
        }
        else if (eResults.length > 0){
            console.log("Email used");
            res.status(403).json({ message: 'Email already used'});
        }
        else{
            console.log(req.body);
            const q = `insert into users(LastName, FirstName, Email, ContactNo, Address, Password, Authorization) VALUES(?)`;
            const values = [...Object.values(req.body)];
            const modifiedValues = values.slice(0, values.length -1);
            console.log(modifiedValues);
            console.log("insert", modifiedValues);
            pool.query(q, [modifiedValues], (err, data) => {
                console.log(err,data);
                if(err) return res.json({ error: "SQL Error"});
                else return res.json({data});
            });
        }

    }catch(error){
        console.log(error);
        res.status(500).json({
           message: "Internal server error"
        });
    }
})

var otp;
var authorizationValue;

app.post('/signin/', async (req, res) => {
    try{
        console.log("In Sign in Route");
        // const { email, password } = req.body;
        const email = (req.body.Email);
        const password = (req.body.Password);
        console.log(email);
        console.log(password);

        const q = "SELECT * FROM users WHERE Email = ? AND Password = ?";
        const params = [email, password];

        const auth = "SELECT Authorization FROM users WHERE Email = ? AND Password = ?";

        const [results, fields] = await pool.execute(q, params);
        const [authResults, rFields] = await pool.execute(auth, params);

        console.log(authResults[0].Authorization);

        authorizationValue = authResults[0].Authorization;

        if (results.length > 0 && authorizationValue == 1){
            otp = generateOTP();
            sendEmail(email, otp);
            res.status(200).json({ message: 'Authentication Successful and AuthValue = 1'});
            console.log("Success");
        }
        else if (results.length > 0 && authorizationValue == 2){
            otp = generateOTP();
            sendEmail(email, otp);
            res.status(201).json({ message: 'Authentication Successful and AuthValue = 2'});       
        }
        else if (results.length > 0 && authorizationValue == 3){
            otp = generateOTP();
            sendEmail(email, otp);
            res.status(202).json({ message: 'Authentication Successful and AuthValue = 3'});
        }
        else{
            res.status(401).json({ message: 'Authentication failed'});
            console.log("Failed");
        }

    }catch(error){
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
})

app.post('/2fa/', async (req, res) => {
    try{
        userOTP = req.body.OTP;
        if (userOTP == otp && authorizationValue == 1){
            res.status(201).json({ message: '2FA Success Admin'});
        }
        else if(userOTP == otp && authorizationValue == 2){
            res.status(202).json({ message: '2FA Success Service'});
        }
        else if(userOTP == otp && authorizationValue == 3){
            res.status(202).json({ message: '2FA Success User'});
        }
        else{
            res.status(401).json({ message: '2FA Fail'});
        }
    }catch(error){
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
})



//----------------------------------------------------- Routes ---------------------------------------------------------

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

