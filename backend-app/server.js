require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;
const verifyToken = require("./middleware/AuthMiddleware")
const argon2 = require('argon2'); 
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const axios = require('axios');

// const {Novu} = require("@novu/node");
// const novu = new Novu("82127c4dbb88cea831be3675f883fafa");

const nodemailer = require('nodemailer');

const app = express();

// Hashing of secretKey
const salt = bcrypt.genSaltSync(10);
const hashedKey = bcrypt.hashSync(secretKey, salt);

console.log('Hashed key:', hashedKey);

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

// Function to generate SHA-1 hash of password
function generateSHA1Hash(password) {
    const sha1Hash = crypto.createHash('sha1').update(password).digest('hex');
    return sha1Hash.toUpperCase();
}

// Function to check if password hash apperas in Pwned Passwords Database
async function checkPasswordAgainstPwnedPasswords(passwordHash) {
    const apiUrl = `https://api.pwnedpasswords.com/range/${passwordHash.substr(0, 5)}`;

    try {
        const response = await axios.get(apiUrl);
        const hashSuffixes = response.data.split('\n');
        const found = hashSuffixes.find(suffix => suffix.startsWith(passwordHash.substr(5)));

        return found ? found.split(':')[1] : 0;
    } catch (error) {
        console.error('Error checking password against Pwned Passwords:', error);
        throw error;
    }
}

// Validate Email Function
function validateEmail(email) {
    // Regular expression for email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Check if the email address is valid
    return emailRegex.test(email);
}

// Validate Username Function
function validateUsername(lastname, firstname) {
    const disallowedCharacters = ["'", ";", "--", " ", ",", "\"", "`", "(", ")", "[", "]", "{", "}", "%", "&", "=", "+", "*", "/", "\\", "<", ">", "?", "!", "@", "#", "$", "~"];

    // Check if the username contains any disallowed characters
    for (const character of disallowedCharacters) {
        if (lastname.includes(character) || firstname.includes(character)) {
            return false;
        }
    }
    return true;
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

//----------------------------------------------------Registration/Sign In----------------------------------------------
app.post('/registration/', async (req, res) => {
    try{
        // Add email validation using the validateEmail function
        const userEmail = req.body.Email;
        if (!validateEmail(userEmail)) {
            console.log("Invalid email address");
            return res.status(400).json({ message: "Invalid email address" });
        }

        // Add username validation using the validateUsername function
        const lastname = req.body.LastName;
        const firstname = req.body.FirstName;
        if (!validateUsername(lastname, firstname)) {
            console.log("Invalid username");
            return res.status(400).json({ message: "Invalid username" });
        }


        console.log(req.body.Password)
        console.log(req.body.ConfirmPassword)
        if(req.body.Password !== req.body.ConfirmPassword){
            console.log("Password and Confirm Password do not match");
            return res.status(400).json({message: "Password and Confirm Password do not match"})
        }
        
        const password = req.body.Password;

        // Hash the password using Argon2
        const hashedPassword = await argon2.hash(password);
        console.log(hashedPassword);

        // SHA-1 hash for password
        const passwordHash = generateSHA1Hash(password);
        console.log("SHA-1 password: ", passwordHash);

        const matchCount = await checkPasswordAgainstPwnedPasswords(passwordHash);
        console.log("Pwned Password match count: ", matchCount);
        
        if (matchCount > 1) {
            console.log("This password has been exposed in data breaches. Please choose a different password.");
            return res.status(400).json({ message: "This password has been exposed in data breaches. Please choose a different password." });
        }
        else if (matchCount < 0) {
            console.log("Error");
            return res.status(400).json({ message: "Error" });
        }
        else {
            console.log("Continue");
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
            const values = [req.body.LastName, req.body.FirstName, req.body.Email, req.body.ContactNo, req.body.Address, hashedPassword, req.body.Authorization];
            console.log("insert: "+ values);
            pool.query(q, [values], (err, data) => {
                console.log(err,data);
                if(err) return res.json({ error: "SQL Error"});
                // else return res.json({data});
            });
            res.status(200).json({message: "Registered"});
        }

    }catch(error){
        console.log(error);
        res.status(500).json({
           message: "Internal server error"
        });
    }
})


// JWT secret key to be more complex (future implementation)
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
        const [results, fields] = await pool.execute(q, [email]);
        // const params = [email, password];

        const auth = "SELECT Authorization FROM users WHERE Email = ? AND Password = ?"; 

        
        // const [results, fields] = await pool.execute(q, params);
        const [authResults, rFields] = await pool.execute(auth, params);

        // console.log(params)
        // console.log(fields)
        // console.log(rFields)
        // console.log(authResults[0].Authorization);

        // authorizationValue = authResults[0].Authorization;

        // if (results.length === 1) {
            const hashedPassword = results[0].Password;
            authorizationValue = results[0].Authorization;
            
            // Use argon2.verify to compare the user's input with the stored hash
            const isPasswordValid = await argon2.verify(hashedPassword, password);

            if (isPasswordValid) {
                // Password is correct, proceed with authentication

                // User is authenticated, generate JWT token
                // need to implement security for the secret key
                if (results.length > 0 && authorizationValue === 1) {
                    const token = jwt.sign({ email: params[0], authorization: authResults[0].Authorization }, hashedKey, { expiresIn: '60s' });
                    otp = generateOTP();
                    sendEmail(email, otp);
                    res.status(200).json({ message: 'Authentication Successful and AuthValue = 1', token: token, Login: true});
                    console.log("Success");
                } 
                else if (results.length > 0 && authorizationValue == 2) {
                    otp = generateOTP();
                    sendEmail(email, otp);
                    res.status(201).json({ message: 'Authentication Successful and AuthValue = 2'});       
                } 
                else if (results.length > 0 && authorizationValue == 3) {
                    otp = generateOTP();
                    sendEmail(email, otp);
                    res.status(202).json({ message: 'Authentication Successful and AuthValue = 3'});
                } 
                else {
                    // Invalid authorization value
                    res.status(401).json({ message: 'Authentication failed'});
                    console.log("Failed");
                }
            
        } else {
                // Incorrect password
                res.status(401).json({ message: 'Authentication failed: Incorrect password' });
            }
        
    } catch (error){
        console.log(error);
        res.status(500).json({
            message: "Internal server error" });
        }
    
});
            
        


