require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { runMigrations } = require("./db");
const questionsRouter = require("./routes/questions");
const scoresRouter = require("./routes/scores");
const vocabularyRouter = require("./routes/vocabulary");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/questions", questionsRouter);
app.use("/api/scores", scoresRouter);
app.use("/api/vocabulary", vocabularyRouter);

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

runMigrations()
    .then(() => {
        console.log("Database ready (tables created if they didn't exist).");
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error("Database connection/migration error:", err);
        process.exit(1);
    });