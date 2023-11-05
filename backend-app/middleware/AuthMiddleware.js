require('dotenv').config();
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;

const verifyToken = (req, res, next) => {
  const token = req.header('access-token');

  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No Token Provided' });
  }

  try {
    jwt.verify(token, secretKey, (err, decoded) => {
      if(err){
        console.log(err)
        res.status(400).json("Not Authenticated")
      }else{
        req.userId = decoded.id
        res.status(200).json("authed")
        next();
      }
    }); // Verify the token using your secret key
    next(); // Move to the next middleware or route handler
  } catch (error) {
    return res.status(403).json({ message: 'Invalid Token' });
  }
};

module.exports = verifyToken;