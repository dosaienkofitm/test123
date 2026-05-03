export default function LessonButton({ lesson, moduleIndex, lessonIndex = 0, setView }) {

  const id = Number(`${moduleIndex + 1}${lessonIndex + 1}`)

  return (
    <button
      className={`lesson-btn ${lesson.done ? 'done' : 'pending'}`}
      onClick={() => setView({ type: 'lesson', id })}
    >
      <span className="lesson-title">{lesson.title}</span>

      <span className="lesson-status">
        {lesson.done ? 'Пройдено' : 'Не пройдено'}
      </span>
    </button>
  )
}