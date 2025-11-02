// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleCallback, authController.redirectSuccess);
router.get('/logout', authController.logout);

module.exports = router;