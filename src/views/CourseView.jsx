import { useState } from 'react'
import Module from '../components/Module'
import { modules } from '../data/courseData'
import { calcTotalPercent } from '../utils/progress'

export default function CourseView({ setView, progress }) {
  const [expandedAll, setExpandedAll] = useState(false)

  const totalPercent = calcTotalPercent(modules, progress)

  // Знаходимо перший непройдений урок
  const allLessons = modules.flatMap(m => m.lessons || [])
  const nextLesson = allLessons.find(l => !progress[l.id])

  const toggleAll = () => setExpandedAll(prev => !prev)

  return (
    <div className="container main">
      <div className="title">Основи Adobe Photoshop</div>

      <div className="card">
        <div className="left">
          <div className="section-header">
            <div className="section-title">
              Почніть з того місця, на якому зупинилися
            </div>
            <div className="progress">{totalPercent}%</div>
          </div>

          <div className="actions">
            <button
              className="btn-primary"
              onClick={() => nextLesson && setView({ type: 'lesson', id: nextLesson.id })}
              disabled={!nextLesson}
            >
              {nextLesson ? 'Продовжити курс' : 'Курс завершено ✓'}
            </button>

            <button className="btn-secondary" onClick={toggleAll}>
              {expandedAll ? 'Згорнути всі' : 'Розгорнути всі'}
            </button>
          </div>

          {modules.map((m, moduleIndex) => (
            <Module
              key={moduleIndex}
              {...m}
              moduleIndex={moduleIndex}
              setView={setView}
              expandedAll={expandedAll}
              progress={progress}
            />
          ))}
        </div>

        <div className="right">
          <h3>Загальна інформація про курс</h3>
          <p>
            Курс допоможе освоїти Photoshop з нуля: від базових інструментів
            до створення повноцінних дизайнерських робіт.
          </p>
          <p style={{ marginTop: '1rem' }}>
            <strong>{totalPercent}%</strong> завершено
          </p>
        </div>
      </div>
    </div>
  )
}