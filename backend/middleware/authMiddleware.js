// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Проверка наличия заголовка Authorization и его формата
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Извлечение токена из заголовка
      token = req.headers.authorization.split(' ')[1];
      // Верификация токена
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Поиск пользователя по ID из токена
      req.user = await User.findById(decoded.id).select('-password');
      
      // Логирование для проверки
      console.log('Authenticated User:', req.user);
      
      next();
    } catch (err) {
      console.error('Error in authMiddleware:', err);
      res.status(401).json({ message: 'Not authorized, token invalid' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = protect;
