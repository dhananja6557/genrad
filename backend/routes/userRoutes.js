// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const passport = require('passport'); // <-- Import passport

// This is our new "ensureAuthenticated"
const authenticateJwt = passport.authenticate('jwt', { session: false });

// Apply the middleware to the profile route
router.get('/profile', authenticateJwt, userController.getProfile);

module.exports = router;