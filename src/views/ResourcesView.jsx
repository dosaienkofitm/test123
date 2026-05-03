export default function RecourcesView({ id }) {
  return (
    <>
      <div className="left">
        <div className="section-header">
          <div className="section-title">Додаткові матеріали</div>
        </div>

        <div className="module">
          <div className="module-header">
            <span>Додаткові матеріали</span>
            <div className="module-info">
              <span className="module-progress">3 файли</span>
              <span>-</span>
            </div>
          </div>
        </div>
      </div>

      <div className="right">
        <h3>Опис</h3>
        <p>Ресурси для практики.</p>
      </div>
    </>
  )
}