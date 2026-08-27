require("dotenv").config();
const { pool, runMigrations } = require("./db");

const sampleQuestions = [

    // ===================== FE =====================
    {
        exam: "FE",
        subject: "Statics",
        question: "A force of 100 N acts at 30° above the horizontal. What is the horizontal component of the force?",
        choices: ["50 N", "86.6 N", "100 N", "115 N"],
        correctAnswer: 1,
        explanation: "Horizontal component = F cos(θ) = 100 × cos(30°) ≈ 86.6 N."
    },
    {
        exam: "FE",
        subject: "Fluid Mechanics",
        question: "Which dimensionless number characterizes the ratio of inertial to viscous forces in a fluid flow?",
        choices: ["Froude number", "Mach number", "Reynolds number", "Weber number"],
        correctAnswer: 2,
        explanation: "The Reynolds number (Re = ρVL/μ) is the ratio of inertial to viscous forces and determines laminar vs. turbulent flow."
    },
    {
        exam: "FE",
        subject: "Structural Analysis",
        question: "For a simply supported beam with a single point load at midspan, where does the maximum bending moment occur?",
        choices: ["At the supports", "At the point load (midspan)", "At the quarter points", "Bending moment is constant"],
        correctAnswer: 1,
        explanation: "For a simply supported beam with a central point load, maximum moment occurs directly under the load: M_max = PL/4."
    },
    {
        exam: "FE",
        subject: "Transportation",
        question: "What does 'Level of Service' (LOS) in traffic engineering primarily measure?",
        choices: ["Pavement roughness", "Quality of traffic flow experienced by drivers", "Number of traffic signals per mile", "Roadway lighting quality"],
        correctAnswer: 1,
        explanation: "LOS (A through F) is a qualitative measure describing traffic flow conditions and driver experience, based on factors like density and speed."
    },
    {
        exam: "FE",
        subject: "Geotechnical",
        question: "Which soil classification system is most commonly used in the US for engineering purposes?",
        choices: ["USDA system", "Unified Soil Classification System (USCS)", "AASHTO M 145 only", "Munsell system"],
        correctAnswer: 1,
        explanation: "USCS classifies soils based on grain size distribution and Atterberg limits, and is the standard system for geotechnical engineering in the US."
    },

    // ===================== PE =====================
    {
        exam: "PE",
        subject: "Structural",
        question: "Under LRFD, which load combination typically governs design for a roof beam with significant snow load?",
        choices: ["1.4D", "1.2D + 1.6L + 0.5S", "1.2D + 1.6S + 0.5L", "0.9D + 1.0W"],
        correctAnswer: 2,
        explanation: "ASCE 7 LRFD combination 1.2D + 1.6S + 0.5L governs when snow (S) is the principal variable load, common for roof members."
    },
    {
        exam: "PE",
        subject: "Water Resources",
        question: "Using Manning's equation, if roughness coefficient n increases while slope and geometry stay constant, what happens to flow velocity?",
        choices: ["Velocity increases", "Velocity decreases", "Velocity is unaffected", "Velocity becomes negative"],
        correctAnswer: 1,
        explanation: "Manning's equation V = (1.49/n) R^(2/3) S^(1/2) shows velocity is inversely proportional to n; a rougher channel slows flow."
    },
    {
        exam: "PE",
        subject: "Construction",
        question: "In Critical Path Method (CPM) scheduling, what does 'total float' represent for an activity?",
        choices: ["The activity's exact duration", "How long an activity can be delayed without delaying the project finish", "The cost overrun allowed for an activity", "The number of resources assigned to an activity"],
        correctAnswer: 1,
        explanation: "Total float is the amount of time an activity can slip without pushing back the overall project completion date."
    },
    {
        exam: "PE",
        subject: "Geotechnical",
        question: "In Terzaghi's bearing capacity equation, which term accounts for the contribution of soil cohesion?",
        choices: ["Nq term", "Nγ term", "Nc term", "Overburden pressure term alone"],
        correctAnswer: 2,
        explanation: "The Nc bearing capacity factor is multiplied by cohesion (c) to capture the strength contribution from a soil's cohesive properties."
    },
    {
        exam: "PE",
        subject: "Transportation",
        question: "In pavement design, ESALs (Equivalent Single Axle Loads) are used primarily to represent what?",
        choices: ["The weight of the pavement structure itself", "Cumulative traffic loading converted to an equivalent standard axle load", "The number of lanes on a roadway", "Speed limit design criteria"],
        correctAnswer: 1,
        explanation: "ESALs convert mixed traffic (cars, trucks, buses) into an equivalent number of standard 18-kip single-axle loads for pavement design."
    },

    // ===================== GRE =====================
    {
        exam: "GRE",
        subject: "Arithmetic",
        question: "A shirt originally priced at $80 is discounted by 25%, then that price is discounted by another 10%. What is the final price?",
        choices: ["$52.00", "$54.00", "$56.00", "$60.00"],
        correctAnswer: 1,
        explanation: "$80 × 0.75 = $60; $60 × 0.90 = $54.00. Successive percent discounts multiply, they don't simply add."
    },
    {
        exam: "GRE",
        subject: "Algebra",
        question: "If 3x − 7 = 2x + 5, what is the value of x?",
        choices: ["x = 2", "x = 5", "x = 12", "x = -2"],
        correctAnswer: 2,
        explanation: "3x − 7 = 2x + 5 → 3x − 2x = 5 + 7 → x = 12."
    },
    {
        exam: "GRE",
        subject: "Geometry",
        question: "A rectangle has a perimeter of 36 and a length that is twice its width. What is the rectangle's area?",
        choices: ["36", "54", "72", "108"],
        correctAnswer: 2,
        explanation: "2(L + W) = 36 and L = 2W, so 2(2W + W) = 36 → 6W = 36 → W = 6, L = 12. Area = 6 × 12 = 72."
    },
    {
        exam: "GRE",
        subject: "Data Interpretation",
        question: "A data set has a mean of 20 across 5 values. If a 6th value of 32 is added, what is the new mean?",
        choices: ["20", "21", "22", "24"],
        correctAnswer: 2,
        explanation: "Original sum = 20 × 5 = 100. New sum = 100 + 32 = 132. New mean = 132 / 6 = 22."
    },
    {
        exam: "GRE",
        subject: "Word Problems",
        question: "Two pumps fill a tank in 6 hours together. Pump A alone takes 10 hours. How long does Pump B alone take?",
        choices: ["4 hours", "12 hours", "15 hours", "16 hours"],
        correctAnswer: 2,
        explanation: "1/6 = 1/10 + 1/B → 1/B = 1/6 − 1/10 = 5/30 − 3/30 = 2/30 = 1/15 → B = 15 hours."
    }

];

async function seed() {

    try {

        await runMigrations();

        const exams = ["FE", "PE", "GRE"];

        for (const exam of exams) {
            await pool.query(`DELETE FROM scores WHERE exam = $1`, [exam]);
            await pool.query(`DELETE FROM questions WHERE exam = $1`, [exam]);
        }

        for (const q of sampleQuestions) {
            await pool.query(
                `INSERT INTO questions (exam, subject, question, choices, correct_answer, explanation)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [q.exam, q.subject, q.question, q.choices, q.correctAnswer, q.explanation]
            );
        }

        console.log(`Seeded ${sampleQuestions.length} questions across FE, PE, and GRE.`);

        await pool.end();
        process.exit(0);

    } catch (err) {
        console.error("Seed error:", err);
        process.exit(1);
    }

}

seed();
