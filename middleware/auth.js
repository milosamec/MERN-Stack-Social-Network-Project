const jwt = require('jsonwebtoken');
const config = require('config');

// We're exporting the middleware func that has req, res,next
module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    // return unauthorized status
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // If there is token but not valid - send status 401
  // it it is valid - Verify token
  // Set req.user to the user that's in that decoded token
  // Then we can use that user in any protected routes and get their profile
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    // Set req.user to the user
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
