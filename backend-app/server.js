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
function sendEmail(email, code) {
    const mailOptions = {
        from: 'ict3103.3203@gmail.com',
        to: email,
        subject: 'Your 2FA code',
        text: `Your 2FA code is: ${code}`,
    };

    return transporter.sendMail(mailOptions);
}

// Generate a random 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function setOTPWithCountdown() {
    // Display the initial OTP

    console.log(`Current OTP: ${otp}`);

    // Define the countdown duration in seconds (e.g., 60 seconds)
    const countdownDuration = 10;

    // Initialize the countdown timer
    let countdown = countdownDuration;

    // Create a function to update the countdown and set OTP to 0 when it reaches 0
    function updateCountdown() {
        if (countdown > 0) {
            console.log(`OTP will reset in ${countdown} seconds.`);
            countdown -= 1;
            setTimeout(updateCountdown, 1000); // Update countdown every 1 second (1000 milliseconds)
        } else {
            otp = 0;
            console.log('OTP has been reset to 0.');
        }
    }

    // Start the countdown
    updateCountdown();
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

// ------------------------------------------------------------------Functions-------------------------------------------------------------
// Create a MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Use bodyparser for frontend data transmission to backend
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Testing for route and server connection (Can Remove)
app.get('/data', async (req, res) => {
    try {
        const [rows, fields] = await pool.execute('SELECT * FROM users');
        res.json(rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });

    }
});

// Routes:
// app.post('/registration/')
// app.post('/signin/')

//----------------------------------------------------- Routes ---------------------------------------------------------
// Registration for users

