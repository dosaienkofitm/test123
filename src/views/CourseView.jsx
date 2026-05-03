import { useState } from 'react'
import Module from '../components/Module'
import { modules } from '../data/courseData'

export default function CourseView({ setView }) {

  const [expandedAll, setExpandedAll] = useState(false)

  const toggleAll = () => {
    setExpandedAll(prev => !prev)
  }

  return (
  <div className="container main">
      <div className="title">Основи Adobe Photoshop</div>

      <div className="card">

        <div className="left">

          <div className="section-header">
            <div className="section-title">
              Почніть з того місця, на якому зупинилися
            </div>
            <div className="progress">65%</div>
          </div>

          <div className="actions">
            <button className="btn-primary">
              Продовжити курс
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
            />
          ))}

        </div>

        <div className="right">
          <h3>Загальна інформація про курс</h3>
          <p>
            Курс допоможе освоїти Photoshop з нуля: від базових інструментів
            до створення повноцінних дизайнерських робіт.
          </p>
        </div>

      </div>
    </div>
  )
}