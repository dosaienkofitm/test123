import Card from '../components/Card'

export default function InfoCardsSection() {
  return (
    <div className="container compact">

      <Card
        title="Прогрес"
        progress="65%"
        rightTitle="Інформація"
        rightText="Ви пройшли більшу частину курсу."
      >
        <div className="module">
          <div className="module-header">
            <span>Загальний прогрес</span>
            <div className="module-info">
              <span className="module-progress">65%</span>
              <span>-</span>
            </div>
          </div>
        </div>
      </Card>

      <Card
        title="Матеріали"
        rightTitle="Опис"
        rightText="Ресурси для практики."
      >
        <div className="module">
          <div className="module-header">
            <span>Додаткові файли</span>
            <div className="module-info">
              <span className="module-progress">3 файли</span>
              <span>-</span>
            </div>
          </div>
        </div>
      </Card>

      <Card
        title="Урок"
        rightTitle="Опис"
        rightText="Наступний крок у навчанні."
      >
        <div className="module">
          <div className="module-header">
            <span>Поточний урок</span>
            <div className="module-info">
              <span className="module-progress">Шари</span>
              <span>-</span>
            </div>
          </div>
        </div>
      </Card>

    </div>
  )
}