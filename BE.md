// package.json
{
    "name": "glogin",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "dependencies": {
        "cors": "^2.8.5",
        "dotenv": "^16.3.1",
        "ejs": "^3.1.9",
        "express": "^4.18.2",
        "express-session": "^1.17.3",
        "google-auth-library": "^9.11.0",
        "jsonwebtoken": "^9.0.2",
        "mysql2": "^3.6.1",
        "node-fetch": "^3.3.2",
        "passport": "^0.6.0",
        "passport-google-oauth20": "^2.0.0",
        "passport-jwt": "^4.0.1",
        "sequelize": "^6.33.0"
    },
    "scripts": {
        "start": "node server.js"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "type": "commonjs"
}

// server.js
require('dotenv').config();
const express = require('express');
const passport = require('passport');
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

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

app.use(passport.initialize());

const authenticateJwt = passport.authenticate('jwt', { session: false });

// --- Routes ---
// MODIFIED: Changed route prefix from '/auth' to '/api/auth'
app.use('/api/auth', authRoutes); 
app.use('/user', userRoutes);
app.use('/projects', projectRoutes);

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

// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/google', authController.handleGoogleTokenLogin);

router.get('/logout', authController.logout);

module.exports = router;

// routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const passport = require('passport');

// JWT authentication middleware
const authenticateJwt = passport.authenticate('jwt', { session: false });

// All routes require authentication
router.post('/save', authenticateJwt, projectController.saveProject);
router.get('/history', authenticateJwt, projectController.getUserProjects);
router.get('/:id', authenticateJwt, projectController.getProjectById);
router.delete('/:id', authenticateJwt, projectController.deleteProject);

module.exports = router;

// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const passport = require('passport'); // <-- Import passport

// This is our new "ensureAuthenticated"
const authenticateJwt = passport.authenticate('jwt', { session: false });

// Apply the middleware to the profile route
router.get('/profile', authenticateJwt, userController.getProfile);

module.exports = router;

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

// controllers/projectController.js
const ProjectHistory = require('../models/ProjectHistory');

exports.saveProject = async (req, res) => {
    try {
        const { projectName, projectType, prompt, files } = req.body;
        const userId = req.user.id;

        if (!projectName || !projectType || !prompt || !files) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const savedProject = await ProjectHistory.saveProject(
            userId,
            projectName,
            projectType,
            prompt,
            files
        );

        res.status(201).json({
            message: 'Project saved successfully',
            project: savedProject
        });
    } catch (err) {
        console.error('Save project error:', err);
        res.status(500).json({ error: 'Failed to save project' });
    }
};

exports.getUserProjects = async (req, res) => {
    try {
        const userId = req.user.id;
        const limit = parseInt(req.query.limit) || 50;
        const offset = parseInt(req.query.offset) || 0;

        const projects = await ProjectHistory.getUserProjects(userId, limit, offset);
        const totalCount = await ProjectHistory.getProjectCount(userId);

        res.status(200).json({
            projects,
            totalCount,
            limit,
            offset
        });
    } catch (err) {
        console.error('Get user projects error:', err);
        res.status(500).json({ error: 'Failed to retrieve projects' });
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const projectId = req.params.id;
        const userId = req.user.id;

        const project = await ProjectHistory.getProjectById(projectId, userId);

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.status(200).json({ project });
    } catch (err) {
        console.error('Get project by ID error:', err);
        res.status(500).json({ error: 'Failed to retrieve project' });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        const userId = req.user.id;

        const deleted = await ProjectHistory.deleteProject(projectId, userId);

        if (!deleted) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (err) {
        console.error('Delete project error:', err);
        res.status(500).json({ error: 'Failed to delete project' });
    }
};

// controllers/geminiController.js
const fetchModule = require('node-fetch');
const fetch = fetchModule.default || fetchModule;
const User = require('../models/User'); 

// NOTE: The API key is now loaded from environment variables
const API_KEY = process.env.GEMINI_API_KEY;

// Project configuration moved here
const promptConfig = {
    'react-native': {
        name: 'React Native',
        icon: '📱',
        structureExample: ["App.jsx", "package.json", "src/screens/HomeScreen.jsx"],
        structurePrompt: `List files for a React Native CLI project. Must include routing.`,
        contentRequirements: `- Use .jsx and functional components. - Implement React Navigation.`,
        packageJsonHint: `- Valid JSON with dependencies.`
    },
    'react-vite': {
        name: 'React + Vite + Tailwind',
        icon: '🖥️',
        structureExample: ["index.html", "package.json", "src/App.jsx"],
        structurePrompt: `List files for a React + Vite + Tailwind CSS project. Must include routing.`,
        contentRequirements: `- Use .jsx and functional components. - Implement React Router (v7+).`,
        packageJsonHint: `- Valid JSON with dependencies.`
    }
};

// Helper function to call the Gemini API
const callGemini = async (payload) => {
    if (!API_KEY) {
        throw new Error("Gemini API Key is missing. Check your .env file.");
    }

    const GEMINI_MODEL = 'gemini-2.5-flash';
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${API_KEY}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutes timeout

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Gemini API Error:', errorData);
            throw new Error(errorData.error?.message || `API returned status ${response.status}`);
        }

        const data = await response.json();

        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            if (data.promptFeedback?.blockReason) {
                throw new Error(`Content blocked by API: ${data.promptFeedback.blockReason}`);
            }
            throw new Error('Invalid response structure (no candidates or content)');
        }

        return data.candidates[0].content.parts[0].text;

    } catch (err) {
        clearTimeout(timeoutId);
        if (err.name === 'AbortError') {
            throw new Error('Gemini request timed out after 5 minutes.');
        }
        throw err;
    }
};

