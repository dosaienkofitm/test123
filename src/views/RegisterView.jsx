import { useState } from 'react'

export default function RegisterView({ setView }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Зареєструватись</h2>
        <p className="auth-subtitle">Створіть акаунт, щоб почати навчання</p>

        {submitted ? (
          <div className="auth-success">
            Реєстрація поки недоступна — бекенд у розробці.
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label>Ім'я</label>
              <input
                type="text"
                placeholder="Ваше ім'я"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div className="auth-field">
              <label>Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="auth-field">
              <label>Пароль</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary auth-submit">
              Зареєструватись
            </button>
          </form>
        )}

        <p className="auth-footer">
          Вже є акаунт?{' '}
          <button className="auth-link" onClick={() => setView({ type: 'login' })}>
            Увійти
          </button>
        </p>
      </div>
    </div>
  )
}