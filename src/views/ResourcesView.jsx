const BASE = import.meta.env.BASE_URL

const RESOURCES = [
  {
    title: 'Конспект модуля 1',
    description: 'Інтерфейс та основні інструменти Photoshop',
    file: 'document1.pdf',
    size: 'PDF',
  },
  {
    title: 'Шпаргалка гарячих клавіш',
    description: 'Усі корисні комбінації клавіш у Photoshop',
    file: 'document2.pdf',
    size: 'PDF',
  },
  {
    title: 'Практичне завдання',
    description: 'Завдання для самостійної роботи до модуля 1',
    file: 'document3.pdf',
    size: 'PDF',
  },
]

export default function ResourcesView() {
  return (
    <>
      <div className="left">
        <div className="section-header">
          <div className="section-title">Додаткові матеріали</div>
        </div>

        <div className="module">
          <div className="module-header">
            <span>Матеріали для завантаження</span>
            <div className="module-info">
              <span className="module-progress">{RESOURCES.length} файли</span>
            </div>
          </div>

          <div className="resources-list">
            {RESOURCES.map((res, i) => (
              <a
                key={i}
                href={`${BASE}${res.file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="resource-card"
              >
                <div className="resource-card__icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 15V3m0 12-4-4m4 4 4-4"/>
                    <path d="M2 17v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2"/>
                  </svg>
                </div>
                <div className="resource-card__body">
                  <span className="resource-card__title">{res.title}</span>
                  <span className="resource-card__desc">{res.description}</span>
                </div>
                <div className="resource-card__badge">{res.size}</div>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="right">
        <h3>Опис</h3>
        <p>Ресурси для практики та поглибленого вивчення матеріалу.</p>
        <p style={{ marginTop: '1rem', opacity: 0.6, fontSize: '0.85rem' }}>
          Натисніть на файл — він відкриється у новій вкладці.
        </p>
      </div>
    </>
  )
}