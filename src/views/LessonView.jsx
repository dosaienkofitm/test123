import { modules } from '../data/courseData'

export default function LessonView({ id, progress, onMarkDone }) {
  // Знаходимо урок по id
  const lesson = modules.flatMap(m => m.lessons || []).find(l => l.id === id)
  const isDone = progress[id] === true

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

        <div className="module">
          <div className="lesson-content"
            dangerouslySetInnerHTML={{ __html: lesson.content }}
          />
        </div>

        <div className="lesson-actions">
          {!isDone ? (
            <button className="btn-primary" onClick={() => onMarkDone(id)}>
              ✓ Відмітити як виконане
            </button>
          ) : (
            <div className="lesson-done-badge">✓ Урок виконано</div>
          )}
        </div>
      </div>

      <div className="right">
        <h3>Опис уроку</h3>
        <p>{lesson.title}</p>
        <p style={{ marginTop: '1rem', opacity: 0.7, fontSize: '0.875rem' }}>
          {isDone ? '✓ Ви вже пройшли цей урок.' : 'Прочитайте матеріал і відмітьте урок як виконаний.'}
        </p>
      </div>
    </>
  )
}