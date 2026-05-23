import { useState } from 'react'

const IMG = import.meta.env.BASE_URL + 'images/'

export default function LessonSlider({ slides }) {
  const [current, setCurrent] = useState(0)
  const total = slides.length

  const go = (dir) => {
    setCurrent(c => (c + dir + total) % total)
  }

  return (
    <div className="lesson-slider">
      <div className="lesson-slider__viewport">
        <div
          className="lesson-slider__track"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div className="lesson-slider__slide" key={i}>
              <img
                src={`${IMG}${slide.image}`}
                alt={slide.caption}
                className="lesson-slider__img"
              />
              <p className="lesson-slider__caption">{slide.caption}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="lesson-slider__controls">
        <button className="lesson-slider__btn" onClick={() => go(-1)}>&#8592;</button>
        <span className="lesson-slider__counter">{current + 1} / {total}</span>
        <button className="lesson-slider__btn" onClick={() => go(1)}>&#8594;</button>
      </div>
    </div>
  )
}