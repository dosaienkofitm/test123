import { useState, useEffect, useRef } from 'react'
import { modules } from '../data/courseData'

// ─── Дані тесту ────────────────────────────────────────────────────────────
const QUIZ_QUESTIONS = [
  {
    q: 'Для чого використовується Adobe Photoshop?',
    options: [
      'Для створення таблиць і баз даних',
      'Для редагування фотографій, створення дизайну та цифрового контенту',
      'Для написання програмного коду',
      'Для монтажу аудіофайлів',
    ],
    answer: 1,
  },
  {
    q: 'Яка гаряча клавіша використовується для інструмента Brush Tool?',
    options: ['V', 'E', 'B', 'G'],
    answer: 2,
  },
  {
    q: 'Яка робоча область Photoshop оптимізована для обробки фотографій?',
    options: ['Painting', 'Motion', 'Graphic and Web', 'Photography'],
    answer: 3,
  },
  {
    q: 'Яка комбінація клавіш показує весь документ у вікні?',
    options: ['Ctrl + 1', 'Ctrl + +', 'Ctrl + −', 'Ctrl + 0'],
    answer: 3,
  },
  {
    q: 'Для чого використовується Hand Tool?',
    options: [
      'Для малювання пензлем',
      'Для обрізки зображення',
      'Для переміщення по збільшеному документу',
      'Для створення тексту',
    ],
    answer: 2,
  },
]

const QUIZ_STORAGE_KEY = 'quiz_module1_result'

