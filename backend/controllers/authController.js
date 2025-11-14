// controllers/authController.js
const passport = require('passport');
const jwt = require('jsonwebtoken'); // <-- Import JWT

exports.googleAuth = passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false // <-- We don't need sessions
});

// Change googleCallback to be a two-step process
exports.googleCallback = passport.authenticate('google', {
    failureRedirect: process.env.FRONTEND_URL,
    session: false // <-- We don't need sessions
});

// This runs *after* googleCallback successfully authenticates
exports.redirectSuccess = (req, res) => {
    // req.user is populated by the passport.js GoogleStrategy
    if (!req.user) {
        return res.redirect(process.env.FRONTEND_URL);
    }

    // --- Sign the JWT ---
    const payload = {
        id: req.user.id,
        email: req.user.email,
        displayName: req.user.displayName
    };

    // Use a new secret for JWTs
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1d' // Token expires in 1 day
    });

    // --- Redirect to frontend with the token in the URL ---
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
};

exports.logout = (req, res, next) => {
    // With JWT, logout is handled by the frontend (just delete the token)
    // But we can keep this route just in case
    res.status(200).json({ message: 'Logged out' });
};