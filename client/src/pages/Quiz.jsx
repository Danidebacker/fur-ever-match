import React, { useState, useEffect } from "react";
import { fetchQuizQuestions, submitQuiz } from "../apiService";
import { useNavigate } from "react-router-dom";

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
      console.log("Questions in Quiz Component:", fetchedQuestions);
      setQuestions(fetchedQuestions);
    };
    loadQuestions();
  }, []);

  const handleChange = (e, questionId) => {
    setFormData((prev) => {
      const updatedAnswers = prev.answers.filter(
        (a) => a.question_id !== questionId
      );
      updatedAnswers.push({
        question_id: questionId,
        answer_id: parseInt(e.target.value),
      });

      return { ...prev, answers: updatedAnswers };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await submitQuiz(formData);
      console.log("Response:", result);
      alert(result.message || "Quiz submitted!");

      if (result.userId) {
        navigate(`/matches/${result.userId}`);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
        <div key={question.id}>
          <p>{question.text}</p>
          {question.answers.map((answer) => (
            <label key={answer.id}>
              <input
                type="radio"
                name={`question-${question.id}`}
                value={answer.id}
                onChange={(e) => handleChange(e, question.id)}
                required
              />
              {answer.text}
            </label>
          ))}
        </div>
      ))}

      <button type="submit">Submit Quiz</button>
    </form>
  );
};

export default Quiz;
