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
    const countdownDuration = 300;

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
        else if (password.length != 8) {
            res.status(404).json({ message: "Password needs to be 8 number" })
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

// Initialize mistake count and user locked status
// let mistakeCount = 0;
// let isUserLocked = false;
// let mistakeCount = {};
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
async function updateUserInDatabase (email, mistakeCount, isLocked, lockoutTimestamp) {
    const updateQuery = `
            UPDATE users
            SET MistakeCount = ?,
                IsLocked = ?,
                LockoutTimestamp = ?
            WHERE Email = ?;
        `;

    const [results, fields] = await pool.execute(updateQuery, [mistakeCount, isLocked, lockoutTimestamp, email]);

    // Check results if needed
    console.log("User updated successfully:", results);
    return results;
}

// Function to set a timer to unlock the account after 30 minutes
function setLockoutTimer(email) {
    // Calculate unlock time (in 30 minutes)
    const unlockTime = new Date(Date.now() + 30 * 60 * 1000);

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



app.post('/signin/', async (req, res) => {

    const email = req.body.Email;

    const q = "SELECT * FROM users WHERE Email = ?";
    const [results, fields] = await pool.execute(q, [email]);
    
    if (await isUserLocked(email)){
        console.log("User Account is locked");
        return res.status(405).json({ message: "Account is locked. Please try again later."});
    }

    // If the account is locked, handle the lockout logic

    // if (email.IsLocked) {
    //     const lockoutDuration = new Date() - new Date(user.LockoutTimestamp);
    //     if (lockoutDuration < 30 * 60 * 1000) {
    //         return res.status(405).json({ message: 'Account is locked. Please try again later.' });
    //     } else {
    //         // The lockout period has passed. Reset the MistakeCount and unlock the account.
    //         updateUserInDatabase(email, {
    //             IsLocked: false,
    //             MistakeCount: 0,
    //         });
    //     }
    // }
    
    
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

        if (password === 'pw123123') {
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
                        // Successful login; reset login attempts for this email
                        resetLoginAttempts(email);
                }
                    else if (results.length > 0 && authorizationValue == 2) {
                        otp = generateOTP();
                        sendEmail(email, otp);
                        setOTPWithCountdown();
                        res.status(201).json({ message: 'Authentication Successful and AuthValue = 2', Email: email });
                        // Successful login; reset login attempts for this email
                        resetLoginAttempts(email);
                }
                    else if (results.length > 0 && authorizationValue == 3) {
                        otp = generateOTP();
                        setOTPWithCountdown();
                        console.log(otp);
                        sendEmail(email, otp);
                        res.status(202).json({ message: 'Authentication Successful and AuthValue = 3', Email: email });
                        // Successful login; reset login attempts for this email
                        resetLoginAttempts(email);
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

                // if (email.MistakeCount +1 >= 5) {
                //     updateUserInDatabase(email, { IsLocked: true, LockoutTimestamp: new Date() });
                //     return res.status(409).json({ message: 'Account is locked. Please try again later.' });
                // }

                // if (attempts >= 5) {
                //     setLockoutTimer(email); // Lock the account and set the timer
                //     isUserLocked = true;
                //     console.log(`Login attempts for ${email}: ${attempts}`);
                //     return res.status(406).json({ message: "Account is locked. Please try again later." });
                // }

                // mistakeCount++;
                // const currentAttempts = mistakeCount.get(email) || 0;
                // mistakeCount.set(email, currentAttempts +1 );
               
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

    // // Check if the user should be locked out
    // const { email } = req.body.Email;
    // if (mistakeCount[.get(email)] >= 5) {
    //     isUserLocked = true;
    //     return res.status(403).json({ message: 'Account is locked. Please try again later.' });
    // }

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

        if (eResults.length > 0) {
            res.status(400).json({ message: 'Email exist' })
        } else {
            const q = 'INSERT INTO users (FirstName, LastName, Email, Password, Authorization) VALUES (?)';
            const params = [req.body.FirstName, req.body.LastName, req.body.Email, req.body.Password, req.body.Authorization];
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



//----------------------------------------------------Users-------------------------------------------------------------


//----------------------------------------------------- Authorization --------------------------------------------------

app.post('/get-authorization/', async (req, res) => {
    const q = "SELECT Authorization FROM users WHERE Token = ?"
    const token = req.body.token;

    const [results, fields] = await pool.execute(q, [token]);
    res.json({ results: results[0].Authorization });
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
const Stripe = require('stripe')
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



