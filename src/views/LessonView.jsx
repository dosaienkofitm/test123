import { useState, useEffect, useRef } from 'react'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { modules } from '../data/courseData'
import LessonContent from '../components/LessonContent'

const QUIZ_QUESTIONS = [
  { q: 'Для чого використовується Adobe Photoshop?', options: ['Для створення таблиць і баз даних','Для редагування фотографій, створення дизайну та цифрового контенту','Для написання програмного коду','Для монтажу аудіофайлів'], answer: 1 },
  { q: 'Яка гаряча клавіша використовується для інструмента Brush Tool?', options: ['V','E','B','G'], answer: 2 },
  { q: 'Яка робоча область Photoshop оптимізована для обробки фотографій?', options: ['Painting','Motion','Graphic and Web','Photography'], answer: 3 },
  { q: 'Яка комбінація клавіш показує весь документ у вікні?', options: ['Ctrl + 1','Ctrl + +','Ctrl + −','Ctrl + 0'], answer: 3 },
  { q: 'Для чого використовується Hand Tool?', options: ['Для малювання пензлем','Для обрізки зображення','Для переміщення по збільшеному документу','Для створення тексту'], answer: 2 },
]

function QuizSection({ savedScore, onQuizSubmit }) {
  const total = QUIZ_QUESTIONS.length
  const [answers, setAnswers] = useState(Array(total).fill(null))
  const [submitted, setSubmitted] = useState(savedScore != null)
  const [score, setScore] = useState(savedScore ?? null)
  useEffect(() => { if (savedScore != null) { setScore(savedScore); setSubmitted(true) } }, [savedScore])
  const handleSelect = (qi, ai) => { if (!submitted) setAnswers(p => p.map((v, i) => i === qi ? ai : v)) }
  const handleSubmit = () => {
    const s = QUIZ_QUESTIONS.reduce((acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0), 0)
    setScore(s); setSubmitted(true); onQuizSubmit(s)
  }
  const handleReset = () => { setAnswers(Array(total).fill(null)); setSubmitted(false); setScore(null) }
  return (
    <div className="quiz-section">
      <h2 className="quiz-title">Тест за модулем 1</h2>
      <p className="quiz-subtitle">Adobe Photoshop: інтерфейс та основні інструменти</p>
      {QUIZ_QUESTIONS.map((q, qi) => (
        <div key={qi} className="quiz-question">
          <p className="quiz-q-text"><span className="quiz-q-num">{qi + 1}.</span> {q.q}</p>
          <div className="quiz-options">
            {q.options.map((opt, ai) => {
              let cls = 'quiz-option'
              if (submitted) { if (ai === q.answer) cls += ' correct'; else if (answers[qi] === ai) cls += ' wrong' }
              else if (answers[qi] === ai) cls += ' selected'
              return <button key={ai} className={cls} onClick={() => handleSelect(qi, ai)} disabled={submitted}><span className="quiz-option-letter">{String.fromCharCode(97+ai)})</span>{opt}</button>
            })}
          </div>
        </div>
      ))}
      {!submitted ? (
        <button className={`quiz-submit${answers.includes(null) ? ' disabled' : ''}`} disabled={answers.includes(null)} onClick={handleSubmit}>Перевірити відповіді</button>
      ) : (
        <div className="quiz-result">
          <div className={`quiz-score ${score===total?'perfect':score>=3?'good':'retry'}`}>
            {score===total?'🎉 Відмінно!':score>=3?'👍 Непогано!':'📚 Варто повторити'}
            <span className="quiz-score-num">{score} / {total}</span>
          </div>
          <button className="quiz-reset" onClick={handleReset}>Спробувати ще раз</button>
        </div>
      )}
    </div>
  )
}

function StarRating({ stars, max = 5 }) {
  return (
    <span className="star-rating">
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < stars ? 'star filled' : 'star empty'}>★</span>
      ))}
    </span>
  )
}

