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
          <p>{t('developers.students.artem')}</p>
          <p>Back-end</p>
        </div>
        <div className='developer_stydent'>
          <img src={front} alt="Front-end developer|Front-end розробник" />
          <p>{t('developers.students.ioann')}</p>
          <p>Front-end</p>
        </div>
        <div className='developer_stydent'>
          <img src={research} alt="Front-end developer|Front-end розробник" />
          <p>{t('developers.students.kateryna')}</p>
          <p>Content Researcher</p>
        </div>
        <div className='developer_stydent'>
          <img src={design} alt="Front-end developer|Front-end розробник" />
          <p>{t('developers.students.serhii')}</p>
          <p>Designer</p>
        </div>
      </div>

      <h2 className="section-title">{t('developers.teachers_title')}</h2>

      <div className="teachers-grid">
        <div className='developer_teachers'>
          <p>{t('developers.teachers.serhii')}</p>
          <p>{t('developers.senior_teacher')}</p>
        </div>
        <div className='developer_teachers'>
          <p>{t('developers.teachers.alexander')}</p>
          <p>{t('developers.senior_teacher')}</p>
        </div>
      </div>
    </main>
  );
}

export default DevelopersPage;

