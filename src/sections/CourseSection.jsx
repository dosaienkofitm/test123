import Card from '../components/Card'
import Module from '../components/Module'
import { modules } from '../data/courseData'

export default function CourseSection() {
  return (
    <div className="container">
      <div className="title">Основи Adobe Photoshop</div>

      <Card
        title="Почніть з того місця, на якому зупинилися"
        progress="65%"
        rightTitle="Загальна інформація про курс"
        rightText="Курс допоможе освоїти Photoshop з нуля..."
      >

        <div className="actions">
          <button className="btn-primary">Продовжити курс</button>
          <button className="btn-secondary">Розгорнути всі</button>
        </div>

        {modules.map((m, i) => (
          <Module key={i} {...m} />
        ))}

      </Card>
    </div>
  )
}