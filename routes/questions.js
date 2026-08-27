const express = require("express");
const router = express.Router();

const { pool } = require("../db");


// GET /api/questions/:exam
// Returns practice questions for an exam WITHOUT the correct answer,
// so the frontend can't just read it out of the response.
router.get("/:exam", async (req, res) => {

    try {

        const exam = req.params.exam.toUpperCase();
        const limit = parseInt(req.query.limit) || 10;

        const result = await pool.query(
            `SELECT id, exam, subject, question, choices
             FROM questions
             WHERE exam = $1
             LIMIT $2`,
            [exam, limit]
        );

        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch questions." });
    }

});


// POST /api/questions/:id/answer
// Body: { userId, selectedAnswer }
// Grades the answer server-side, saves the result, and returns
// whether it was correct plus the explanation.
router.post("/:id/answer", async (req, res) => {

    try {

        const { userId, selectedAnswer } = req.body;
        const { id } = req.params;

        if (!userId || selectedAnswer === undefined) {
            return res.status(400).json({
                error: "userId and selectedAnswer are required."
            });
        }

        const questionResult = await pool.query(
            `SELECT * FROM questions WHERE id = $1`,
            [id]
        );

        const question = questionResult.rows[0];

        if (!question) {
            return res.status(404).json({ error: "Question not found." });
        }

        const correct = question.correct_answer === selectedAnswer;

        await pool.query(
            `INSERT INTO scores (user_id, exam, question_id, selected_answer, correct)
             VALUES ($1, $2, $3, $4, $5)`,
            [userId, question.exam, question.id, selectedAnswer, correct]
        );

        res.json({
            correct,
            correctAnswer: question.correct_answer,
            explanation: question.explanation
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to grade answer." });
    }

});


module.exports = router;
