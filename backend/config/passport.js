// config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Serialization: Save user ID to session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialization: Retrieve user object from DB using ID from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findUserById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Google Strategy Configuration
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},
async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await User.findOrCreateGoogleUser(profile);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
}));