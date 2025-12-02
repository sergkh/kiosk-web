import './DevelopersPage.css'
import front from '../assets/developers/front.png'
import back from '../assets/developers/back.png'
import design from '../assets/developers/desing.png'
import research from '../assets/developers/research.png'
import { useTranslation } from 'react-i18next'

function DevelopersPage() {
  const {t} = useTranslation();

  return (
    <main className="developers-page">
      <div className='developers-span'>
        <h1>{t('developers.title')}</h1>
      </div>

      <div className="team-grid">
        <div className='developer_stydent'>
          <img src={back} alt="Front-end developer|Front-end розробник" />
          <h4>{t('developers.students.artem')}</h4>
          <span>Back-end</span>
        </div>
        <div className='developer_stydent'>
          <img src={front} alt="Front-end developer|Front-end розробник" />
          <h4>{t('developers.students.ioann')}</h4>
          <p>Front-end</p>
        </div>
        <div className='developer_stydent'>
          <img src={design} alt="Front-end developer|Front-end розробник" />
          <h4>{t('developers.students.kateryna')}</h4>
          <p>Designer</p>
        </div>
        <div className='developer_stydent'>
          <img src={research} alt="Front-end developer|Front-end розробник" />
          <h4>{t('developers.students.serhii')}</h4>
          <p>Content Researcher</p>
        </div>
      </div>

      <h2 className="section-title">{t('developers.teachers_title')}</h2>

      <div className="teachers-grid">
        <div className='developer_teachers'>
          {t('developers.teachers.serhii')}<br/>
          <em>{t('developers.senior_teacher')}</em>
        </div>
        <div className='developer_teachers'>
          {t('developers.teachers.alexander')}<br/>
          <em>{t('developers.senior_teacher')}</em>
        </div>
      </div>
    </main>
  );
}

export default DevelopersPage;