/**
 * Stage 1: File List Generation
 */
exports.generateStructure = async (req, res) => {
    const { prompt, projectType } = req.body;
    const userId = req.user.id; // <-- Get user ID from JWT middleware

    if (!prompt || !projectType) {
        return res.status(400).json({ error: 'Missing prompt or projectType' });
    }

    const config = promptConfig[projectType];
    if (!config) {
        return res.status(400).json({ error: 'Invalid projectType' });
    }

    try {
        // --- CREDIT CHECK & DEDUCTION ---
        // 1. Check for resets and get latest user data
        const user = await User.checkAndResetCredits(userId);
        if (user.credits <= 0) {
            return res.status(403).json({ error: 'You have no project generation credits remaining. Your credits will reset on the 1st of next month.' });
        }

        // 2. Deduct credit (this is a transaction)
        // We do this *before* the API call. This is the "cost" of starting a generation.
        await User.deductCredit(userId, prompt);
        // --- END CREDIT LOGIC ---

        const payload = {
            contents: [{
                parts: [{
                    text: `Based on: "${prompt}"\n\n${config.structurePrompt}\n\nRespond with ONLY a JSON array of file paths. Example:\n${JSON.stringify(config.structureExample)}`
                }]
            }]
        };

        const responseText = await callGemini(payload);
        const filePathsText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const filePaths = JSON.parse(filePathsText);

        if (!Array.isArray(filePaths) || filePaths.length === 0) {
            throw new Error('Could not determine project structure.');
        }

        res.json({ filePaths });

    } catch (err) {
        console.error('Stage 1 Error:', err);
        // Check for our specific credit error
        if (err.message.includes('No project generation credits')) {
            return res.status(403).json({ error: err.message });
        }
        res.status(500).json({ error: err.message || 'Failed to generate project structure.' });
    }
};

/**
 * Stage 2: File Content Generation
 */
