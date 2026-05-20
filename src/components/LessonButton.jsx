export default function LessonButton({ lesson, setView }) {
  return (
    <button
      className={`lesson-btn ${lesson.done ? 'done' : 'pending'}`}
      onClick={() => setView({ type: 'lesson', id: lesson.id })}
    >
      <span className="lesson-title">{lesson.title}</span>
      <span className="lesson-status">
        {lesson.done ? 'Пройдено' : 'Не пройдено'}
      </span>
    </button>
  )
}