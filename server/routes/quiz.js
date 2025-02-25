const express = require("express");
const pool = require("../config/db");

require("dotenv").config();

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: "Invalid answers format" });
    }

    let userId;

    const [existingUser] = await pool.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length === 0) {
      const [insertUser] = await pool.execute(
        "INSERT INTO Users (name, email) VALUES (?, ?)",
        [name, email]
      );
      userId = insertUser.insertId;
    } else {
      userId = existingUser[0].id;
    }

    if (!userId) {
      console.error("Error: userId is undefined!");
      return res.status(500).json({ error: "Failed to retrieve userId" });
    }

    const questionMapping = {
      1: "size",
      2: "energy_level",
      3: "grooming_needs",
      4: "shedding",
      5: "recommended_energy_level",
      6: "recommended_size",
      7: "good_with_dogs",
      8: "good_with_cats",
      9: "good_with_kids",
      10: "training_needs",
    };

    const result = answers.reduce((acc, answer) => {
      const key = questionMapping[answer.question_id];
      if (key) {
        acc[key] = answer.value;
      }
      return acc;
    }, {});

    const {
      energy_level,
      recommended_energy_level,
      size,
      recommended_size,
      grooming_needs,
      good_with_kids,
      good_with_dogs,
      good_with_cats,
      training_needs,
      shedding,
    } = result;

    await pool.execute(
      `INSERT INTO quizresponses 
       (user_id, energy_level, recommended_energy_level, size, recommended_size, grooming_needs, good_with_kids, good_with_dogs, good_with_cats, training_needs, shedding) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        energy_level ?? null,
        recommended_energy_level ?? null,
        size ?? null,
        recommended_size ?? null,
        grooming_needs ?? null,
        good_with_kids ? 1 : 0,
        good_with_dogs ? 1 : 0,
        good_with_cats ? 1 : 0,
        training_needs ? 1 : 0,
        shedding ?? null,
      ]
    );

    res.status(201).json({ message: "Quiz submitted successfully!", userId });
  } catch (error) {
    console.error("Error saving quiz response:", error);
    res.status(500).json({ error: "Failed to save quiz response" });
  }
});

router.get("/questions", async (req, res) => {
  try {
    const [questions] = await pool.execute("SELECT * FROM questions");

    const questionsWithAnswers = [];
    for (const question of questions) {
      const [answers] = await pool.execute(
        "SELECT id, text, value FROM answers WHERE question_id = ?",
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

    const [quizResponse] = await pool.execute(
      `SELECT * FROM quizresponses
        WHERE user_id = ?
      ORDER BY submitted_at DESC
      LIMIT 1`,
      [userId]
    );

    if (quizResponse.length === 0) {
      return res
        .status(404)
        .json({ error: "No quiz response found for this user" });
    }

    quizResponse.map(async (quiz) => {
      const query = `
        SELECT * FROM pets
        WHERE size = ?
        OR training_needs = ?
        AND good_with_kids = ? 
        AND good_with_dogs = ?
        AND good_with_cats = ?
      `;

      const [matchingPets] = await pool.execute(query, [
        quiz.size,
        quiz.training_needs,
        quiz.good_with_kids,
        quiz.good_with_dogs,
        quiz.good_with_cats,
      ]);

      if (matchingPets.length === 0) {
        return res.json({
          message: "No perfect matches found, but keep looking!",
        });
      } else {
        res.json(matchingPets);
      }
    });
  } catch (error) {
    console.error("Error matching quiz responses to pets:", error);
    res.status(500).json({ error: "Failed to fetch pet matches" });
  }
});

module.exports = router;
