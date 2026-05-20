import { useState, useEffect } from "react";

const QUESTIONS = [
  {
    q: "Для чого використовується Adobe Photoshop?",
    options: [
      "Для створення таблиць і баз даних",
      "Для редагування фотографій, створення дизайну та цифрового контенту",
      "Для написання програмного коду",
      "Для монтажу аудіофайлів",
    ],
    answer: 1,
  },
  {
    q: "Яка гаряча клавіша використовується для інструмента Brush Tool?",
    options: ["V", "E", "B", "G"],
    answer: 2,
  },
  {
    q: "Яка робоча область Photoshop оптимізована для обробки фотографій?",
    options: ["Painting", "Motion", "Graphic and Web", "Photography"],
    answer: 3,
  },
  {
    q: "Яка комбінація клавіш показує весь документ у вікні?",
    options: ["Ctrl + 1", "Ctrl + +", "Ctrl + -", "Ctrl + 0"],
    answer: 3,
  },
  {
    q: "Для чого використовується Hand Tool?",
    options: [
      "Для малювання пензлем",
      "Для обрізки зображення",
      "Для переміщення по збільшеному документу",
      "Для створення тексту",
    ],
    answer: 2,
  },
];

const STORAGE_KEY = "quiz_photoshop_result";

export default function QuizSection() {
  const [answers, setAnswers] = useState(Array(5).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const { answers: a, score: s } = JSON.parse(saved);
      setAnswers(a);
      setScore(s);
      setSubmitted(true);
    }
  }, []);

  const handleSelect = (qi, ai) => {
    if (submitted) return;
    setAnswers(prev => prev.map((v, i) => (i === qi ? ai : v)));
  };

  const handleSubmit = () => {
    const s = QUESTIONS.reduce(
      (acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0), 0
    );
    setScore(s);
    setSubmitted(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, score: s }));
  };

  const handleReset = () => {
    setAnswers(Array(5).fill(null));
    setSubmitted(false);
    setScore(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="quiz-section">
      <h2 className="quiz-title">Тест до модуля</h2>
      {QUESTIONS.map((q, qi) => (
        <div key={qi} className="quiz-question">
          <p className="quiz-q-text">{qi + 1}. {q.q}</p>
          <div className="quiz-options">
            {q.options.map((opt, ai) => {
              let cls = "quiz-option";
              if (submitted) {
                if (ai === q.answer) cls += " correct";
                else if (answers[qi] === ai) cls += " wrong";
              } else if (answers[qi] === ai) {
                cls += " selected";
              }
              return (
                <button key={ai} className={cls} onClick={() => handleSelect(qi, ai)}>
                  {String.fromCharCode(97 + ai)}) {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {!submitted ? (
        <button
          className="quiz-submit"
          disabled={answers.includes(null)}
          onClick={handleSubmit}
        >
          Перевірити відповіді
        </button>
      ) : (
        <div className="quiz-result">
          <p>Результат: <strong>{score} / {QUESTIONS.length}</strong></p>
          <button className="quiz-reset" onClick={handleReset}>Спробувати ще раз</button>
        </div>
      )}
    </div>
  );
}