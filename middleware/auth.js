require('dotenv').config();
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if token is available
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied!' });
  }
  // Verify token
  // @Note: jwt token has _id=user.id in token, test it at www.jwt.to
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid!' });
  }
};

module.exports = auth;
