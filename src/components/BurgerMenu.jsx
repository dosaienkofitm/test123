import { useEffect } from 'react'

export default function BurgerMenu({ isOpen, onClose, setView, view }) {

  // Автоматично закривати якщо екран став широким
  useEffect(() => {
    if (!isOpen) return
    const handleResize = () => {
      if (window.innerWidth > 768) onClose()
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const navItems = [
    { label: 'Курс', type: 'course' },
    { label: 'Прогрес', type: 'progress' },
    { label: 'Додаткові матеріали', type: 'resources' },
  ]

  const handleNav = (type) => {
    setView({ type })
    onClose()
  }

  return (
    <>
      <div className="burger-overlay" onClick={onClose} />
      <div className="burger-menu">

        <div className="burger-menu-header">
          <button className="burger-close" onClick={onClose}>&#x2715;</button>
        </div>

        <div className="burger-section">
          <div className="burger-section-label">Навігація</div>
          {navItems.map(item => (
            <button
              key={item.type}
              className={`burger-nav-item ${view.type === item.type ? 'active' : ''}`}
              onClick={() => handleNav(item.type)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="burger-divider" />

        <div className="burger-section">
          <div className="burger-section-label">Акаунт</div>
          <button
            className="burger-auth-btn primary"
            onClick={() => { setView({ type: 'register' }); onClose() }}
          >
            Зареєструватись
          </button>
          <button
            className="burger-auth-btn secondary"
            style={{ marginTop: '6px' }}
            onClick={() => { setView({ type: 'login' }); onClose() }}
          >
            Увійти
          </button>
        </div>

      </div>
    </>
  )
}