import { modules } from '../data/courseData'
import { calcTotalPercent, calcModulePercent } from '../utils/progress'

export default function ProgressView({ progress }) {
  const totalPercent = calcTotalPercent(modules, progress)
  const quizScores = progress.__quizScores || {}
  const QUIZ_TOTAL = 5

  return (
    <>
      <div className="left">
        <div className="section-header">
          <div className="section-title">Прогрес</div>
          <div className="progress">{totalPercent}%</div>
        </div>

        {modules.map((m, i) => {
          const lessons = m.lessons || []
          const percent = calcModulePercent(lessons, progress)
          const done = lessons.filter(l => progress[l.id]).length
          const total = lessons.length
          // Шукаємо тест в модулі
          const quizLesson = lessons.find(l => l.id === 16)
          const quizScore = quizLesson ? (quizScores[quizLesson.id] ?? null) : null

          return (
            <div className="module" key={i}>
              <div className="module-header">
                <span>{m.title}</span>
                <div className="module-info">
                  <span className="module-progress">{percent}%</span>
                  <span>{done}/{total}</span>
                  {quizScore !== null && (
                    <span className="module-quiz-score">
                      Тест: {quizScore}/{QUIZ_TOTAL}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="right">
        <h3>Інформація</h3>
        <p>Загальний прогрес курсу: <strong>{totalPercent}%</strong></p>
        {totalPercent === 100
          ? <p style={{ marginTop: '1rem', color: 'green' }}>Вітаємо! Ви пройшли весь курс.</p>
          : <p style={{ marginTop: '1rem', opacity: 0.7 }}>Продовжуйте навчання, щоб досягти 100%.</p>
        }
      </div>
    </>
  )
}