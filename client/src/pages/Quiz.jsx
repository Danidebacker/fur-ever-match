import React, { useState, useEffect } from "react";
import { fetchQuizQuestions, submitQuiz } from "../apiService";
import { useNavigate } from "react-router-dom";
import "./Quiz.scss";

const Quiz = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    answers: [],
  });

  useEffect(() => {
    const loadQuestions = async () => {
      console.log("Loading quiz questions...");
      const fetchedQuestions = await fetchQuizQuestions();

      setQuestions(fetchedQuestions);
    };
    loadQuestions();
  }, []);

  const handleChange = (e, questionId, value) => {
    setFormData((prev) => {
      const updatedAnswers = prev.answers.filter(
        (a) => a.question_id !== questionId
      );
      updatedAnswers.push({
        question_id: questionId,
        answer_id: parseInt(e.target.value),
        value,
      });

      return { ...prev, answers: updatedAnswers };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.answers.length !== questions.length) {
      alert("Please answer all questions before submitting!!!!");
      return;
    }

    try {
      const result = await submitQuiz(formData);

      if (result && result.userId) {
        alert(
          `Quiz submitted successfully! Redirecting to matches for user ${result.userId}...`
        );
        navigate(`/matches/${result.userId}`);
      } else {
        alert("Quiz submitted but user ID is missing.");
        console.error("Backend response missing userId:", result);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <form className="quiz-form" onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Name"
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      {questions.map((question) => (
        <div key={question.id} className="question">
          <p>{question.text}</p>
          {question.answers.map((answer) => {
            return (
              <label key={answer.id}>
                <input
                  type="radio"
                  name={`-${question.id}`}
                  value={answer.id}
                  onChange={(e) => handleChange(e, question.id, answer.value)}
                  required
                />
                {answer.text}
              </label>
            );
          })}
        </div>
      ))}

      <button type="submit">Submit Quiz</button>
    </form>
  );
};

export default Quiz;
