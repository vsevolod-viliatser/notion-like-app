const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('Authorization Token:', token); // Логируем токен

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (err) {
      console.error('Authorization error:', err);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.error('No token provided');
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = protect;
