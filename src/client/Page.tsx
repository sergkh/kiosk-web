
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { NavLink } from 'react-router'
import './Page.css'

function Header() {
  return <header>
    <div className="logo-vnau-header">
        <img src="/img/logo.png" alt="Логотип ВНАУ|Logo VNAU"/>
        <span className="vnau">Вінницький національний <br/> аграрний університет</span>
    </div>
    <nav>
        <ul>
          <li><NavLink to="/">Головна</NavLink></li>
          <li><NavLink to="/students">Студентам</NavLink></li>
          <li><NavLink to="/schedule">Розклад</NavLink></li>
        </ul>
    </nav>
   <div  className="switch">
      <input id="language-toggle" className="check-toggle check-toggle-round-flat" type="checkbox" />
      <label htmlFor="language-toggle"></label>
	    <span className="on">UA</span>
	    <span className="off">EN</span>
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
