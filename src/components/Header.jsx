export default function Header() {
  return (
    <header className="header">

      <a href="#" className="logo">
        <img src="/images/Logo.png" alt="Logo" />
      </a>

      <div className="burger">
        <img src="/images/BurgerButton.png" alt="menu" />
      </div>

      <div className="header-right">
        <div className="btn-outline">Зареєструватись</div>

        <div className="login">
          <img src="/images/loginIcon.png" alt="login" />
          <span>Увійти</span>
        </div>
      </div>

    </header>
  )
}