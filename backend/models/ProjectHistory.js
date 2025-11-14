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