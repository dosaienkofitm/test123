window.slideLesson = function(trackId, dir) {
  const track = document.getElementById(trackId)
  if (!track) return

  const slides = track.querySelectorAll('.lesson-slider__slide')
  const total = slides.length
  const counter = document.getElementById('counter-' + trackId)

  let current = parseInt(track.dataset.current || '0')
  current = (current + dir + total) % total

  track.dataset.current = current
  track.style.transform = `translateX(-${current * 100}%)`

  if (counter) counter.textContent = `${current + 1} / ${total}`
}