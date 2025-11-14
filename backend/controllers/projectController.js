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