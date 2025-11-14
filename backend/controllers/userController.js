// controllers/userController.js
const User = require('../models/User'); // <-- Import User model

exports.getProfile = async (req, res) => {
    try {
        // Run check/reset logic every time the user profile is fetched
        const updatedUser = await User.checkAndResetCredits(req.user.id);

        if (!updatedUser) {
            return res.status(404).json({ isLoggedIn: false });
        }

        // Return the latest user data, including credits
        res.status(200).json({
            isLoggedIn: true,
            user: {
                id: updatedUser.id,
                googleId: updatedUser.googleId,
                displayName: updatedUser.displayName,
                email: updatedUser.email,
                image: updatedUser.image,
                credits: updatedUser.credits, // <-- Send credits
                totalCredits: updatedUser.totalCredits // <-- Send total credits
            }
        });
    } catch (err) {
        console.error("Get profile error:", err);
        res.status(500).json({ isLoggedIn: false, error: "Failed to get profile" });
    }
};