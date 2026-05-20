export default function Header({ onBurgerClick, setView }) {
  return (
    <header className="header">
      <a href="#" className="logo">
        <img src="/images/Logo.png" alt="Logo" />
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
          <img src="/images/loginIcon.png" alt="" />
          <span>Увійти</span>
        </button>
      </div>

      <div className="burger" onClick={onBurgerClick}>
        <img src="/images/BurgerButton.png" alt="menu" />
      </div>
    </header>
  )
}