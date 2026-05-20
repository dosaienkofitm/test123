const QUIZ_IDS = [16] // id уроків-тестів

export default function LessonButton({ lesson, setView, progress }) {
  const isDone = lesson.done
  const isQuiz = QUIZ_IDS.includes(lesson.id)
  const quizScores = progress?.__quizScores || {}
  const quizScore = quizScores[lesson.id]
  const quizTotal = 5

  let statusLabel
  if (isQuiz && quizScore !== undefined && quizScore !== null) {
    statusLabel = `${quizScore}/${quizTotal}`
  } else if (isDone) {
    statusLabel = 'Пройдено'
  } else {
    statusLabel = 'Не пройдено'
  }

  return (
    <button
      className={`lesson-btn ${isDone ? 'done' : 'pending'}`}
      onClick={() => setView({ type: 'lesson', id: lesson.id })}
    >
      <span className="lesson-title">{lesson.title}</span>
      <span className={`lesson-status${isQuiz && quizScore !== undefined && quizScore !== null ? ' lesson-status--score' : ''}`}>
        {statusLabel}
      </span>
    </button>
  )
}