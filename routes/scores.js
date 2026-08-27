const express = require("express");
const router = express.Router();

const { pool } = require("../db");


// GET /api/scores/:userId
// Returns overall + per-exam progress for a user.
router.get("/:userId", async (req, res) => {

    try {

        const { userId } = req.params;

        const result = await pool.query(
            `SELECT
                exam,
                COUNT(*) AS total,
                SUM(CASE WHEN correct THEN 1 ELSE 0 END) AS correct
             FROM scores
             WHERE user_id = $1
             GROUP BY exam`,
            [userId]
        );

        const summary = result.rows.map(row => {
            const total = parseInt(row.total);
            const correct = parseInt(row.correct);
            return {
                exam: row.exam,
                total,
                correct,
                accuracy: total > 0 ? Math.round((correct / total) * 100) : 0
            };
        });

        res.json(summary);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch scores." });
    }

});


module.exports = router;
