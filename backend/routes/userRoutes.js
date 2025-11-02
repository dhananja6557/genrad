// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Middleware to ensure user is logged in
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    // If not authenticated, send a 401 response (for the frontend hook)
    res.status(401).json({ message: 'Unauthorized' });
};

router.get('/profile', ensureAuthenticated, userController.getProfile);

module.exports = router;