// ─── Блок завантаження роботи (тільки для уроку 15) ────────────────────────
function WorkUploadBlock({ user, onWorkSubmitted, alreadySubmitted, teacherGrade }) {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [done, setDone] = useState(alreadySubmitted)
  const inputRef = useRef(null)

  const handleFileChange = (e) => {
    const f = e.target.files[0]
    if (!f) return
    if (!f.type.startsWith('image/')) { alert('Оберіть зображення'); return }
    if (f.size > 10 * 1024 * 1024) { alert('Файл більше 10MB'); return }
    setFile(f)
    const reader = new FileReader()
    reader.onload = ev => setPreview(ev.target.result)
    reader.readAsDataURL(f)
  }

  const handleSubmit = async () => {
    if (!file || !user) return
    setUploading(true)
    try {
      // Читаємо файл як base64
      const base64 = await new Promise((res, rej) => {
        const r = new FileReader()
        r.onload = ev => res(ev.target.result)
        r.onerror = rej
        r.readAsDataURL(file)
      })
      const workData = {
        uid: user.uid,
        userName: user.displayName || user.email,
        userEmail: user.email,
        lessonId: 15,
        image: base64,
        submittedAt: new Date().toISOString(),
        grade: null,
        gradeComment: '',
      }
      // Зберігаємо в колекцію works з ключем uid (одна робота на учня)
      await setDoc(doc(db, 'works', user.uid), workData)
      setDone(true)
      onWorkSubmitted?.()
    } catch (err) {
      alert('Помилка: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  if (done) {
    return (
      <div className="work-submitted">
        <div className="work-submitted__icon">✓</div>
        <div className="work-submitted__text">
          <strong>Роботу надіслано!</strong>
          {teacherGrade != null ? (
            <span className="work-grade">Оцінка вчителя: <strong>{teacherGrade} / 5</strong></span>
          ) : (
            <span className="work-grade-pending">Очікує перевірки вчителем...</span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="work-upload">
      <p className="work-upload__hint">
        Виконайте практичне завдання уроку і прикріпіть скріншот вашої роботи.
      </p>

      {!preview ? (
        <button className="work-upload__pick" onClick={() => inputRef.current?.click()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          Обрати зображення
        </button>
      ) : (
        <div className="work-upload__preview-wrap">
          <img src={preview} alt="preview" className="work-upload__preview" />
          <button className="work-upload__change" onClick={() => { setFile(null); setPreview(null); if(inputRef.current) inputRef.current.value='' }}>
            Змінити
          </button>
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleFileChange} />

      {preview && (
        <button
          className={`btn-primary work-upload__submit${uploading ? ' btn-disabled' : ''}`}
          disabled={uploading}
          onClick={handleSubmit}
        >
          {uploading ? 'Надсилання...' : 'Надіслати роботу'}
        </button>
      )}
    </div>
  )
}

// ─── Основний компонент ─────────────────────────────────────────────────────
export default function LessonView({ id, progress, onMarkDone, user }) {
  const lesson = modules.flatMap(m => m.lessons || []).find(l => l.id === id)
  const isDone = progress[id] === true
  const isQuiz = id === 16
  const isPractice = id === 15
  const savedQuizScore = (progress.__quizScores || {})[id] ?? null
  const QUIZ_TOTAL = QUIZ_QUESTIONS.length

  const [workSubmitted, setWorkSubmitted] = useState(false)
  const [teacherGrade, setTeacherGrade] = useState(null)

  // Перевіряємо чи вже є надіслана робота
  useEffect(() => {
    if (!isPractice || !user?.uid) return
    const check = async () => {
      const snap = await getDoc(doc(db, 'works', user.uid))
      if (snap.exists()) {
        setWorkSubmitted(true)
        setTeacherGrade(snap.data().grade ?? null)
      }
    }
    check()
  }, [id, user?.uid])

  const handleWorkSubmitted = () => {
    setWorkSubmitted(true)
    onMarkDone(id)
  }

  // ── Таймер ──────────────────────────────────────────────────────────────
  const [timeLeft, setTimeLeft] = useState(0)
  const [canComplete, setCanComplete] = useState(true)
  const timerRef = useRef(null)
  const timeLeftRef = useRef(0)
  useEffect(() => { timeLeftRef.current = timeLeft }, [timeLeft])
  useEffect(() => {
    clearInterval(timerRef.current)
    // Для уроку з роботою — таймер є, але кнопка замінена на upload
    if (!lesson?.duration || isDone) { setTimeLeft(0); setCanComplete(true); return }
    const secs = lesson.duration * 60
    setTimeLeft(secs); timeLeftRef.current = secs; setCanComplete(false)
    timerRef.current = setInterval(() => {
      const next = timeLeftRef.current - 1
      timeLeftRef.current = next; setTimeLeft(next)
      if (next <= 0) { clearInterval(timerRef.current); setCanComplete(true) }
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [id])

  const mins = Math.floor(timeLeft / 60)
  const secs = String(timeLeft % 60).padStart(2, '0')

  if (!lesson) return (
    <><div className="left"><div className="section-header"><div className="section-title">Урок не знайдено</div></div></div><div className="right"><p>Урок з id {id} не існує.</p></div></>
  )

  return (
    <>
      <div className="left">
        <div className="section-header">
          <div className="section-title">{lesson.title}</div>
          {isDone && !isQuiz && <div className="progress">Пройдено ✓</div>}
          {isQuiz && savedQuizScore != null && <div className="progress quiz-score-badge">{savedQuizScore} / {QUIZ_TOTAL}</div>}
        </div>

        {!isQuiz && lesson.duration != null && (
          <div className="lesson-badges">
            <div className="badge badge-difficulty">Складність&nbsp;<StarRating stars={lesson.stars ?? 0} /></div>
            <div className={`badge badge-time${timeLeft > 0 && !isDone ? ' badge-time--counting' : ''}`}>
              <span className="badge-time-icon">⏱</span>
              {isDone ? `~${lesson.duration} хв` : timeLeft > 0 ? `~${mins}:${secs} хв` : `~${lesson.duration} хв`}
            </div>
          </div>
        )}

        <div className="module">
          {isQuiz ? (
            <QuizSection savedScore={savedQuizScore} onQuizSubmit={(s) => onMarkDone(id, s)} />
          ) : (
            <LessonContent blocks={lesson.blocks} />
          )}
        </div>

        {/* Кнопки дій */}
        {!isQuiz && (
          <div className="lesson-actions">
            {isPractice ? (
              // Урок 5 — замість «відмітити» блок завантаження роботи
              // Але тільки якщо таймер скінчився або урок вже пройдено
              !canComplete && !isDone ? (
                <div className="lesson-actions-wrap">
                  <button className="btn-primary btn-disabled" disabled>
                    📎 Прикріпити роботу
                  </button>
                  <span className="btn-hint">Зачекайте {mins}:{secs} — після таймера можна надіслати роботу</span>
                </div>
              ) : (
                <WorkUploadBlock
                  user={user}
                  onWorkSubmitted={handleWorkSubmitted}
                  alreadySubmitted={workSubmitted || isDone}
                  teacherGrade={teacherGrade}
                />
              )
            ) : (
              // Всі інші уроки — стандартна кнопка
              !isDone ? (
                <div className="lesson-actions-wrap">
                  <button
                    className={`btn-primary${canComplete ? '' : ' btn-disabled'}`}
                    disabled={!canComplete}
                    onClick={() => canComplete && onMarkDone(id)}
                  >
                    ✓ Відмітити як виконане
                  </button>
                  {!canComplete && <span className="btn-hint">Зачекайте {mins}:{secs} — кнопка активується після таймера</span>}
                </div>
              ) : (
                <div className="lesson-done-badge">✓ Урок виконано</div>
              )
            )}
          </div>
        )}
      </div>

      <div className="right">
        <h3>Опис уроку</h3>
        <p>{lesson.title}</p>
        {!isQuiz && lesson.duration != null && (
          <div className="right-meta">
            <div className="right-meta-item"><span className="right-meta-label">Складність</span><StarRating stars={lesson.stars ?? 0} /></div>
            <div className="right-meta-item"><span className="right-meta-label">Час</span><span>~{lesson.duration} хв</span></div>
          </div>
        )}
        {isQuiz && savedQuizScore != null && (
          <div className="right-meta">
            <div className="right-meta-item"><span className="right-meta-label">Результат тесту</span><span style={{color:'#486b85',fontWeight:600}}>{savedQuizScore} / {QUIZ_TOTAL}</span></div>
          </div>
        )}
        <p style={{ marginTop:'1rem', opacity:0.7, fontSize:'0.875rem' }}>
          {isDone ? isQuiz ? `✓ Тест пройдено: ${savedQuizScore}/${QUIZ_TOTAL}` : '✓ Ви вже пройшли цей урок.' : 'Прочитайте матеріал і відмітьте урок як виконаний.'}
        </p>
      </div>
    </>
  )
}