// controllers/authController.js
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library'); // <-- NEW: Import
const User = require('../models/User'); // <-- NEW: Import User model

// NEW: Create an OAuth2 client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * NEW FUNCTION
 * Replaces the old Passport redirect flow.
 * Verifies a Google ID token from the frontend, finds/creates a user,
 * and returns a JWT token.
 */
exports.handleGoogleTokenLogin = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ error: 'No token provided' });
    }

    try {
        // 1. Verify the Google ID token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        if (!payload.email_verified) {
            return res.status(401).json({ error: 'Google email not verified' });
        }

        // 2. Adapt payload to match Passport's profile structure
        const profile = {
            id: payload.sub, // This is the Google ID
            displayName: payload.name,
            emails: [{ value: payload.email }],
            photos: [{ value: payload.picture }],
        };

        // 3. Find or create the user (this existing function also handles credit resets)
        const user = await User.findOrCreateGoogleUser(profile);

        if (!user) {
            return res.status(500).json({ error: 'Failed to find or create user' });
        }

        // 4. Sign our own JWT
        const jwtPayload = {
            id: user.id,
            email: user.email,
            displayName: user.displayName
        };

        const jwtToken = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
            expiresIn: '1d' // Token expires in 1 day
        });

        // 5. Send the JWT back to the frontend
        res.json({ token: jwtToken });

    } catch (err) {
        console.error('Google token login error:', err);
        res.status(401).json({ error: 'Invalid token or login failed' });
    }
};


// REMOVED: googleAuth, googleCallback, and redirectSuccess are no longer needed
// for this client-side flow.

// This is still fine, though the frontend just deletes the token
exports.logout = (req, res, next) => {
    res.status(200).json({ message: 'Logged out' });
};