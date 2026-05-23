import { useState, useEffect } from 'react'
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

export default function TeacherView() {
  const [works, setWorks] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)   // робота що переглядається
  const [grade, setGrade] = useState('')
  const [comment, setComment] = useState('')
  const [saving, setSaving] = useState(false)
  const [savedId, setSavedId] = useState(null)

  useEffect(() => {
    const fetchWorks = async () => {
      const snap = await getDocs(collection(db, 'works'))
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      // Сортуємо: спочатку без оцінки
      list.sort((a, b) => (a.grade != null) - (b.grade != null))
      setWorks(list)
      setLoading(false)
    }
    fetchWorks()
  }, [])

  const handleSelect = (work) => {
    setSelected(work)
    setGrade(work.grade != null ? String(work.grade) : '')
    setComment(work.gradeComment || '')
    setSavedId(null)
  }

  const handleSaveGrade = async () => {
    if (!selected) return
    const g = parseInt(grade)
    if (isNaN(g) || g < 0 || g > 5) { alert('Оцінка від 0 до 5'); return }
    setSaving(true)
    try {
      await updateDoc(doc(db, 'works', selected.id), {
        grade: g,
        gradeComment: comment.trim(),
        gradedAt: new Date().toISOString(),
      })
      // Оновлюємо локальний список
      setWorks(prev => prev.map(w =>
        w.id === selected.id ? { ...w, grade: g, gradeComment: comment.trim() } : w
      ))
      setSelected(prev => ({ ...prev, grade: g, gradeComment: comment.trim() }))
      setSavedId(selected.id)
    } catch (err) {
      alert('Помилка: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="left">
        <div className="section-header">
          <div className="section-title">Панель викладача</div>
          <div className="progress">{works.filter(w => w.grade != null).length}/{works.length} перевірено</div>
        </div>

        {loading ? (
          <p style={{opacity:0.5,marginTop:'2rem'}}>Завантаження робіт...</p>
        ) : works.length === 0 ? (
          <div className="profile-works-empty"><p>Робіт ще немає</p></div>
        ) : (
          <div className="teacher-works-list">
            {works.map(work => (
              <div
                key={work.id}
                className={`teacher-work-row${selected?.id === work.id ? ' active' : ''}`}
                onClick={() => handleSelect(work)}
              >
                <img src={work.image} alt="робота" className="teacher-work-thumb" />
                <div className="teacher-work-info">
                  <span className="teacher-work-name">{work.userName}</span>
                  <span className="teacher-work-email">{work.userEmail}</span>
                  <span className="teacher-work-date">
                    {new Date(work.submittedAt).toLocaleDateString('uk-UA')}
                  </span>
                </div>
                <div className="teacher-work-status">
                  {work.grade != null ? (
                    <span className="teacher-grade-badge">{work.grade}/5</span>
                  ) : (
                    <span className="teacher-grade-badge teacher-grade-badge--pending">Нова</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="right">
        {selected ? (
          <div className="teacher-review">
            <h3>Робота учня</h3>
            <p className="teacher-review-student">{selected.userName}</p>
            <p className="teacher-review-email" style={{opacity:0.5,fontSize:'0.8rem'}}>{selected.userEmail}</p>

            <img src={selected.image} alt="робота учня" className="teacher-review-image" />

            <div className="teacher-grade-form">
              <label className="teacher-grade-label">Оцінка (0–5)</label>
              <div className="teacher-grade-stars">
                {[0,1,2,3,4,5].map(n => (
                  <button
                    key={n}
                    className={`teacher-grade-star-btn${parseInt(grade)===n?' active':''}`}
                    onClick={() => setGrade(String(n))}
                  >
                    {n}
                  </button>
                ))}
              </div>

              <label className="teacher-grade-label" style={{marginTop:'12px'}}>Коментар (необов'язково)</label>
              <textarea
                className="teacher-grade-comment"
                placeholder="Напишіть коментар до роботи..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                rows={3}
              />

              <button
                className={`btn-primary teacher-grade-submit${saving||grade===''?' btn-disabled':''}`}
                disabled={saving || grade === ''}
                onClick={handleSaveGrade}
              >
                {saving ? 'Збереження...' : 'Зберегти оцінку'}
              </button>

              {savedId === selected.id && (
                <p className="teacher-grade-saved">✓ Оцінку збережено!</p>
              )}
            </div>
          </div>
        ) : (
          <div style={{opacity:0.5,marginTop:'2rem',fontSize:'0.9rem'}}>
            <h3>Перевірка робіт</h3>
            <p style={{marginTop:'1rem'}}>Оберіть роботу зі списку щоб переглянути і виставити оцінку.</p>
          </div>
        )}
      </div>
    </>
  )
}