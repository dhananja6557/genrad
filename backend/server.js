// server.js
require('dotenv').config();
const express = require('express');
const passport = require('passport');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const geminiController = require('./controllers/geminiController');

const { pool } = require('./config/db');
require('./config/passport');
require('./config/passport-jwt');

const app = express();

const FRONTEND_URL = 'https://ai.esolution.lk';

app.use(cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'], 
}));
// --- End CORS Config ---

// --- Express/Passport Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

// --- Routes ---
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.post('/stage1-generate-structure', geminiController.generateStructure);
app.post('/stage2-generate-content', geminiController.generateContent);

app.get('/', (req, res) => {
    res.send(`Server running. <a href="${FRONTEND_URL}">Go to Frontend</a>`);
});

const PORT = process.env.PORT || 2508;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Accepting requests from Frontend URL: ${FRONTEND_URL}`);
});