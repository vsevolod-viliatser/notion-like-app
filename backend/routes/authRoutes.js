const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

router.post('/register', registerUser); // Register API
router.post('/login', loginUser); // Login API

module.exports = router;
