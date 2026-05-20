import { useState, useRef, useEffect } from 'react'

const IMG = `${import.meta.env.BASE_URL}images`

export default function Header({ onBurgerClick, setView, user, avatarSrc, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="header">
      <a href="#" className="logo" onClick={() => setView({ type: 'course' })}>
        <img src={`${IMG}/Logo.png`} alt="Logo" />
      </a>

      <div className="header-right">
        {user ? (
          <div className="user-menu" ref={dropdownRef}>
            <button
              className="user-menu__trigger"
              onClick={() => setDropdownOpen(v => !v)}
            >
              {/* avatarSrc — base64 з Firestore; fallback — перша літера */}
              {avatarSrc ? (
                <img src={avatarSrc} alt="avatar" className="user-menu__avatar" />
              ) : (
                <div className="user-menu__avatar user-menu__avatar--placeholder">
                  {(user.displayName || user.email || '?')[0].toUpperCase()}
                </div>
              )}
              <span className="user-menu__name">
                {user.displayName || user.email}
              </span>
              <svg
                className={`user-menu__chevron${dropdownOpen ? ' open' : ''}`}
                width="12" height="12" viewBox="0 0 12 12"
              >
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              </svg>
            </button>

            {dropdownOpen && (
              <div className="user-dropdown">
                <button
                  className="user-dropdown__item"
                  onClick={() => { setView({ type: 'profile' }); setDropdownOpen(false) }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="8" r="4"/>
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                  </svg>
                  Особистий кабінет
                </button>
                <button
                  className="user-dropdown__item user-dropdown__item--danger"
                  onClick={() => { onLogout(); setDropdownOpen(false) }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Вийти з акаунта
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button className="btn-outline" onClick={() => setView({ type: 'register' })}>
              Зареєструватись
            </button>
            <button className="login" onClick={() => setView({ type: 'login' })}>
              <img src={`${IMG}/loginIcon.png`} alt="" />
              <span>Увійти</span>
            </button>
          </>
        )}
      </div>

      <div className="burger" onClick={onBurgerClick}>
        <img src={`${IMG}/BurgerButton.png`} alt="menu" />
      </div>
    </header>
  )
}