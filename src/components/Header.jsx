const IMG = `${import.meta.env.BASE_URL}images`

export default function Header({ onBurgerClick, setView }) {
  return (
    <header className="header">
      <a href="#" className="logo">
        <img src={`${IMG}/Logo.png`} alt="Logo" />
      </a>

      <div className="header-right">
        <button
          className="btn-outline"
          onClick={() => setView({ type: 'register' })}
        >
          Зареєструватись
        </button>

        <button
          className="login"
          onClick={() => setView({ type: 'login' })}
        >
          <img src={`${IMG}/loginIcon.png`} alt="" />
          <span>Увійти</span>
        </button>
      </div>

      <div className="burger" onClick={onBurgerClick}>
        <img src={`${IMG}/BurgerButton.png`} alt="menu" />
      </div>
    </header>
  )
}