app.get('/checkAuth/',verifyToken, async(req, res) => {
    console.log(res.json)
    
})


app.post('/2fa/', async (req, res) => {
    try{
        userOTP = req.body.OTP;
        email = req.body.Email;
        console.log(email);
        if (userOTP == otp && authorizationValue == 1){
            const token = jwt.sign({authorization: authorizationValue}, secretKey, { expiresIn: '15m' });

            const q = 'UPDATE users SET Token = ? WHERE Email = ?';
            const params = [token, req.body.Email];

            const [results, fields] = await pool.execute(q, params);

            res.status(201).json({ message: '2FA Success Admin', token});
        }
        else if(userOTP == otp && authorizationValue == 2){
            const token = jwt.sign({authorization: authorizationValue,}, secretKey, { expiresIn: '15m' });
            const q = 'UPDATE users SET Token = ? WHERE Email = ?';
            const params = [token, req.body.Email];

            const [results, fields] = await pool.execute(q, params);
            res.status(202).json({ message: '2FA Success Service', token});
        }
        else if(userOTP == otp && authorizationValue == 3){
            const token = jwt.sign({authorization: authorizationValue}, secretKey, { expiresIn: '15m' });
            const q = 'UPDATE users SET Token = ? WHERE Email = ?';
            const params = [token, req.body.Email];

            const [results, fields] = await pool.execute(q, params);            
            res.status(202).json({ message: '2FA Success User', token});
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

//----------------------------------------------------Registration/Sign In----------------------------------------------

//----------------------------------------------------Admin-------------------------------------------------------------

// !!!Admin Route Codes Here!!!

app.post('/adminaddservices/', async (req, res) => {
    try{
        console.log(req.body);

        const checkServiceID = "SELECT * FROM services WHERE serviceID = ?";
        const [results, fields] = await pool.execute(checkServiceID, [req.body.ServiceID]);


        const q = 'INSERT INTO services(serviceID, ServiceName, ServiceDesc, ServiceAdd) VALUES (?)';
        const values = [...Object.values(req.body)];

        if (results.length > 0){
            res.status(400).json({
                message: "Service ID exist"
            });
        }
        else{
            pool.query(q, [values], (err, data) =>{
                console.log(err,data);
                if(err) return res.json({ error: "SQL Error"});
                else return res.json({data});
            })
        }
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
})

//----------------------------------------------------Admin-------------------------------------------------------------


//----------------------------------------------------Services----------------------------------------------------------

// !!!Services Route Codes Here!!!

//----------------------------------------------------Services----------------------------------------------------------

//----------------------------------------------------Users-------------------------------------------------------------

// !!!Users Route Codes Here!!!

//----------------------------------------------------Users-------------------------------------------------------------



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

