import lessonsData from './lessons.json'

export const modules = [
  {
    title: "Модуль 1 — Інтерфейс та база",
    lessons: lessonsData.filter(l => l.moduleId === 1),
  },
  {
    title: "Модуль 2 — Зображення та шари",
    lessons: [
      { id: 21, moduleId: 2, order: 1, title: "Формати файлів", duration: null, stars: 0, blocks: [] },
      { id: 22, moduleId: 2, order: 2, title: "Кадрування",      duration: null, stars: 0, blocks: [] },
      { id: 23, moduleId: 2, order: 3, title: "Шари",            duration: null, stars: 0, blocks: [] },
    ],
  },
  { title: "Модуль 3 — Виділення та ретуш",    lessons: [] },
  { title: "Модуль 4 — Колір та дизайн",       lessons: [] },
  { title: "Модуль 5 — Просунуті інструменти", lessons: [] },
]

export const defaultDoneIds = new Set([])