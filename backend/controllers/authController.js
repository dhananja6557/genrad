// controllers/authController.js
const passport = require('passport');

exports.googleAuth = passport.authenticate('google', {
    scope: ['profile', 'email'] 
});

exports.googleCallback = passport.authenticate('google', {
    failureRedirect: process.env.FRONTEND_URL 
});

exports.redirectSuccess = (req, res) => {
    // Redirect to the React frontend's profile page on success
    res.redirect(`${process.env.FRONTEND_URL}/generator`); 
};

exports.logout = (req, res, next) => {
    req.logout((err) => { 
        if (err) { return next(err); }
        // Redirect back to the React app's login page
        res.redirect(process.env.FRONTEND_URL); 
    });
};