exports.generateContent = async (req, res) => {
    const { prompt, projectType, filePath } = req.body;

    if (!prompt || !projectType || !filePath) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    const config = promptConfig[projectType];
    if (!config) {
        return res.status(400).json({ error: 'Invalid projectType' });
    }

    let content = '';
    let retries = 2;
    let lastError = null;

    while (retries > 0 && !content) {
        try {
            const payload = {
                contents: [{
                    parts: [{
                        text: `Generate ${filePath} for: "${prompt}"\n\nProject Type: ${config.name}\n\nRequirements:\n${config.contentRequirements}\n${filePath.includes('package.json') ? config.packageJsonHint : ''}\n- For ${filePath}, generate complete, runnable, production-ready code.\n\nONLY file content. No markdown, no backticks, no explanations.`
                    }]
                }]
            };

            let generatedText = await callGemini(payload);
            generatedText = generatedText.replace(/```[a-z]*\n?/g, '').replace(/```\n?/g, '').trim();

            if (generatedText.length < 10) {
                throw new Error('Generated content too short');
            }

            // Add Tailwind CSS directives if missing for index.css
            if (filePath === 'src/index.css' && !generatedText.includes('@tailwind')) {
                generatedText = `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n/* Custom styles below */\n${generatedText}`;
            }

            content = generatedText; // Success

        } catch (err) {
            lastError = err;
            retries--;
            if (retries > 0) {
                console.log(`Retrying ${filePath}... (${retries} attempts left)`);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }

    if (content) {
        res.json({ filePath, content });
    } else {
        console.error(`Failed to generate ${filePath} after all retries:`, lastError);
        res.status(500).json({
            error: `Failed to generate file: ${filePath}. ${lastError.message}`,
            filePath: filePath
        });
    }
};

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

// models/User.js
const { pool } = require('../config/db');
const TABLE_NAME = 'Users';

/**
 * NEW FUNCTION
 * Checks if credits need to be reset (monthly) and does so if needed.
 * Returns the latest user data (either old or newly reset).
 */
exports.checkAndResetCredits = async (userId) => {
    try {
        const [rows] = await pool.query(`SELECT * FROM ${TABLE_NAME} WHERE id = ?`, [userId]);
        if (!rows.length) {
            return null;
        }

        const user = rows[0];
        const today = new Date();
        const firstOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // If the last reset date is before the 1st of this month, reset credits
        if (new Date(user.creditsResetDate) < firstOfThisMonth) {
            console.log(`Resetting credits for user: ${userId}`);
            await pool.query(
                `UPDATE ${TABLE_NAME} SET credits = totalCredits, creditsUsedThisMonth = 0, creditsResetDate = CURRENT_TIMESTAMP WHERE id = ?`,
                [userId]
            );
            // Re-fetch the user to get the updated data
            const [updatedRows] = await pool.query(`SELECT * FROM ${TABLE_NAME} WHERE id = ?`, [userId]);
            return updatedRows[0];
        }

        return user; // No reset needed, return current user
    } catch (err) {
        console.error('DB_ERROR: checkAndResetCredits failed:', err);
        throw err;
    }
};

/**
 * NEW FUNCTION
 * Deducts one credit for a user in a database transaction.
 * Also logs the action to CreditHistory.
 */
exports.deductCredit = async (userId, description) => {
    const conn = await pool.getConnection();
    await conn.beginTransaction();

    try {
        // Get user and lock the row for update
        const [rows] = await conn.query(`SELECT * FROM ${TABLE_NAME} WHERE id = ? FOR UPDATE`, [userId]);
        const user = rows[0];

        if (user.credits <= 0) {
            throw new Error('You have no project generation credits remaining. Your credits will reset on the 1st of next month.');
        }

        const newCredits = user.credits - 1;

        // 1. Update User's credit count
        await conn.query(
            `UPDATE ${TABLE_NAME} SET credits = ?, creditsUsedThisMonth = creditsUsedThisMonth + 1 WHERE id = ?`,
            [newCredits, userId]
        );

        // 2. Log to CreditHistory
        await conn.query(
            `INSERT INTO CreditHistory (userId, creditsBefore, creditsAfter, creditsUsed, action, description) VALUES (?, ?, ?, 1, 'GENERATE', ?)`,
            [userId, user.credits, newCredits, description]
        );

        await conn.commit();
        return { success: true, newCredits: newCredits };

    } catch (err) {
        await conn.rollback();
        console.error('DB_ERROR: deductCredit transaction failed:', err);
        // Re-throw the specific error message
        if (err.message.includes('No project generation credits')) {
            throw err;
        }
        throw new Error('Failed to deduct credit.');
    } finally {
        conn.release();
    }
};


exports.findOrCreateGoogleUser = async (profile) => {
    const googleId = profile.id;
    const email = profile.emails[0]?.value;
    const displayName = profile.displayName;
    const image = profile.photos[0]?.value;

    try {
        // 1. Find User
        let [rows] = await pool.query(
            `SELECT * FROM ${TABLE_NAME} WHERE googleId = ?`,
            [googleId]
        );

        if (rows.length > 0) {
            // User found, check if their credits need reset before returning
            const updatedUser = await exports.checkAndResetCredits(rows[0].id);
            return updatedUser;
        }

        // 2. Create User
        // Added creditsResetDate to the insert
        const insertQuery = `
            INSERT INTO ${TABLE_NAME} (googleId, displayName, email, image, creditsResetDate)
            VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
        `;
        const [result] = await pool.query(insertQuery, [googleId, displayName, email, image]);

        // 3. Fetch and return the newly created user
        [rows] = await pool.query(
            `SELECT * FROM ${TABLE_NAME} WHERE id = ?`,
            [result.insertId]
        );
        return rows[0];

    } catch (err) {
        console.error('DB_ERROR: findOrCreateGoogleUser failed:', err);
        throw err;
    }
};

exports.findUserById = async (id) => {
    try {
        // We don't check/reset credits here, only on profile load or generation
        const [rows] = await pool.query(
            `SELECT * FROM ${TABLE_NAME} WHERE id = ?`,
            [id]
        );
        return rows[0];
    } catch (err) {
        console.error('DB_ERROR: findUserById failed:', err);
        return null;
    }
};

// models/ProjectHistory.js
const { pool } = require('../config/db');
const TABLE_NAME = 'ProjectHistory';

exports.saveProject = async (userId, projectName, projectType, prompt, files) => {
    try {
        const filesJson = JSON.stringify(files);
        const insertQuery = `
            INSERT INTO ${TABLE_NAME} (userId, projectName, projectType, prompt, files)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await pool.query(insertQuery, [userId, projectName, projectType, prompt, filesJson]);

        // Return the newly created project
        const [rows] = await pool.query(
            `SELECT * FROM ${TABLE_NAME} WHERE id = ?`,
            [result.insertId]
        );

        // Parse files back to object
        if (rows[0]) {
            rows[0].files = JSON.parse(rows[0].files);
        }

        return rows[0];
    } catch (err) {
        console.error('DB_ERROR: saveProject failed:', err);
        throw err;
    }
};

exports.getUserProjects = async (userId, limit = 50, offset = 0) => {
    try {
        const [rows] = await pool.query(
            `SELECT id, userId, projectName, projectType, prompt, createdAt, updatedAt 
             FROM ${TABLE_NAME} 
             WHERE userId = ? 
             ORDER BY createdAt DESC 
             LIMIT ? OFFSET ?`,
            [userId, limit, offset]
        );
        return rows;
    } catch (err) {
        console.error('DB_ERROR: getUserProjects failed:', err);
        throw err;
    }
};

exports.getProjectById = async (projectId, userId) => {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM ${TABLE_NAME} WHERE id = ? AND userId = ?`,
            [projectId, userId]
        );

        if (rows[0]) {
            rows[0].files = JSON.parse(rows[0].files);
        }

        return rows[0];
    } catch (err) {
        console.error('DB_ERROR: getProjectById failed:', err);
        throw err;
    }
};

exports.deleteProject = async (projectId, userId) => {
    try {
        const [result] = await pool.query(
            `DELETE FROM ${TABLE_NAME} WHERE id = ? AND userId = ?`,
            [projectId, userId]
        );
        return result.affectedRows > 0;
    } catch (err) {
        console.error('DB_ERROR: deleteProject failed:', err);
        throw err;
    }
};

exports.getProjectCount = async (userId) => {
    try {
        const [rows] = await pool.query(
            `SELECT COUNT(*) as count FROM ${TABLE_NAME} WHERE userId = ?`,
            [userId]
        );
        return rows[0].count;
    } catch (err) {
        console.error('DB_ERROR: getProjectCount failed:', err);
        return 0;
    }
};

// Database
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for credithistory
-- ----------------------------
DROP TABLE IF EXISTS `credithistory`;
CREATE TABLE `credithistory`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `creditsBefore` int NOT NULL,
  `creditsAfter` int NOT NULL,
  `creditsUsed` int NOT NULL,
  `action` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `projectId` int NULL DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `userId`(`userId` ASC) USING BTREE,
  CONSTRAINT `credithistory_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 53 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for projecthistory
-- ----------------------------
DROP TABLE IF EXISTS `projecthistory`;
CREATE TABLE `projecthistory`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `projectName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `projectType` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `prompt` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `files` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_userId`(`userId` ASC) USING BTREE,
  INDEX `idx_createdAt`(`createdAt` ASC) USING BTREE,
  CONSTRAINT `projecthistory_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `googleId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `displayName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `image` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `createdAt` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `credits` int NULL DEFAULT 5,
  `totalCredits` int NULL DEFAULT 5,
  `creditsResetDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `creditsUsedThisMonth` int NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `googleId`(`googleId` ASC) USING BTREE,
  UNIQUE INDEX `email`(`email` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;

