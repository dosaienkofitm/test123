import { useState } from 'react'
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

  const handleMarkDone = (lessonId) => {
    setProgress(prev => markLesson(prev, lessonId))
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

  return (
    <>
      <Header
        onBurgerClick={() => setBurgerOpen(true)}
        setView={setView}
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