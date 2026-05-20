import { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from './firebase'
import Header from './components/Header'
import Nav from './components/Nav'
import Card from './components/Card'
import BurgerMenu from './components/BurgerMenu'
import CourseView from './views/CourseView'
import ProgressView from './views/ProgressView'
import LessonView from './views/LessonView'
import ResourcesView from './views/ResourcesView'
import LoginView from './views/LoginView'
import RegisterView from './views/RegisterView'
import { loadProgress, markLesson } from './utils/progress'
import { defaultDoneIds } from './data/courseData'

export default function App() {
  const [view, setView] = useState({ type: 'course' })
  const [progress, setProgress] = useState(() => loadProgress(defaultDoneIds))
  const [burgerOpen, setBurgerOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  // Слухаємо стан авторизації
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        // Завантажуємо прогрес з Firestore
        const ref = doc(db, 'users', firebaseUser.uid)
        const snap = await getDoc(ref)
        if (snap.exists()) {
          const data = snap.data()
          // Перетворюємо масив назад в об'єкт
          const restored = {}
          if (data.doneIds) data.doneIds.forEach(id => { restored[id] = true })
          if (data.quizScores) Object.assign(restored, { __quizScores: data.quizScores })
          setProgress(restored)
        }
      } else {
        setProgress(loadProgress(defaultDoneIds))
      }
      setAuthLoading(false)
    })
    return unsub
  }, [])

  // Зберігаємо прогрес у Firestore при кожній зміні
  const saveProgressToFirestore = async (newProgress) => {
    if (!user) return
    const doneIds = Object.keys(newProgress).filter(k => k !== '__quizScores' && newProgress[k] === true).map(Number)
    const quizScores = newProgress.__quizScores || {}
    const ref = doc(db, 'users', user.uid)
    await setDoc(ref, { doneIds, quizScores, updatedAt: new Date() }, { merge: true })
  }

  const handleMarkDone = (lessonId, quizScore = null) => {
    setProgress(prev => {
      const updated = markLesson(prev, lessonId)
      // Якщо це тест — зберігаємо бал
      if (quizScore !== null) {
        updated.__quizScores = { ...(prev.__quizScores || {}), [lessonId]: quizScore }
      }
      saveProgressToFirestore(updated)
      return updated
    })
  }

  const handleLogout = async () => {
    await signOut(auth)
    setView({ type: 'course' })
  }

  const renderView = () => {
    switch (view.type) {
      case 'course':
        return <CourseView setView={setView} progress={progress} />
      case 'progress':
        return <ProgressView progress={progress} />
      case 'resources':
        return <ResourcesView />
      case 'lesson':
        return (
          <LessonView
            id={view.id}
            progress={progress}
            onMarkDone={handleMarkDone}
          />
        )
      case 'login':
        return <LoginView setView={setView} />
      case 'register':
        return <RegisterView setView={setView} />
      default:
        return null
    }
  }

  if (authLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#a0aec0' }}>
        Завантаження...
      </div>
    )
  }

  return (
    <>
      <Header
        onBurgerClick={() => setBurgerOpen(true)}
        setView={setView}
        user={user}
        onLogout={handleLogout}
      />
      <BurgerMenu
        isOpen={burgerOpen}
        onClose={() => setBurgerOpen(false)}
        setView={setView}
        view={view}
      />
      <Nav setView={setView} view={view} />
      <Card>{renderView()}</Card>
    </>
  )
}