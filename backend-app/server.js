require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;
const verifyToken = require("./middleware/AuthMiddleware")
const argon2 = require('argon2');
const sodium = require('sodium-native');
const svgCaptcha = require('svg-captcha');
const session = require('express-session');


// Replace these with your own values
const encryptionKey = Buffer.alloc(sodium.crypto_secretbox_KEYBYTES);
sodium.randombytes_buf(encryptionKey); // Generate a random encryption key

// Encrypt the secret key
const nonce = Buffer.alloc(sodium.crypto_secretbox_NONCEBYTES);
sodium.randombytes_buf(nonce);
const encrypted = Buffer.alloc(sodium.crypto_secretbox_MACBYTES + Buffer.byteLength(secretKey));
sodium.crypto_secretbox_easy(encrypted, Buffer.from(secretKey), nonce, encryptionKey);
const encryptedSecret = encrypted.toString('hex');
console.log('Hashed key:', encryptedSecret);

const crypto = require('crypto');
const axios = require('axios');

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
    const countdownDuration = 300;

    // Initialize the countdown timer
    let countdown = countdownDuration;

    // Create a function to update the countdown and set OTP to 0 when it reaches 0
    function updateCountdown() {
        if (countdown > 0) {
            // console.log(`OTP will reset in ${countdown} seconds.`);
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

// Set up session handling
app.use(session({
    secret: 'your secret key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true } // Set secure to true if using https
}));


  
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
            return res.status(406).json({ message: "Invalid email address" });
        }

        // Add username validation using the validateUsername function
        const lastname = req.body.LastName;
        const firstname = req.body.FirstName;
        if (!validateUsername(lastname, firstname)) {
            console.log("Invalid username");
            return res.status(411).json({ message: "Invalid username" });
        }

        console.log(req.body.Password)
        console.log(req.body.ConfirmPassword)
        if (req.body.Password !== req.body.ConfirmPassword) {
            console.log("Password and Confirm Password do not match");
            return res.status(408).json({ message: "Password and Confirm Password do not match" })
        }

        const password = req.body.Password;

        // Hash the password using Argon2
        const hashedPassword = await argon2.hash(password);
        console.log(hashedPassword);

        // Generate SHA-1 hash of the password
        const passwordHash = generateSHA1Hash(password);
        console.log('Password SHA-1 hash:', passwordHash);

        // Check password against Pwned Passwords
        const matchCount = await checkPasswordAgainstPwnedPasswords(passwordHash);
        console.log('Pwned Passwords match count:', matchCount);

        if (matchCount > 1) {
            console.log("This password has been exposed in data breaches. Please choose a different password.");
            return res.status(409).json({ message: "This password has been exposed in data breaches. Please choose a different password." });
        } else if (matchCount == 0) {
            console.log("Continue");
            // Proceed with registration logic here
        } else {
            console.log("Error");
            return res.status(410).json({ message: "Error" });
        }

        var emailFlag = false;
        var contactFlag = false;

        const checkEmail = 'SELECT * FROM users WHERE Email = ?';
        const checkContact = 'SELECT * FROM users WHERE ContactNo = ?';

        const [eResults, efields] = await pool.execute(checkEmail, [req.body.Email]);
        const [cResults, cfields] = await pool.execute(checkContact, [req.body.ContactNo]);
        console.log(req.body.ContactNo)

        if (eResults.length > 0 && cResults.length > 0) {
            emailFlag = true;
            console.log("Email and contacts used");
            res.status(401).json({ message: 'Email and contacts already used' });
        }
        else if (cResults.length > 0) {
            contactFlag = true;
            console.log("Contact Number used");
            res.status(402).json({ message: 'Contact Number already used' });
        }
        else if (req.body.ContactNo.length != 8) {
            console.log(req.body.ContactNo.length)
            res.status(405).json({ message: "Contact number have to be 8 number" })
        }
        else if (eResults.length > 0) {
            console.log("Email used");
            res.status(403).json({ message: 'Email already used' });
        }
        else if (password.length < 8) {
            res.status(404).json({ message: "Password needs to be 8 characters" })
        }
        else {
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

let attempts = 0;

// Initialize a dictionary (object) to keep track of login attempt counts
const loginAttempts = {};

// Function to check if an email's account is locked
async function isUserLocked(email) {
    // return loginAttempts[email] >= 5;

    const query = "SELECT IsLocked FROM users WHERE Email=?";
    const [results] = await pool.execute(query, [email]);
    if (results.length > 0) {
        return results[0].IsLocked === 1 || results[0].IsLocked === true;
    }
    return false; // user not found

}

// Function to increment login attempts for an email
async function incrementLoginAttempts(email) {
    loginAttempts[email] = (loginAttempts[email] || 0) + 1;

    // Update the mistake count in the database
    const MistakeCount = loginAttempts[email];
    const updateQuery = `
    UPDATE users
    SET MistakeCount = ?
    WHERE Email = ?;
    `;

    try {
        await pool.execute(updateQuery, [MistakeCount, email]);
    } catch (error) {
        console.error("Error updatinf MistakeCount in the database:", error);
    }

    return loginAttempts[email];
}

// Function to reset login attempts for an email
function resetLoginAttempts(email) {
    loginAttempts[email] = 0;
}

// Function to update mistake count
async function updateUserInDatabase (email, mistakeCount) {
    const updateQuery = `
            UPDATE users
            SET MistakeCount = ?
            WHERE Email = ?;
        `;

    const [results, fields] = await pool.execute(updateQuery, [mistakeCount, email]);

    // Check results if needed
    console.log("User updated successfully:", results);
    return results;
}

// Function to set a timer to unlock the account after 30 minutes
function setLockoutTimer(email) {
    // Calculate unlock time (in 30 minutes)
    const unlockTime = new Date(Date.now() + 1 * 60 * 1000);

    // Update LockoutTimestamp in the database
    const updateQuery = `
        UPDATE users
        SET LockoutTimestamp = ?
        WHERE Email = ?;
    `;

    pool.execute(updateQuery, [unlockTime, email])
        .then(([results, fields]) => {
            console.log("LockoutTimestamp updated successfully:", results);
        })
        .catch((error) => {
            console.error("Error updating LockoutTimestamp:", error);
        });

    // After 30 minutes, reset the login attempts and unlock the account
    setTimeout(() => {
        resetLoginAttempts(email);
    }, 30 * 60 * 1000); // 30 minutes in milliseconds
}


// This is your new CAPTCHA endpoint
app.get('/captcha', (req, res) => {
    const captcha = svgCaptcha.create();
    req.session.captcha = captcha.text; // Save captcha text in session to validate later
    console.log(captcha.text)

    res.type('svg'); // Set the content type to svg
    res.status(200).send(captcha.data); // Send the captcha svg data to client
});

app.post('/signin/', async (req, res) => {

    const email = req.body.Email;

    const q = "SELECT * FROM users WHERE Email = ?";
    const [results, fields] = await pool.execute(q, [email]);
    
    // If the account is locked, handle the lockout logic
    if (await isUserLocked(email)){
        console.log("User Account is locked");
        return res.status(405).json({ message: "Account is locked. Please try again later."});
    }
  
    
    try {
        console.log("In Sign in Route");
        // const { email, password } = req.body;
        const email = (req.body.Email);
        const password = (req.body.Password);
        console.log(email);
        console.log(password);

        // Check email against database
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

        if (password === 'pw123123' && results[0].Authorization == 2 || password === 'pw123123' && results[0].Authorization == 1) {
            res.status(203).json({message: 'service reset password'});
        }
        else {
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
                        resetLoginAttempts(email);
                        updateUserInDatabase(email, 0);

                }
                    else if (results.length > 0 && authorizationValue == 2) {
                        otp = generateOTP();
                        sendEmail(email, otp);
                        setOTPWithCountdown();
                        res.status(201).json({ message: 'Authentication Successful and AuthValue = 2', Email: email });
                        resetLoginAttempts(email);
                        updateUserInDatabase(email, 0);

                }
                    else if (results.length > 0 && authorizationValue == 3) {
                        otp = generateOTP();
                        setOTPWithCountdown();
                        console.log(otp);
                        sendEmail(email, otp);
                        res.status(202).json({ message: 'Authentication Successful and AuthValue = 3', Email: email });
                        resetLoginAttempts(email);
                        updateUserInDatabase(email, 0);

                }
                    else {
                        // Invalid authorization value
                        console.log("Failed");
                        return res.status(401).json({ message: 'Authentication failed' });
                    }

            } else {
                // Incorrect password
                // updateUserInDatabase(email, { MistakeCount: email.MistakeCount + 1 });
                
                const attempts = incrementLoginAttempts(email); // Increment login attempts
                setLockoutTimer(email); 
                console.log(`Login attempts for ${email}: ${attempts}`);
              
                return res.status(402).json({ message: 'Authentication failed: Incorrect password' });
                
            }
        } else {
            return res.status(403).json({ message: 'Email Invalid' });
        }
    }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }

});

