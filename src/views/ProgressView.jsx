import { modules } from '../data/courseData'
import { calcTotalPercent, calcModulePercent } from '../utils/progress'

export default function ProgressView({ progress }) {
  const totalPercent = calcTotalPercent(modules, progress)

  return (
    <>
      <div className="left">
        <div className="section-header">
          <div className="section-title">Прогрес</div>
          <div className="progress">{totalPercent}%</div>
        </div>

        {modules.map((m, i) => {
          const percent = calcModulePercent(m.lessons, progress)
          const done = (m.lessons || []).filter(l => progress[l.id]).length
          const total = (m.lessons || []).length
          return (
            <div className="module" key={i}>
              <div className="module-header">
                <span>{m.title}</span>
                <div className="module-info">
                  <span className="module-progress">{percent}%</span>
                  <span>{done}/{total}</span>
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
          ? <p style={{ marginTop: '1rem', color: 'green' }}>🎉 Вітаємо! Ви пройшли весь курс.</p>
          : <p style={{ marginTop: '1rem', opacity: 0.7 }}>Продовжуйте навчання, щоб досягти 100%.</p>
        }
      </div>
    </>
  )
}