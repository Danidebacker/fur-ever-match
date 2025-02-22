const express = require("express");
const pool = require("../config/db");

require("dotenv").config();

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, answers } = req.body;
    console.log("Received quiz submission:", req.body);
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: "Invalid answers format" });
    }

    let userId;

    const [existingUser] = await pool.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length === 0) {
      console.log("New user detected, inserting into database...");
      const [insertUser] = await pool.execute(
        "INSERT INTO Users (name, email) VALUES (?, ?)",
        [name, email]
      );
      userId = insertUser.insertId;
      console.log("New user ID assigned:", userId);
    } else {
      userId = existingUser[0].id;
      console.log("Existing user found with ID:", userId);
    }

    if (!userId) {
      console.error("Error: userId is undefined!");
      return res.status(500).json({ error: "Failed to retrieve userId" });
    }

    for (const answer of answers) {
      await pool.execute(
        "INSERT INTO quizresponses (user_id, question_id, answer_id) VALUES (?, ?, ?)",
        [userId, answer.question_id, answer.answer_id]
      );
    }

    console.log("Quiz responses stored successfully for user:", userId);

    const responseData = { message: "Quiz submitted successfully!", userId };
    console.log(" Sending response to frontend:", responseData);
    res.status(201).json(responseData);
  } catch (error) {
    console.error("Error saving quiz response:", error);
    res.status(500).json({ error: "Failed to save quiz response" });
  }
});

router.get("/user", async (req, res) => {
  const { email } = req.query;
  try {
    const [user] = await pool.execute("SELECT id FROM Users WHERE email = ?", [
      email,
    ]);

    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ id: user[0].id });
  } catch (error) {
    console.error("Error fetching user ID:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/questions", async (req, res) => {
  try {
    const [questions] = await pool.execute("SELECT * FROM questions");

    const questionsWithAnswers = [];
    for (const question of questions) {
      const [answers] = await pool.execute(
        "SELECT id, text FROM answers WHERE question_id = ?",
        [question.id]
      );

      questionsWithAnswers.push({
        id: question.id,
        text: question.text,
        category: question.category,
        answers,
      });
    }

    res.json(questionsWithAnswers);
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    res.status(500).json({ error: "Failed to fetch quiz questions" });
  }
});

router.get("/match/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`Fetching matches for user ID: ${userId}`);

    const [quizResponse] = await pool.execute(
      `SELECT q.question_id, a.energy_level, a.size, a.temperament, a.grooming_needs
       FROM quizresponses q
       JOIN answers a ON q.answer_id = a.id
       WHERE q.user_id = ?
       ORDER BY q.submitted_at DESC`,
      [userId]
    );

    if (quizResponse.length === 0) {
      console.error(" No quiz response found for this user");
      return res
        .status(404)
        .json({ error: "No quiz response found for this user" });
    }

    const energyLevels = quizResponse.map((q) => q.energy_level);
    const sizes = quizResponse.map((q) => q.size);
    const temperaments = quizResponse.map((q) => q.temperament);
    const groomingNeeds = quizResponse.map((q) => q.grooming_needs);

    console.log("Matching criteria:", {
      energyLevels,
      sizes,
      temperaments,
      groomingNeeds,
    });

    const [matchingPets] = await pool.execute(
      `SELECT * FROM pets 
        WHERE (energy_level IN (?) OR energy_level LIKE ?) 
        AND (size IN (?) OR size LIKE ?) 
        AND (temperament IN (?) OR temperament LIKE ?) 
        AND (grooming_needs IN (?) OR grooming_needs LIKE ?)`,
      [
        energyLevels,
        `%${energyLevels}%`,
        sizes,
        `%${sizes}%`,
        temperaments,
        `%${temperaments}%`,
        groomingNeeds,
        `%${groomingNeeds}%`,
      ]
    );

    console.log("Matching pets found:", matchingPets.length);

    if (matchingPets.length === 0) {
      return res.json({
        message: "No perfect matches found, but keep looking!",
      });
    }

    res.json(matchingPets);
  } catch (error) {
    console.error("Error matching quiz responses to pets:", error);
    res.status(500).json({ error: "Failed to fetch pet matches" });
  }
});

module.exports = router;
