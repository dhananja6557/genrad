// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// REMOVED: Old Passport routes
// router.get('/google', authController.googleAuth);
// router.get('/google/callback', authController.googleCallback, authController.redirectSuccess);

// ADDED: New route for client-side token verification
router.post('/google', authController.handleGoogleTokenLogin);

router.get('/logout', authController.logout);

module.exports = router;