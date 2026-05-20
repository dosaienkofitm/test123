import { useState, useRef, useEffect } from 'react'
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { modules } from '../data/courseData'
import { calcModulePercent } from '../utils/progress'

// Стискаємо до 128px і конвертуємо в base64
function resizeToBase64(file, maxSize = 128) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1)
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.82))
    }
    img.onerror = reject
    img.src = url
  })
}

export default function ProfileView({ user, progress, onAvatarUpdate }) {
  const [avatarSrc, setAvatarSrc] = useState(null)
  const [workLink, setWorkLink] = useState('')
  const [works, setWorks] = useState([])
  const [uploading, setUploading] = useState(false)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [linkSaved, setLinkSaved] = useState(false)
  const [linkError, setLinkError] = useState('')
  const avatarInputRef = useRef(null)

  // Завантажуємо аватарку і роботи з Firestore
  useEffect(() => {
    if (!user?.uid) return
    const fetchData = async () => {
      const snap = await getDoc(doc(db, 'users', user.uid))
      if (snap.exists()) {
        const data = snap.data()
        if (data.photoURL) setAvatarSrc(data.photoURL)
        setWorks(data.works || [])
      }
    }
    fetchData()
  }, [user?.uid])

  const quizScores = progress.__quizScores || {}

  // Аватарка — base64 тільки у Firestore, НЕ в Auth
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { alert('Файл більше 5MB'); return }
    setAvatarUploading(true)
    try {
      const base64 = await resizeToBase64(file, 128)
      // Зберігаємо тільки у Firestore — Auth не чіпаємо
      await updateDoc(doc(db, 'users', user.uid), { photoURL: base64 })
      setAvatarSrc(base64)
      // Повідомляємо App щоб оновив аватар у хедері
      onAvatarUpdate?.(base64)
    } catch (err) {
      alert('Помилка: ' + err.message)
    } finally {
      setAvatarUploading(false)
      if (avatarInputRef.current) avatarInputRef.current.value = ''
    }
  }

  const handleSaveWork = async () => {
    setLinkError('')
    if (!workLink.trim()) { setLinkError('Введіть посилання'); return }
    if (!workLink.startsWith('http')) { setLinkError('Посилання має починатись з http'); return }
    setUploading(true)
    try {
      const practiceLesson = modules.flatMap(m => m.lessons || []).find(l => l.id === 15)
      const workEntry = {
        url: workLink.trim(),
        lessonId: 15,
        lessonTitle: practiceLesson?.title || 'Урок 5',
        addedAt: new Date().toISOString(),
      }
      await updateDoc(doc(db, 'users', user.uid), { works: arrayUnion(workEntry) })
      setWorks(prev => [...prev, workEntry])
      setWorkLink('')
      setLinkSaved(true)
      setTimeout(() => setLinkSaved(false), 3000)
    } catch (err) {
      setLinkError('Помилка: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const practiceLesson = modules[0]?.lessons?.find(l => l.id === 15)
  // Показуємо аватарку: спочатку з Firestore, потім першу літеру
  const displayAvatar = avatarSrc

  return (
    <>
      <div className="left">
        <div className="section-header">
          <div className="section-title">Особистий кабінет</div>
        </div>

        <div className="profile-hero">
          <div className="profile-avatar-wrap">
            {displayAvatar ? (
              <img src={displayAvatar} alt="avatar" className="profile-avatar-img" />
            ) : (
              <div className="profile-avatar-placeholder">
                {(user?.displayName || user?.email || '?')[0].toUpperCase()}
              </div>
            )}
            <button
              className="profile-avatar-edit"
              onClick={() => avatarInputRef.current?.click()}
              title="Змінити фото"
              disabled={avatarUploading}
            >
              {avatarUploading ? (
                <span style={{ fontSize: 9, fontWeight: 700 }}>...</span>
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              )}
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
            />
          </div>
          <div className="profile-hero-info">
            <div className="profile-hero-name">{user?.displayName || 'Користувач'}</div>
            <div className="profile-hero-email">{user?.email}</div>
          </div>
        </div>

        <div className="profile-section-title">Прогрес навчання</div>
        <div className="profile-modules">
          {modules.map((m, i) => {
            const lessons = m.lessons || []
            const done = lessons.filter(l => progress[l.id]).length
            const total = lessons.length
            const percent = calcModulePercent(lessons, progress)
            const quizLesson = lessons.find(l => l.id === 16)
            const quizScore = quizLesson ? (quizScores[quizLesson.id] ?? null) : null

            return (
              <div className="profile-module-row" key={i}>
                <div className="profile-module-name">{m.title.replace(/ —.*/, '')}</div>
                <div className="profile-module-stats">
                  <div className="profile-module-bar-wrap">
                    <div className="profile-module-bar">
                      <div className="profile-module-bar-fill" style={{ width: `${percent}%` }} />
                    </div>
                    <span className="profile-module-bar-label">{percent}%</span>
                  </div>
                  <span className="profile-module-done">Пройдено {done}/{total}</span>
                  {quizScore !== null && (
                    <span className="profile-module-quiz">Оцінка за тест {quizScore}/5</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="profile-section-title" style={{ marginTop: '2rem' }}>
          Прикріпити роботу
        </div>
        <div className="profile-work-form">
          <p className="profile-work-hint">
            Додайте посилання на Google Drive до уроку «{practiceLesson?.title}»
          </p>
          <div className="profile-work-row">
            <input
              className="profile-work-input"
              type="url"
              placeholder="https://drive.google.com/..."
              value={workLink}
              onChange={e => setWorkLink(e.target.value)}
            />
            <button
              className={`btn-primary profile-work-btn${uploading ? ' btn-disabled' : ''}`}
              disabled={uploading}
              onClick={handleSaveWork}
            >
              {uploading ? 'Збереження...' : 'Зберегти'}
            </button>
          </div>
          {linkError && <p className="profile-work-error">{linkError}</p>}
          {linkSaved && <p className="profile-work-success">✓ Посилання збережено!</p>}
        </div>

        <div className="profile-section-title" style={{ marginTop: '1.5rem' }}>
          Роботи користувача {user?.displayName || ''}
        </div>
        {works.length === 0 ? (
          <div className="profile-works-empty"><p>Поки пусто :(</p></div>
        ) : (
          <div className="profile-works-grid">
            {works.map((w, i) => (
              <a key={i} href={w.url} target="_blank" rel="noopener noreferrer" className="profile-work-card">
                <div className="profile-work-card__icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                </div>
                <div className="profile-work-card__info">
                  <span className="profile-work-card__lesson">{w.lessonTitle}</span>
                  <span className="profile-work-card__url">Відкрити →</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      <div className="right">
        <h3>Профіль</h3>
        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem', opacity: 0.8 }}>
          <p>👤 {user?.displayName || 'Не вказано'}</p>
          <p>✉️ {user?.email}</p>
        </div>
        <p style={{ marginTop: '1.5rem', opacity: 0.6, fontSize: '0.8rem', lineHeight: 1.6 }}>
          Тут відображається ваш прогрес по курсу та завантажені роботи.
        </p>
      </div>
    </>
  )
}