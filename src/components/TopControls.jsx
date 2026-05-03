export default function TopControls({ setView }) {
  return (
    <div className="nav">
      <button onClick={() => setView({ type: 'course' })}>
        Курс
      </button>

      <button onClick={() => setView({ type: 'progress' })}>
        Прогрес
      </button>

      <button onClick={() => setView({ type: 'lesson', id: 11 })}>
        Урок
      </button>
    </div>
  )
}