export default function LessonView({ id }) {
  return (
    <>
      <div className="left">

        <div className="section-header">
          <div className="section-title">
            Урок {id}
          </div>
        </div>

        <div className="module">
          <div className="module-header">
            <span>Контент уроку</span>
          </div>

          <div className="module-content">
            Планується контент для уроку з js файлу (id: {id})
          </div>
        </div>

      </div>

      <div className="right">
        <h3>Опис уроку</h3>
        <p>Це приклад уроку з id {id}</p>
      </div>
    </>
  )
}