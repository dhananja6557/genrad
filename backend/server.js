// server.js
require('dotenv').config();
const express = require('express');
const passport = require('passport'); // <-- Make sure passport is imported
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const geminiController = require('./controllers/geminiController');

const { pool } = require('./config/db');
require('./config/passport');
require('./config/passport-jwt');

const app = express();

const FRONTEND_URL = 'https://ai.esolution.lk';

app.use(cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
}));
// --- End CORS Config ---

// Increase JSON limit for large project files
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// --- Passport Middleware ---
app.use(passport.initialize());

// --- JWT Authentication Middleware ---
// This will be used to protect your generation routes
const authenticateJwt = passport.authenticate('jwt', { session: false });

// --- Routes ---
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/projects', projectRoutes);

// Apply JWT authentication to the generation routes
app.post('/stage1-generate-structure', authenticateJwt, geminiController.generateStructure);
app.post('/stage2-generate-content', authenticateJwt, geminiController.generateContent);

app.get('/', (req, res) => {
    res.send(`Server running. <a href="${FRONTEND_URL}">Go to Frontend</a>`);
});

const PORT = process.env.PORT || 2508;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Accepting requests from Frontend URL: ${FRONTEND_URL}`);
});