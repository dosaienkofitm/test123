export default function Nav({ view, setView }) {
  return (
    <nav className="nav">
      <button
        className={`nav-btn ${view.type === 'course' ? 'active' : ''}`}
        onClick={() => setView({ type: 'course' })}
      >
        Курс
      </button>

      <button
        className={`nav-btn ${view.type === 'progress' ? 'active' : ''}`}
        onClick={() => setView({ type: 'progress' })}
      >
        Прогрес
      </button>

      <button
        className={`nav-btn ${view.type === 'resources' ? 'active' : ''}`}
        onClick={() => setView({ type: 'resources' })}
      >
        Додаткові матеріали
      </button>
    </nav>
  )
}