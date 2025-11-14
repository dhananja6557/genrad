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