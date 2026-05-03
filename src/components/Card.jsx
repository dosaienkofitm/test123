export default function Card({ children }) {
  return (
    <div className="container">
      <div className="card">
        {children}
      </div>
    </div>
  )
}