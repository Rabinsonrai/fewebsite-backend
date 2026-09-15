const express = require("express");
const router = express.Router();

// NOTE: this assumes db.js exports `pool` (a pg Pool instance), matching
// the most common setup. If your db.js exports something else (e.g. a
// custom `query()` helper), adjust the import and the call below —
// paste db.js and I'll match it exactly.
const { pool } = require("../db");

// GET /api/vocabulary?limit=50
// Returns a random set of vocabulary words for flashcard practice.
router.get("/", async (req, res) => {

    const limit = parseInt(req.query.limit, 10) || 50;

    try {

        const result = await pool.query(
            `SELECT id, word, meaning, example_sentence
             FROM vocabulary
             ORDER BY RANDOM()
             LIMIT $1`,
            [limit]
        );

        res.json(result.rows);

    } catch (err) {

        console.error("Error fetching vocabulary:", err);
        res.status(500).json({ error: "Failed to fetch vocabulary" });

    }

});

module.exports = router;
