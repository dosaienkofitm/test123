import { useState, useEffect } from 'react'
import LessonButton from './LessonButton'

export default function Module({
  title,
  progress,
  lessons,
  moduleIndex,
  setView,
  expandedAll
}) {

  const [open, setOpen] = useState(progress === "100%")

  
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
          <span className="module-progress">{progress}</span>
          <span>{open ? '-' : '+'}</span>
        </div>
      </div>

      {open && lessons && (
        <div className="module-content">
          {lessons.map((lesson, lessonIndex) => (
            <LessonButton
              key={lessonIndex}
              lesson={lesson}
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