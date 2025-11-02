require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const geminiController = require('./controllers/geminiController');

const { pool } = require('./config/db'); // Import DB connection
require('./config/passport'); // Configure Passport strategies

const app = express();

// --- CORS Configuration (CRITICAL for cross-port communication) ---
const FRONTEND_URL = process.env.FRONTEND_URL;

app.use(cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST'],
}));
// --- End CORS Config ---

// --- Express/Passport Middleware ---
// 🔥 CRITICAL FIX: Add middleware to parse JSON request bodies
app.use(express.json()); 

// Middleware to parse URL-encoded form data (less critical for API calls, but good practice)
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// --- Routes ---
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
// These two routes rely on the express.json() middleware above
app.post('/stage1-generate-structure', geminiController.generateStructure);
app.post('/stage2-generate-content', geminiController.generateContent);

app.get('/', (req, res) => {
    res.send(`Server running. <a href="${process.env.FRONTEND_URL}">Go to Frontend</a>`);
});

// --- Server Start ---
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
    console.log(`Frontend URL set to ${FRONTEND_URL}`);
});