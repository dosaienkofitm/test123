import { useState, useEffect } from 'react'
import LessonButton from './LessonButton'
import { calcModulePercent } from '../utils/progress'

export default function Module({
  title,
  lessons,
  moduleIndex,
  setView,
  expandedAll,
  progress
}) {
  const percent = calcModulePercent(lessons, progress)
  const [open, setOpen] = useState(percent === 100)

  useEffect(() => {
    setOpen(expandedAll)
  }, [expandedAll])

  return (
    <div className="module">
      <div
        className="module-header"
        onClick={() => setOpen(prev => !prev)}
      >
        <span>{title}</span>
        <div className="module-info">
          <span className="module-progress">{percent}%</span>
          <span>{open ? '-' : '+'}</span>
        </div>
      </div>

      {open && lessons && lessons.length > 0 && (
        <div className="module-content">
          {lessons.map((lesson, lessonIndex) => (
            <LessonButton
              key={lessonIndex}
              lesson={{ ...lesson, done: !!progress[lesson.id] }}
              moduleIndex={moduleIndex}
              lessonIndex={lessonIndex}
              setView={setView}
            />
          ))}
        </div>
      )}
    </div>
  )
}