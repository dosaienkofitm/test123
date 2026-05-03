import { useState } from 'react'
import Header from './components/Header'
import Nav from './components/Nav'
import Card from './components/Card'

import CourseView from './views/CourseView'
import ProgressView from './views/ProgressView'
import LessonView from './views/LessonView'
import ResourcesView from './views/ResourcesView'

export default function App() {

  const [view, setView] = useState({ type: 'course' })

  const renderView = () => {
    switch (view.type) {
      case 'course':
        return <CourseView setView={setView} />

      case 'progress':
        return <ProgressView />

      case 'resources':
        return <ResourcesView />
      case 'lesson':
        return <LessonView id={view.id} />

      default:
        return null
    }
  }

  return (
    <>
      <Header />
      <Nav setView={setView} view = {view}/>

      <Card>
        {renderView()}
      </Card>
    </>
  )
}