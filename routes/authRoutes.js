const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const isAuthenticated = require('../middleware/sessionMiddleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', isAuthenticated, authController.logout);

// Protected routes
router.get('/user-info', isAuthenticated, authController.getCurrentUser);

module.exports = router;