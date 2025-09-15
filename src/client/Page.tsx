
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { NavLink } from 'react-router'
import './Page.css'
import { useTranslation } from 'react-i18next';

const baseUrl = import.meta.env.VITE_BASE_URL || '/';

function Header() {
  const {t, i18n} = useTranslation();
  return <header>
    <div className="logo-vnau-header left">
        <img src={`${baseUrl}img/logo.png`} alt="Логотип ВНАУ|Logo VNAU"/>
        <span className="vnau"> { t('header.title') } </span>
    </div>
    <nav className="center">
        <ul>
          <li><NavLink to="/">{ t('header.main')}</NavLink></li>
          <li><NavLink to="/students">{ t('header.applicants')}</NavLink></li>
          <li><NavLink to="/schedule">{ t('header.schedule')}</NavLink></li>
        </ul>
    </nav>
   <div className="language-header right switch">
      <input id="language-toggle" className="check-toggle check-toggle-round-flat" type="checkbox" />
      <label htmlFor="language-toggle"></label>
	    <span className="on" onClick={() => i18n.changeLanguage('uk') } >UA</span>
	    <span className="off" onClick={() => i18n.changeLanguage('en') } >EN</span>
  	</div>
  </header>
}

function Footer() {
  const {t, i18n} = useTranslation();
  return <footer>          
    <span>{ t('footer.info')}</span>        
    <span>{ t('footer.created_pt1') } <FontAwesomeIcon icon={faHeart} /> { t('footer.created_pt2') } 
    <NavLink to="/developers">{ t('footer.devs_link')}</NavLink></span>                        
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
