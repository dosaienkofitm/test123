import { useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

export default function RegisterView({ setView }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(cred.user, { displayName: name })
      // Створюємо документ користувача в Firestore
      await setDoc(doc(db, 'users', cred.user.uid), {
        name,
        email,
        doneIds: [],
        quizScores: {},
        createdAt: new Date(),
      })
      setView({ type: 'course' })
    } catch (err) {
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('Цей email вже зареєстрований.')
          break
        case 'auth/weak-password':
          setError('Пароль має бути не менше 6 символів.')
          break
        case 'auth/invalid-email':
          setError('Некоректний email.')
          break
        default:
          setError('Помилка реєстрації. Спробуйте ще раз.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Зареєструватись</h2>
        <p className="auth-subtitle">Створіть акаунт, щоб почати навчання</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Ім'я</label>
            <input
              type="text"
              placeholder="Ваше ім'я"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button
            type="submit"
            className="btn-primary auth-submit"
            disabled={loading}
          >
            {loading ? 'Реєстрація...' : 'Зареєструватись'}
          </button>
        </form>

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