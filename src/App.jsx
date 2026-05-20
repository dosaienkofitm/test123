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
import ProfileView from './views/ProfileView'
import { loadProgress, markLesson } from './utils/progress'
import { defaultDoneIds } from './data/courseData'

export default function App() {
  const [view, setView] = useState({ type: 'course' })
  const [progress, setProgress] = useState(() => loadProgress(defaultDoneIds))
  const [burgerOpen, setBurgerOpen] = useState(false)
  const [user, setUser] = useState(null)
  // Аватарка окремо — бо Auth не зберігає base64
  const [avatarSrc, setAvatarSrc] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        const ref = doc(db, 'users', firebaseUser.uid)
        const snap = await getDoc(ref)
        if (snap.exists()) {
          const data = snap.data()
          // Прогрес
          const restored = {}
          if (data.doneIds) data.doneIds.forEach(id => { restored[id] = true })
          if (data.quizScores) restored.__quizScores = data.quizScores
          setProgress(restored)
          // Аватарка з Firestore
          if (data.photoURL) setAvatarSrc(data.photoURL)
        }
      } else {
        setProgress(loadProgress(defaultDoneIds))
        setAvatarSrc(null)
      }
      setAuthLoading(false)
    })
    return unsub
  }, [])

  const saveProgressToFirestore = async (newProgress) => {
    if (!auth.currentUser) return
    const doneIds = Object.keys(newProgress)
      .filter(k => k !== '__quizScores' && newProgress[k] === true)
      .map(Number)
    const quizScores = newProgress.__quizScores || {}
    await setDoc(
      doc(db, 'users', auth.currentUser.uid),
      { doneIds, quizScores, updatedAt: new Date() },
      { merge: true }
    )
  }

  const handleMarkDone = (lessonId, quizScore = null) => {
    setProgress(prev => {
      const updated = markLesson(prev, lessonId)
      if (quizScore !== null) {
        updated.__quizScores = { ...(prev.__quizScores || {}), [lessonId]: quizScore }
      }
      saveProgressToFirestore(updated)
      return updated
    })
  }

  const handleLogout = async () => {
    await signOut(auth)
    setProgress(loadProgress(defaultDoneIds))
    setAvatarSrc(null)
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
        return <LessonView id={view.id} progress={progress} onMarkDone={handleMarkDone} />
      case 'login':
        return <LoginView setView={setView} />
      case 'register':
        return <RegisterView setView={setView} />
      case 'profile':
        return (
          <ProfileView
            user={user}
            progress={progress}
            onAvatarUpdate={(base64) => setAvatarSrc(base64)}
          />
        )
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
        avatarSrc={avatarSrc}
        onLogout={handleLogout}
      />
      <BurgerMenu isOpen={burgerOpen} onClose={() => setBurgerOpen(false)} setView={setView} view={view} />
      <Nav setView={setView} view={view} />
      <Card>{renderView()}</Card>
    </>
  )
}