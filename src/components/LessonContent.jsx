import LessonSlider from './LessonSlider'

const IMG = import.meta.env.BASE_URL + 'images/'

// Рендеримо один блок залежно від його типу
function Block({ block }) {
  switch (block.type) {

    case 'heading': {
      const Tag = `h${block.level}`
      return <Tag>{block.text}</Tag>
    }

    case 'paragraph':
      return (
        <p>
          {block.bold && <strong>{block.bold}</strong>}
          {block.text}
        </p>
      )

    case 'image':
      return (
        <img
          src={`${IMG}${block.src}`}
          alt={block.alt}
          className="lesson-image lesson-image--centered"
        />
      )

    case 'caption':
      return (
        <p style={{ textAlign: 'center', fontStyle: 'italic', opacity: 0.7 }}>
          {block.text}
        </p>
      )

    case 'tip':
      return (
        <p style={{ fontStyle: 'italic' }}>
          <strong>Порада:</strong> {block.text}
        </p>
      )

    case 'list':
      return (
        <ul>
          {block.items.map((item, i) => (
            <li key={i}>
              {item.bold && <strong>{item.bold}</strong>}
              {item.text}
              {item.subItems && (
                <ul>
                  {item.subItems.map((sub, j) => <li key={j}>{sub}</li>)}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )

    // Список з гарячими клавішами: [kbd] текст
    case 'keylist':
      return (
        <ul>
          {block.items.map((item, i) => (
            <li key={i}>
              <kbd>{item.key}</kbd> — {item.text}
            </li>
          ))}
        </ul>
      )

    // Список інструментів: Назва [kbd] — опис
    case 'toollist':
      return (
        <ul>
          {block.items.map((item, i) => (
            <li key={i}>
              <strong>{item.name}</strong> <kbd>{item.key}</kbd> — {item.text}
            </li>
          ))}
        </ul>
      )

    // Нумерований список кроків
    case 'steps':
      return (
        <ol>
          {block.items.map((step, i) => <li key={i}>{step}</li>)}
        </ol>
      )

    // React-слайдер замість inline HTML
    case 'slider':
      return <LessonSlider slides={block.slides} />

    default:
      return null
  }
}

export default function LessonContent({ blocks }) {
  if (!blocks || blocks.length === 0) return null
  return (
    <div className="lesson-content">
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  )
}