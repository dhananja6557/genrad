require('dotenv').config();
const express = require('express');
const passport = require('passport');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
// MODIFIED: Import Claude controller
const claudeController = require('./controllers/claudeController');

const { pool } = require('./config/db');
require('./config/passport');
require('./config/passport-jwt');

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://ai.esolution.lk';

app.use(cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

app.use(passport.initialize());

const authenticateJwt = passport.authenticate('jwt', { session: false });

// --- Routes ---
app.use('/api/auth', authRoutes); 
app.use('/user', userRoutes);
app.use('/projects', projectRoutes);

// MODIFIED: Use claudeController methods
app.post('/stage1-generate-structure', authenticateJwt, claudeController.generateStructure);
app.post('/stage2-generate-content', authenticateJwt, claudeController.generateContent);

app.get('/', (req, res) => {
    res.send(`Server running. <a href="${FRONTEND_URL}">Go to Frontend</a>`);
});

const PORT = process.env.PORT || 2508;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Accepting requests from Frontend URL: ${FRONTEND_URL}`);
});