app.post('/verify-captcha', (req, res) => {
    const userCaptcha = req.body.captcha;
    if (req.session.captcha === userCaptcha) {
        res.json({ success: true });
    } else {
        res.status(400).json({ success: false, message: 'Captcha verification failed' });
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

app.post('/update-password/', async (req, res) => {
    try{
        const password = (req.body.Password);
        // Hash the password using Argon2
        const hashedPassword = await argon2.hash(password);
        console.log(hashedPassword);

        const q = "UPDATE users SET Password = ? WHERE Email = ?";
        const params = [hashedPassword, req.body.Email];
        console.log(params);
        
        // Generate SHA-1 hash of the password
        const passwordHash = generateSHA1Hash(password);
        console.log('Password SHA-1 hash:', passwordHash);

        // Check password against Pwned Passwords
        const matchCount = await checkPasswordAgainstPwnedPasswords(passwordHash);
        console.log('Pwned Passwords match count:', matchCount);

        if (matchCount > 1) {
            console.log("This password has been exposed in data breaches. Please choose a different password.");
            return res.status(409).json({ message: "This password has been exposed in data breaches. Please choose a different password." });
        } else if (matchCount == 0) {
            console.log("Continue");
            // Proceed with registration logic here
        } else {
            console.log("Error");
            return res.status(410).json({ message: "Error" });
        }

        if(req.body.Password == req.body.ConfirmPassword){
            const [results, fields] = await pool.execute(q, params);
            res.status(200).json({
                message: 'Password Updated'
            })
        }else{
            res.status(400).json({
                message: 'Password does not match'
            })
        }
    }catch(err){
        res.status(500).json({
            message: "Internal server error"
        });
    }
})


app.get('/checkAuth/', verifyToken, async (req, res) => {
    console.log( res.json)

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
    console.log(res.json)
    try {
        console.log(req.body);

        const checkServiceID = "SELECT * FROM services WHERE serviceID = ?";
        const [results, fields] = await pool.execute(checkServiceID, [req.body.ServiceID]);


        const q = 'INSERT INTO services(serviceID, ServiceName, ServiceDesc, ServiceAdd, Price) VALUES (?)';
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
                // else return res.status(200).json({ data, message: 'success' });
            })
            res.status(200).json({ message: 'success' });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
})

app.post('/adminaddusers/', async (req, res) => {
    try {
        const checkEmail = 'SELECT * FROM users WHERE Email = ?'
        const [eResults, eFields] = await pool.execute(checkEmail, [req.body.Email]);
        let q = '';
        let params = [];
        if (eResults.length > 0) {
            res.status(400).json({ message: 'Email exist' })
        } else {
            if (req.body.Authorization == 1){
                q = 'INSERT INTO users (FirstName, LastName, Email, Password, Authorization) VALUES (?)';
                params = [req.body.FirstName, req.body.LastName, req.body.Email, req.body.Password, req.body.Authorization];
            }else if (req.body.Authorization == 2){
                q = 'INSERT INTO users (FirstName, LastName, Email, Password, Authorization, serviceID) VALUES (?)';
                params = [req.body.FirstName, req.body.LastName, req.body.Email, req.body.Password, req.body.Authorization, req.body.ServiceID];
            }
            
            pool.query(q, [params], (err, data) => {
                console.log(err, data);
                if (err) return res.json({ error: "SQL Error" });

            })
            res.status(200).json({ message: 'success' })
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Internal server error"
        })
    }
})

app.get('/getServicesID/', async (req, res) => {
    try{
        const q = 'SELECT serviceID FROM services';
        const [results, fields] = await pool.execute(q);
        const services = [];
        if (results.length > 0){
            for (const row of results) {
                services.push({
                    id: row.serviceID,
                });
            }
            res.json(services);
        }
    }catch (err){
        console.log(err);
        res.status(500).json({
            message: "Internal server error"
        })
    }
})

/*
----------------------------------------------------Logout--------------------------------------------------------------------- 
*/

app.post("/logout/", async (req, res) => {
    console.log("inside server.js")
    // retrieving token
    const token = req.header("Authorization").split(" ")[1]; // Get token part after 'Bearer '
    try {
        const checkTokeninDb = 'SELECT * FROM users WHERE Token = ?';
        const [results, cResults] = await pool.execute(checkTokeninDb, [token])

        if (results.length < 1) {
            res.status(400).json({ message: "User not in DB" })
        } else {
            const updateTokeninDb = 'UPDATE users SET Token = NULL WHERE Token = ?';
            pool.query(updateTokeninDb, [token], (err, data) => {
                console.log(err)
                console.log(data)
                if (err) {
                    return res.json({ error: "SQL error" })
                } else {
                    return res.json({ data })
                }
            })
            res.status(200).json({ message: "Logout successful" })
        }



        // pool.query('SELECT * FROM users WHERE Token = ?', [token], (error, results) => {
        //     console.log('SELECT query results:', results);
        //     if (error) {
        //         console.error('Error querying database', error);
        //         return res.status(500).json({ message: 'Internal server error' });
        //       }

        //       // Check if the user was found
        //       if (results.length === 0) {
        //         return res.status(404).json({ message: 'User not found' });
        //       }

        // })

        // pool.query('UPDATE users SET Token = NULL WHERE Token = ?', [token] , (updateError, updateResults) => {
        //     if (updateError) {
        //         console.error('Error updating token in the database', updateError);
        //         return res.status(500).json({ message: 'Internal server error' });
        //       }
        //       // Send the query results back to the client
        //       res.status(200).json({ message: "Logout Successful" });

        // })

    } catch (err) {
        console.log(err)
    }
})

app.post('/update-service-by-id/', async (req, res) =>{
    const q = 'UPDATE services SET ServiceName = ?, ServiceDesc = ?, ServiceAdd = ?, Price = ? WHERE serviceID = ?';
    const params = [req.body.ServiceName, req.body.ServiceDesc, req.body.ServiceAdd, req.body.ServicePrice, req.body.ServiceID];

    const [results, fields] = await pool.execute(q,params);

    return res.status(200).json({
        message: "Updated service"
    })
})

app.post('/delete-service-by-id/', async (req,res) => {
    const q = 'DELETE FROM services WHERE serviceID = ?';
    const params = [req.body.ServiceID];
    console.log(params);
    const [results, fields] = await pool.execute(q,params);

    return res.status(200).json({
        message: "Deleted service"
    })
})



//

//----------------------------------------------------Admin-------------------------------------------------------------


//----------------------------------------------------Services----------------------------------------------------------

// !!!Services Route Codes Here!!!

//----------------------------------------------------Services----------------------------------------------------------

//----------------------------------------------------Users-------------------------------------------------------------

// !!!Users Route Codes Here!!!

app.get('/get-services/', async (req, res) => {
    const q = "SELECT serviceID, ServiceName, ServiceDesc, Price FROM services";
    const [results, fields] = await pool.execute(q);

    const services = [];

    // Loop through the results and format them
    for (const row of results) {
        services.push({
            id: row.serviceID,
            title: row.ServiceName,
            description: row.ServiceDesc,
            price: row.Price,
        });
    }
    res.json(services);
    console.log(services);
})

app.post('/get-service-by-id/', async (req, res) =>{
    const q = "SELECT serviceID, ServiceName, ServiceDesc, ServiceAdd, Price FROM services WHERE serviceID = ?";
    const params = req.body.ServiceID;
    const [results, fields] = await pool.execute(q, [params]);

    if(results.length > 0){
        return res.status(200).json({
            results
        })
    }
})

app.post('/create-order/', (req, res) => {
    const { userId, selectedDate, address, cart, status } = req.body;

    // Validate the data and perform database insertion
    const insertQuery = 'INSERT INTO orders (UID, serviceID, OrderTime, DateofService, DeliveryAddress, Status) VALUES (?, ?, NOW(), ?, ?, ?)';
  
    cart.forEach((item) => {
      const values = [userId, item.id, selectedDate, address, status];
      console.log("values:",values);
      pool.query(insertQuery, values, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Database error' });
        }
      });
    });
  
    return res.status(200).json({ message: 'Cart items inserted successfully' });
  });

