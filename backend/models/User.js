// models/User.js
const { pool } = require('../config/db');
const TABLE_NAME = 'Users';

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
            return rows[0]; // User found
        }

        // 2. Create User
        const insertQuery = `
            INSERT INTO ${TABLE_NAME} (googleId, displayName, email, image)
            VALUES (?, ?, ?, ?)
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