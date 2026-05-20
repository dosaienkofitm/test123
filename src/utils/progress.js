const STORAGE_KEY = 'ps_course_progress'

// Повертає об'єкт виду { 11: true, 12: true, ... }
export function loadProgress(defaultDoneIds) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
    const init = {}
    defaultDoneIds.forEach(id => { init[id] = true })
    saveProgress(init)
    return init
  } catch {
    return {}
  }
}

export function saveProgress(progressObj) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progressObj))
}

export function markLesson(progressObj, lessonId) {
  const updated = { ...progressObj, [lessonId]: true }
  saveProgress(updated)
  return updated
}

// Підраховує відсотки для модуля та загальний прогрес
export function calcModulePercent(lessons, progress) {
  if (!lessons || lessons.length === 0) return 0
  const done = lessons.filter(l => progress[l.id]).length
  return Math.round((done / lessons.length) * 100)
}

export function calcTotalPercent(modules, progress) {
  const allLessons = modules.flatMap(m => m.lessons || [])
  if (allLessons.length === 0) return 0
  const done = allLessons.filter(l => progress[l.id]).length
  return Math.round((done / allLessons.length) * 100)
}