// ─── Компонент тесту ────────────────────────────────────────────────────────
function QuizSection({ onQuizDone, isDone }) {
  const [answers, setAnswers] = useState(Array(QUIZ_QUESTIONS.length).fill(null))
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem(QUIZ_STORAGE_KEY)
    if (saved) {
      try {
        const { answers: a, score: s } = JSON.parse(saved)
        setAnswers(a)
        setScore(s)
        setSubmitted(true)
      } catch {}
    }
  }, [])

  const handleSelect = (qi, ai) => {
    if (submitted) return
    setAnswers(prev => prev.map((v, i) => (i === qi ? ai : v)))
  }

  const handleSubmit = () => {
    const s = QUIZ_QUESTIONS.reduce(
      (acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0),
      0
    )
    setScore(s)
    setSubmitted(true)
    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify({ answers, score: s }))
    if (s === QUIZ_QUESTIONS.length) onQuizDone?.()
  }

  const handleReset = () => {
    setAnswers(Array(QUIZ_QUESTIONS.length).fill(null))
    setSubmitted(false)
    setScore(null)
    localStorage.removeItem(QUIZ_STORAGE_KEY)
  }

  const allAnswered = !answers.includes(null)

  return (
    <div className="quiz-section">
      <h2 className="quiz-title">Тест за модулем 1</h2>
      <p className="quiz-subtitle">Adobe Photoshop: інтерфейс та основні інструменти</p>

      {QUIZ_QUESTIONS.map((q, qi) => (
        <div key={qi} className="quiz-question">
          <p className="quiz-q-text">
            <span className="quiz-q-num">{qi + 1}.</span> {q.q}
          </p>
          <div className="quiz-options">
            {q.options.map((opt, ai) => {
              let cls = 'quiz-option'
              if (submitted) {
                if (ai === q.answer) cls += ' correct'
                else if (answers[qi] === ai) cls += ' wrong'
              } else if (answers[qi] === ai) {
                cls += ' selected'
              }
              return (
                <button
                  key={ai}
                  className={cls}
                  onClick={() => handleSelect(qi, ai)}
                  disabled={submitted}
                >
                  <span className="quiz-option-letter">
                    {String.fromCharCode(97 + ai)})
                  </span>
                  {opt}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {!submitted ? (
        <button
          className={`quiz-submit${allAnswered ? '' : ' disabled'}`}
          disabled={!allAnswered}
          onClick={handleSubmit}
        >
          Перевірити відповіді
        </button>
      ) : (
        <div className="quiz-result">
          <div className={`quiz-score ${score === QUIZ_QUESTIONS.length ? 'perfect' : score >= 3 ? 'good' : 'retry'}`}>
            {score === QUIZ_QUESTIONS.length
              ? '🎉 Відмінно!'
              : score >= 3
              ? '👍 Непогано!'
              : '📚 Варто повторити'}
            <span className="quiz-score-num">{score} / {QUIZ_QUESTIONS.length}</span>
          </div>
          <button className="quiz-reset" onClick={handleReset}>
            Спробувати ще раз
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Компонент зірочок ──────────────────────────────────────────────────────
function StarRating({ stars, max = 5 }) {
  return (
    <span className="star-rating">
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < stars ? 'star filled' : 'star empty'}>★</span>
      ))}
    </span>
  )
}

// ─── Основний компонент ─────────────────────────────────────────────────────
export default function LessonView({ id, progress, onMarkDone }) {
  const lesson = modules.flatMap(m => m.lessons || []).find(l => l.id === id)
  const isDone = progress[id] === true
  const isQuiz = id === 16

  // Таймер — лише для уроків з duration
  const totalSeconds = lesson?.duration ? lesson.duration * 60 : 0
  const [timeLeft, setTimeLeft] = useState(totalSeconds)
  const [canComplete, setCanComplete] = useState(isDone || !lesson?.duration)
  const timerRef = useRef(null)

  // Скидаємо таймер при зміні уроку
  useEffect(() => {
    if (!lesson?.duration) {
      setCanComplete(true)
      setTimeLeft(0)
      return
    }
    if (isDone) {
      setCanComplete(true)
      setTimeLeft(0)
      return
    }
    setTimeLeft(lesson.duration * 60)
    setCanComplete(false)
  }, [id])

  useEffect(() => {
    if (isDone || !lesson?.duration || timeLeft <= 0) return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          setCanComplete(true)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [id, isDone])

  const mins = Math.floor(timeLeft / 60)
  const secs = String(timeLeft % 60).padStart(2, '0')
  const timerLabel = timeLeft > 0 ? `~${mins}:${secs} хв` : `~${lesson?.duration ?? 0} хв`

  if (!lesson) {
    return (
      <>
        <div className="left">
          <div className="section-header">
            <div className="section-title">Урок не знайдено</div>
          </div>
        </div>
        <div className="right">
          <p>Урок з id {id} не існує.</p>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="left">
        <div className="section-header">
          <div className="section-title">{lesson.title}</div>
          {isDone && <div className="progress">Пройдено ✓</div>}
        </div>

        {/* Плашки складності та часу — тільки для звичайних уроків */}
        {!isQuiz && lesson.duration != null && (
          <div className="lesson-badges">
            <div className="badge badge-difficulty">
              Складність&nbsp;<StarRating stars={lesson.stars ?? 0} />
            </div>
            <div className={`badge badge-time ${timeLeft > 0 && !isDone ? 'badge-time--counting' : ''}`}>
              <span className="badge-time-icon">⏱</span>
              {isDone ? `~${lesson.duration} хв` : timerLabel}
            </div>
          </div>
        )}

        <div className="module">
          {isQuiz ? (
            <QuizSection
              isDone={isDone}
              onQuizDone={() => onMarkDone(id)}
            />
          ) : (
            <div
              className="lesson-content"
              dangerouslySetInnerHTML={{ __html: lesson.content }}
            />
          )}
        </div>

        {/* Кнопка завершення — не показуємо для тесту (він сам викликає onMarkDone) */}
        {!isQuiz && (
          <div className="lesson-actions">
            {!isDone ? (
              <div className="lesson-actions-wrap">
                <button
                  className={`btn-primary${canComplete ? '' : ' btn-disabled'}`}
                  disabled={!canComplete}
                  onClick={() => canComplete && onMarkDone(id)}
                  title={canComplete ? '' : 'Дочитайте урок до кінця'}
                >
                  Відмітити як виконане
                </button>
                {!canComplete && (
                  <span className="btn-hint">
                    {mins}:{secs} — кнопка активується після завершення таймера
                  </span>
                )}
              </div>
            ) : (
              <div className="lesson-done-badge">Урок виконано</div>
            )}
          </div>
        )}
      </div>

      <div className="right">
        <h3>Опис уроку</h3>
        <p>{lesson.title}</p>
        {!isQuiz && lesson.duration != null && (
          <div className="right-meta">
            <div className="right-meta-item">
              <span className="right-meta-label">Складність</span>
              <StarRating stars={lesson.stars ?? 0} />
            </div>
            <div className="right-meta-item">
              <span className="right-meta-label">Час</span>
              <span>~{lesson.duration} хв</span>
            </div>
          </div>
        )}
        <p style={{ marginTop: '1rem', opacity: 0.7, fontSize: '0.875rem' }}>
          {isDone
            ? 'Ви вже пройшли цей урок.'
            : 'Прочитайте матеріал і відмітьте урок як виконаний.'}
        </p>
      </div>
    </>
  )
}