app.post('/get-userid/', async (req, res) => {
    const q = "SELECT UID FROM users WHERE Token = ?"
    const token = req.body.token;

    const [results, fields] = await pool.execute(q, [token]);
    console.log(results);
    res.json(results);
})

app.post('/get-history/', async (req, res) => {
    const q = "SELECT OrderID, ServiceID, OrderTime, DateofService, Status FROM orders WHERE UID = ?";
    console.log(req.body);
    const uid = req.body.userId;
    console.log("history-uid:",uid);
    const [results, fields] = await pool.execute(q, [uid]);

    const orders = [];

    // Loop through the results and format them
    for (const row of results) {
        orders.push({
            orderid: row.OrderID,
            serviceid: row.ServiceID,
            ordertime: row.OrderTime,
            dos: row.DateofService,
            status: row.Status,
        });
    }
    res.json(orders);
    console.log("order:",orders);
})

app.post('/get-service/', async (req, res) => {
    const q = "SELECT ServiceName FROM services WHERE serviceID = ?"
    console.log("req.body:", req.body);
    const serviceID = req.body.sid;
    console.log("serviceid:",serviceID);

    const [results, fields] = await pool.execute(q, [serviceID]);
    console.log("result",results);
    res.json(results);
})

app.post('/complete-order/', async (req, res) => {
    const q = "UPDATE orders SET Status = 'Completed' WHERE OrderID = ?"
    console.log("req.body:", req.body);
    const orderid = req.body.orderid;
    console.log("orderid:",orderid);

    const [results, fields] = await pool.execute(q, [orderid]);
    console.log("result",results);
    res.json(results);
})

