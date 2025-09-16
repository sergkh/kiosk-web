import CardButton from '../components/cards/CardButton';
import './DevelopersPage.css'
import product from '../assets/developers/product.png'
import front from '../assets/developers/front.png'
import back from '../assets/developers/back.png'
import design from '../assets/developers/desing.png'
import research from '../assets/developers/research.png'

function DevelopersPage() {
  return (  
      <main>
        <header>
          <h1>Команда розробників</h1>
          <p>Тут ви можете ознайомитися з командою, яка створила сайт</p>
        </header>

        <div className="team-grid">
          <CardButton title="Product Manager" subtitle="Сторожук Артем" image={product} />
          <CardButton title="Designer" subtitle="Салій Катерина" image={design}/>
          <CardButton title="Frontend розробник" subtitle="Конопліцький Іоанн" image={front} />
          <CardButton title="Backend розробник" subtitle="Сторожук Артем" image={back} />
          <CardButton title="Designer" subtitle="Папіровий Сергій" image={design} />
          <CardButton title="Content Researcher" subtitle="Салій Катерина" image={research} />
        </div>

        <h2 className="section-title">Викладачі, які допомагали у створенні проєкту</h2>

        <div className="teachers-grid">
          <CardButton title="Бойко Олексій Романович" subtitle="старший викладач кафедри КНЕК"/>
          <CardButton title="Хрущак Сергій Вікторович" subtitle="старший викладач кафедри КНЕК"/>
          <CardButton title="Лебідь Олександр Васильович" subtitle="старший викладач кафедри КНЕК"/>
        </div>
      </main>
  );
}

export default DevelopersPage;

