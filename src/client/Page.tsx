
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays, faGraduationCap, faHeart, faNewspaper } from '@fortawesome/free-solid-svg-icons'
import { NavLink } from 'react-router'
import './Page.css'
import { useTranslation } from 'react-i18next';
import IdleWatcher from './components/IdleWatcher';
import TopNav, { type MenuItem } from './components/TopNav';
import LangSwitch from './components/LangSwitch';

const baseUrl = import.meta.env.VITE_BASE_URL || '/';
const showStudentInfo = import.meta.env.VITE_SHOW_STUD_INFO !== 'false';

function Header() {
  const {t, i18n} = useTranslation();

  const links: MenuItem[] = [
    { path: '/', icon: faNewspaper, label: 'header.main' },
    showStudentInfo ? { path: '/students', icon: faGraduationCap, label: 'header.applicants' } : null,
    { path: '/schedule', icon: faCalendarDays, label: 'header.schedule' },
  ].filter(Boolean) as MenuItem[];

  return <header>
    <div className="logo-vnau-header left">
        <img src={`${baseUrl}img/logo.png`} alt="Логотип ВНАУ|Logo VNAU"/>
        <span className="vnau"> { t('header.title') } </span>
    </div>
  
    <TopNav className="center" items={links} />
  
    <div className="right">
      <LangSwitch/>
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
      <IdleWatcher redirectTo="/idle" />
      <main>
        { children }
      </main>
      <Footer />
    </>
  )
}

export default Page
