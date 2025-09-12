
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { NavLink } from 'react-router'
import './Page.css'

const baseUrl = import.meta.env.VITE_BASE_URL || '/';

function Header() {
  return <header>
    <div className="logo-vnau-header left">
        <img src={`${baseUrl}img/logo.png`} alt="Логотип ВНАУ|Logo VNAU"/>
        <span className="vnau">Вінницький національний <br/> аграрний університет</span>
    </div>
    <nav className="center">
        <ul>
          <li><NavLink to="/">Головна</NavLink></li>
          <li><NavLink to="/students">Студентам</NavLink></li>
          <li><NavLink to="/schedule">Розклад</NavLink></li>
        </ul>
    </nav>
    <div className="language-header right">
      <img src={`${baseUrl}img/flags/uk.png`} alt="Українська" />
      <img src={`${baseUrl}img/flags/en.png`} alt="Англійська" />
    </div>
  </header>
}

function Footer() {
  return <footer>          
    <span>© 2025 ВНАУ. Інформація може оновлюватися. Актуальні дані уточнюйте в приймальній комісії</span>        
    <span>Cтворено з <FontAwesomeIcon icon={faHeart} /> для студентів. <NavLink to="/developers">Команда розробників</NavLink></span>                        
  </footer>
}

function Page({children}: {children?: React.ReactNode}) {
  return (
    <>
      <Header />
        <main>
          { children }
        </main>
      <Footer />
    </>
  )
}

export default Page