//----------------------------------------------------Registration/Sign In----------------------------------------------
app.post('/registration/', async (req, res) => {
    try {
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
        if (req.body.Password !== req.body.ConfirmPassword) {
            console.log("Password and Confirm Password do not match");
            return res.status(400).json({ message: "Password and Confirm Password do not match" })
        }

        const password = req.body.Password;

        // Hash the password using Argon2
        const hashedPassword = await argon2.hash(password);
        console.log(hashedPassword);

        // Generate SHA-1 hash of the password
        const passwordHash = generateSHA1Hash(plainPassword);
        console.log('Password SHA-1 hash:', passwordHash);

        // Check password against Pwned Passwords
        const matchCount = await checkPasswordAgainstPwnedPasswords(passwordHash);
        console.log('Pwned Passwords match count:', matchCount);

        if (matchCount > 1) {
            console.log("This password has been exposed in data breaches. Please choose a different password.");
            return res.status(400).json({ message: "This password has been exposed in data breaches. Please choose a different password." });
        } else if (matchCount == 0) {
            console.log("Continue");
            // Proceed with registration logic here
        } else {
            console.log("Error");
            return res.status(400).json({ message: "Error" });
        }

        var emailFlag = false;
        var contactFlag = false;

        const checkEmail = 'SELECT * FROM users WHERE Email = ?';
        const checkContact = 'SELECT * FROM users WHERE ContactNo = ?';

        const [eResults, efields] = await pool.execute(checkEmail, [req.body.Email]);
        const [cResults, cfields] = await pool.execute(checkContact, [req.body.ContactNo]);

        if (eResults.length > 0 && cResults.length > 0) {
            emailFlag = true;
            console.log("Email and contacts used");
            res.status(401).json({ message: 'Email and contacts already used' });
        }
        else if (cResults.length > 0) {
            contactFlag = true;
            console.log("Contact Number used");
            res.status(402).json({ message: 'Contact Number already used'});
        }
        else if(cResults.length != 8){
            console.log("contact 123")
            res.status(405).json({ message: "Contact number have to be 8 number"})
        }
        else if (eResults.length > 0){
            console.log("Email used");
            res.status(403).json({ message: 'Email already used' });
        }
        else if(password.length != 8){
            res.status(404).json({ message: "Password needs to be 8 number" })
        }
        else{
            console.log(req.body);
            const q = `insert into users(LastName, FirstName, Email, ContactNo, Address, Password, Authorization) VALUES(?)`;
            const values = [req.body.LastName, req.body.FirstName, req.body.Email, req.body.ContactNo, req.body.Address, hashedPassword, req.body.Authorization];
            console.log("insert: " + values);
            pool.query(q, [values], (err, data) => {
                console.log(err, data);
                if (err) return res.json({ error: "SQL Error" });
                // else return res.json({data});
            });
            res.status(200).json({ message: "Registered" });
        }

    } catch (error) {
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
    try {
        console.log("In Sign in Route");
        // const { email, password } = req.body;
        const email = (req.body.Email);
        const password = (req.body.Password);
        console.log(email);
        console.log(password);

        const q = "SELECT * FROM users WHERE Email = ?";
        const [results, fields] = await pool.execute(q, [email]);
        // const params = [email, password];

        console.log(results);

        const auth = "SELECT Authorization FROM users WHERE Email = ?";


        // const [results, fields] = await pool.execute(q, params);
        const [authResults, rFields] = await pool.execute(auth, [email]);

        // console.log(params)
        // console.log(fields)
        // console.log(rFields)
        // console.log(authResults[0].Authorization);

        // authorizationValue = authResults[0].Authorization;

        // if (results.length === 1) {
        if (results.length > 0) {
            const hashedPassword = results[0].Password;
            authorizationValue = results[0].Authorization;

            // Use argon2.verify to compare the user's input with the stored hash
            const isPasswordValid = await argon2.verify(hashedPassword, password);

            if (isPasswordValid) {
                // Password is correct, proceed with authentication

                // User is authenticated, generate JWT token
                // need to implement security for the secret key

                if (results.length > 0 && authorizationValue === 1) {
                    otp = generateOTP();
                    sendEmail(email, otp);
                    setOTPWithCountdown();
                    res.status(200).json({ message: 'Authentication Successful and AuthValue = 1', Email: email });
                    console.log("Success");
                }
                else if (results.length > 0 && authorizationValue == 2) {
                    otp = generateOTP();
                    sendEmail(email, otp);
                    setOTPWithCountdown();
                    res.status(201).json({ message: 'Authentication Successful and AuthValue = 2', Email: email });
                }
                else if (results.length > 0 && authorizationValue == 3) {
                    otp = generateOTP();
                    setOTPWithCountdown();
                    console.log(otp);
                    sendEmail(email, otp);
                    res.status(202).json({ message: 'Authentication Successful and AuthValue = 3', Email: email });
                }
                else {
                    // Invalid authorization value
                    res.status(401).json({ message: 'Authentication failed' });
                    console.log("Failed");
                }

            } else {
                // Incorrect password
                res.status(402).json({ message: 'Authentication failed: Incorrect password' });
            }
        } else {
            res.status(403).json({ message: 'Email Invalid' });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }

});

app.post('/resend2fa/', async (req, res) => {
    try {
        console.log("inside resend 2fa");
        const email = (req.body.Email);
        otp = generateOTP();
        setOTPWithCountdown();
        sendEmail(email, otp);
        res.status(200).json({
            message: "Resent"
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
})


app.get('/checkAuth/', verifyToken, async (req, res) => {
    console.log(res.json)

})


app.post('/2fa/', async (req, res) => {
    try {
        userOTP = req.body.OTP;
        email = req.body.Email;
        console.log(email);
        if (userOTP == otp && authorizationValue == 1) {
            const token = jwt.sign({ authorization: authorizationValue }, secretKey, { expiresIn: '15m' });

            const q = 'UPDATE users SET Token = ? WHERE Email = ?';
            const params = [token, req.body.Email];

            const [results, fields] = await pool.execute(q, params);

            res.status(201).json({ message: '2FA Success Admin', token });
        }
        else if (userOTP == otp && authorizationValue == 2) {
            const token = jwt.sign({ authorization: authorizationValue, }, secretKey, { expiresIn: '15m' });
            const q = 'UPDATE users SET Token = ? WHERE Email = ?';
            const params = [token, req.body.Email];

            const [results, fields] = await pool.execute(q, params);
            res.status(202).json({ message: '2FA Success Service', token });
        }
        else if (userOTP == otp && authorizationValue == 3) {
            const token = jwt.sign({ authorization: authorizationValue }, secretKey, { expiresIn: '15m' });
            console.log(otp);
            const q = 'UPDATE users SET Token = ? WHERE Email = ?';
            const params = [token, req.body.Email];

            const [results, fields] = await pool.execute(q, params);
            res.status(202).json({ message: '2FA Success User', token });
        }
        else if (otp == 0) {
            res.status(400).json({ message: 'Expired' });
        }
        else {
            res.status(401).json({ message: '2FA Fail' });
        }
    } catch (error) {
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
    try {
        console.log(req.body);

        const checkServiceID = "SELECT * FROM services WHERE serviceID = ?";
        const [results, fields] = await pool.execute(checkServiceID, [req.body.ServiceID]);


        const q = 'INSERT INTO services(serviceID, ServiceName, ServiceDesc, ServiceAdd) VALUES (?)';
        const values = [...Object.values(req.body)];

        if (results.length > 0) {
            res.status(400).json({
                message: "Service ID exist"
            });
        }
        else {
            pool.query(q, [values], (err, data) => {
                console.log(err, data);
                if (err) return res.json({ error: "SQL Error" });
                else return res.json({ data });
            })
        }
    }
    catch (error) {
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

//-------------------------------------------Payment---------------------------------
const Stripe = require('stripe');
const { match } = require('assert');
const stripe = Stripe(process.env.STRIPE_KEY)

//app.use("/api/stripe", stripe);
//console.log("stripe",stripe);

app.post('/create-checkout-session', async (req, res) => {
    //console.log("stripe inside post",stripe);
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'T-shirt',
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.CLIENT_URL}/checkout-sucess`,
    cancel_url: `${process.env.CLIENT_URL}/cartpage`,
  });

  
  res.send({url: session.url})
});

