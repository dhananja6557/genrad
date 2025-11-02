// controllers/userController.js
exports.getProfile = (req, res) => {
    // req.user contains the user data retrieved from the database
    res.status(200).json({ 
        isLoggedIn: true,
        user: {
            id: req.user.id,
            googleId: req.user.googleId,
            displayName: req.user.displayName,
            email: req.user.email,
            image: req.user.image
        }
    });
};