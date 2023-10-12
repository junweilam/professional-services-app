const jwt = require('jsonwebtoken');

// Secret key to sign the JWT tokens
const secretKey = 'your_secret_key'; // Replace this with a secret key of your choice

function generateToken(user) {
    const payload = {
        userId: user.id,
        username: user.username,
        // Add more user data to the payload if needed
    };

    // Sign the token
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' }); // Token expires in 1 hour

    return token;
}

function verifyToken(req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token.' });
        }

        req.user = user;
        next();
    });
}

module.exports = {
    generateToken,
    verifyToken,
};