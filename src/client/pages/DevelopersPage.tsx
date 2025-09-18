import './DevelopersPage.css'
import front from '../assets/developers/front.png'
import back from '../assets/developers/back.png'
import design from '../assets/developers/desing.png'
import research from '../assets/developers/research.png'

function DevelopersPage() {
  return (
    <main>
      <div className='developers-span'>
        <h1>Команда розробників</h1>
        <p>Тут ви можете ознайомитися з командою, яка створила сайт</p>
      </div>

      <div className="team-grid">
        <div className='developer_stydent'>
          <img src={front} alt="Front-end developer|Front-end розробник" />
          <p>Конопліцький Іоанн</p>
          <p>Front-end</p>
        </div>
        <div className='developer_stydent'>
          <img src={back} alt="Front-end developer|Front-end розробник" />
          <p>Сторожук Артем</p>
          <p>Back-end</p>
        </div>  <div className='developer_stydent'>
          <img src={design} alt="Front-end developer|Front-end розробник" />
          <p>Папіровий Сергій</p>
          <p>Designer</p>
        </div>  <div className='developer_stydent'>
          <img src={research} alt="Front-end developer|Front-end розробник" />
          <p>Салій Катерина</p>
          <p>Content Researcher</p>
        </div>
      </div>

      <h2 className="section-title">Викладачі, які допомагали у створенні проєкту</h2>


      <div className="teachers-grid">
        <div className='developer_teachers'>
          <p>Бойко Олексій Романович</p>
          <p>Старший викладач</p>
        </div>
        <div className='developer_teachers'>
          <p>Хрущак Сергій Вікторович</p>
          <p>Старший викладач</p>
        </div>
        <div className='developer_teachers'>
          <p>Лебідь Олександр Васильович</p>
          <p>Старший викладач</p>
        </div>
      </div>
    </main>
  );
}

export default DevelopersPage;

