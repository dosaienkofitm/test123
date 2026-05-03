export default function ProgressView() {
  return (
    <>
      <div className="left">
        <div className="section-header">
          <div className="section-title">Прогрес</div>
          <div className="progress">65%</div>
        </div>

        <div className="module">
          <div className="module-header">
            <span>Загальний прогрес</span>
            <div className="module-info">
              <span className="module-progress">65%</span>
              <span>-</span>
            </div>
          </div>
        </div>
      </div>

      <div className="right">
        <h3>Інформація</h3>
        <p>Ви пройшли більшу частину курсу.</p>
      </div>
    </>
  )
}