//----------------------------------------------------Users-------------------------------------------------------------

//----------------------------------------------ServiceUsers------------------------------------------------

app.post('/get-serviceuserid/', async (req, res) => {
    const q = "SELECT ServiceID FROM users WHERE Token = ?"
    const token = req.body.token;

    const [results, fields] = await pool.execute(q, [token]);
    console.log("get-serviceuserid",results);
    res.json(results);
})

app.post('/get-servieorder/', async (req, res) => {
    const q = "SELECT OrderID, OrderTime, DeliveryAddress, DateofService, Status FROM orders WHERE ServiceID = ?";
    console.log(req.body);
    const sid = req.body.serviceId;
    console.log("serviceid:",sid);
    const [results, fields] = await pool.execute(q, [sid]);
    console.log("results:",results);
    const orders = [];

    // Loop through the results and format them
    for (const row of results) {
        orders.push({
            orderid: row.OrderID,
            ordertime: row.OrderTime,
            add: row.DeliveryAddress,
            dos: row.DateofService,
            status: row.Status,
        });
    }
    res.json(orders);
    console.log("order:",orders);
})

//----------------------------------------------------- Authorization --------------------------------------------------

app.post('/get-authorization/', async (req, res) => {
    const q = "SELECT Authorization FROM users WHERE Token = ?"
    const token = req.body.token;

    const [results, fields] = await pool.execute(q, [token]);
    if(token != null){
        res.json({ results: results[0].Authorization });
    }
    
})

//----------------------------------------------------- Authorization --------------------------------------------------


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
    const line_items = req.body.cart.map(item => {
        return {
            price_data: {
                currency: 'sgd',
                product_data: {
                    name: item.title,
                    images: [item.image],
                    description: item.description
                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        };
    });
    //console.log("stripe inside post",stripe);
    console.log(line_items);
    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL}/checkout-success`,
        cancel_url: `${process.env.CLIENT_URL}/cart`,
    });


    res.send({ url: session.url })
});

