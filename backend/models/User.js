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