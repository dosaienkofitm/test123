import { useState } from 'react'

export default function LoginView({ setView }) {
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
        <h2 className="auth-title">Увійти</h2>
        <p className="auth-subtitle">Раді бачити вас знову</p>

        {submitted ? (
          <div className="auth-success">
            Вхід поки недоступний — бекенд у розробці.
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
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
              Увійти
            </button>
          </form>
        )}

        <p className="auth-footer">
          Ще немає акаунту?{' '}
          <button className="auth-link" onClick={() => setView({ type: 'register' })}>
            Зареєструватись
          </button>
        </p>
      </div>
    </div>
  )
}